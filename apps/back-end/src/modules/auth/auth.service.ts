import { ForbiddenException, Injectable } from '@nestjs/common';
import UsersService from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { Users } from '../entities/users.entity';
import { GithubCodeDto } from './dto/github-code.dto';
import axios, { AxiosResponse } from 'axios';
import { AUTH_PROVIDER } from 'src/constants/provider';

export interface AuthInterface {
  nickname: string;
  avatar: string;
  name: string;
  provider: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public async getGithubInfo(code: string): Promise<AuthInterface> {
    const getTokenUrl: string = 'https://github.com/login/oauth/access_token';

    const request = {
      code,
      client_id: this.configService.get<string>('GITHUB_CLIENT_ID'),
      client_secret: this.configService.get<string>('GITHUB_CLIENT_SECRET'),
    };

    const response: AxiosResponse = await axios.post(getTokenUrl, request, {
      headers: {
        accept: 'application/json',
      },
    });

    const { access_token } = response.data;

    const getUserUrl: string = 'https://api.github.com/user';

    const { data } = await axios.get(getUserUrl, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    console.log(data);

    const { login, avatar_url, name, bio, company } = data;

    const authInfo: AuthInterface = {
      nickname: login,
      avatar: avatar_url,
      name,
      provider: AUTH_PROVIDER.GITHUB,
    };

    return authInfo;
  }

  async githubSignIn(githubCodeDto: GithubCodeDto) {
    const { code } = githubCodeDto;
    const authInfo: AuthInterface = await this.getGithubInfo(code);
    let user = await this.usersService.findByNickname(authInfo.nickname);

    if (!user) {
      user = await this.usersService.create({
        nickname: authInfo.nickname,
        avatar: authInfo.avatar,
        name: authInfo.name,
        provider: authInfo.provider,
      });
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async signOut(userId: number) {
    await this.usersService.update(userId, {
      refreshToken: undefined,
    });
  }

  async refreshAllTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('refresh token이 존재하지 않습니다.');
    }

    const isRefreshTokenMatched = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!isRefreshTokenMatched) {
      throw new ForbiddenException('refresh token이 일치하지 않습니다.');
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private async hashFn(data: string): Promise<string> {
    return argon2.hash(data);
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashFn(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(user: Users): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.nickname,
        },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.nickname,
        },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
