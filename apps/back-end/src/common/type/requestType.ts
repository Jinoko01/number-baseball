import { Request } from 'express';

export type JwtPayload = {
  sub: string;
  username: string;
  refreshToken: string;
};

export type AuthenticatedRequest = Request & { user: JwtPayload };
