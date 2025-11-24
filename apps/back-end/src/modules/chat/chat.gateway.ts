import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AccessTokenPayload } from 'src/common/type/jwy-payload.type';
import { HomeMessageDto } from './dto/home-message.dto';
import { RoomService } from '../room/room.service';
import { GameService } from '../game/game.service';

interface AuthenticatedSocket extends Socket {
  data: {
    userId?: number;
    username?: string;
  };
  handshake: Socket['handshake'] & {
    auth: {
      token?: string;
    };
  };
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'https://number-baseball.com'],
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly roomService: RoomService,
    private readonly gameService: GameService,
  ) {}

  afterInit() {
    console.log('서버 웹소켓 연결');
  }

  handleConnection(client: AuthenticatedSocket) {
    try {
      const accessToken = client.handshake.auth?.token;
      if (!accessToken) {
        client.disconnect();
        console.log('토큰 문제로 인한 연결 해제');
        return;
      }

      const payload = this.jwtService.verify<AccessTokenPayload>(accessToken, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });

      client.data.userId = payload.sub;
      client.data.username = payload.username;
    } catch (error) {
      console.error(`소켓 연결 에러: ${error}`);
      client.emit('error', { message: 'Unauthorized' });
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    console.log(`소켓 연결 해제: ${client.id}`);
  }

  private extractCookie(cookieHeader: string, key: string): string | null {
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    const target = cookies.find((c) => c.startsWith(`${key}=`));
    return target ? decodeURIComponent(target.split('=')[1]) : null;
  }

  /**
   * home 입장
   * home 메시지 전송
   */
  @SubscribeMessage('homeJoined')
  async handleJoinHome(@ConnectedSocket() client: AuthenticatedSocket) {
    const isValidUser = this.checkValidUser(client);
    if (!isValidUser) {
      return;
    }

    await client.join('home');
    client.emit('homeJoined');
  }

  @SubscribeMessage('homeLeave')
  async handleLeaveHome(@ConnectedSocket() client: AuthenticatedSocket) {
    const isValidUser = this.checkValidUser(client);
    if (!isValidUser) {
      return;
    }

    await client.leave('home');
    client.emit('homeLeave');
  }

  @SubscribeMessage('homeMessage')
  handleHomeMessage(
    @MessageBody() data: HomeMessageDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const isValidUser = this.checkValidUser(client);
    if (!isValidUser) {
      return;
    }

    const payload = {
      senderId: client.data.userId,
      senderName: client.data.username,
      message: data.message,
      sentAt: new Date().toISOString(),
    };

    this.server.to('home').emit('homeMessage', payload);
  }

  /**
   * room 입장
   * room 메시지 전송
   */
  @SubscribeMessage('roomJoined')
  async handleJoinGameRoom(
    @MessageBody() data: { roomId: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const isValidUser = this.checkValidUser(client);
    if (!isValidUser) {
      return;
    }

    const roomName = `room:${data.roomId}`;
    await client.join(roomName);

    const participants = await this.roomService.getParticipants(data.roomId);

    this.server.to(roomName).emit('roomJoined', participants);
  }

  @SubscribeMessage('gameStart')
  async handleGameStart(
    @MessageBody() data: { roomId: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const isValidUser = this.checkValidUser(client);
    if (!isValidUser) {
      return;
    }

    const roomName = `room:${data.roomId}`;
    try {
      const state = await this.gameService.startGame(data.roomId);
      this.server.to(roomName).emit('gameStart', state);
    } catch (e) {
      client.emit('error', { message: (e as Error).message });
    }
  }

  @SubscribeMessage('numbersSet')
  async handleNumbersSet(
    @MessageBody() data: { roomId: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const isValidUser = this.checkValidUser(client);
    if (!isValidUser) {
      return;
    }

    const roomName = `room:${data.roomId}`;
    try {
      const state = await this.gameService.getState(data.roomId);
      this.server.to(roomName).emit('gameState', state);
    } catch (e) {
      client.emit('error', { message: (e as Error).message });
    }
  }

  @SubscribeMessage('guessed')
  async handleGuessed(
    @MessageBody() data: { roomId: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const isValidUser = this.checkValidUser(client);
    if (!isValidUser) {
      return;
    }

    const roomName = `room:${data.roomId}`;
    try {
      const state = await this.gameService.getState(data.roomId);
      this.server.to(roomName).emit('gameState', state);
    } catch (e) {
      client.emit('error', { message: (e as Error).message });
    }
  }

  @SubscribeMessage('gameEnd')
  handleGameEnd(
    @MessageBody() data: { roomId: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const isValidUser = this.checkValidUser(client);
    if (!isValidUser) {
      return;
    }

    const roomName = `room:${data.roomId}`;

    const payload = {
      senderId: client.data.userId,
      senderName: client.data.username,
      message: `${client.data.username}님이 승리하였습니다.`,
      sentAt: new Date().toISOString(),
    };

    this.server.to(roomName).emit('roomMessage', payload);
  }

  @SubscribeMessage('roomLeave')
  async handleLeaveGameRoom(
    @MessageBody() data: { roomId: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const isValidUser = this.checkValidUser(client);
    if (!isValidUser) {
      return;
    }

    const roomName = `room:${data.roomId}`;
    await client.leave(roomName);

    const participants = await this.roomService.getParticipants(data.roomId);

    this.server.to(roomName).emit('roomJoined', participants);
  }

  @SubscribeMessage('roomMessage')
  handleRoomMessage(
    @MessageBody() data: { roomId: number; message: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const isValidUser = this.checkValidUser(client);
    if (!isValidUser) {
      return;
    }

    const payload = {
      senderId: client.data.userId,
      senderName: client.data.username,
      message: data.message,
      sentAt: new Date().toISOString(),
    };

    this.server.to(`room:${data.roomId}`).emit('roomMessage', payload);
  }

  private checkValidUser(client: AuthenticatedSocket) {
    if (!client.data.userId) {
      client.emit('error', { message: 'Unauthorized' });
      client.disconnect();
      return false;
    }
    return true;
  }
}
