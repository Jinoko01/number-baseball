import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { GithubCodeDto } from './dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { AUTH_PROVIDER } from 'src/constants/provider';

export interface AuthInterface {
  id: string;
  avatar: string;
  name: string;
  provider: AUTH_PROVIDER;
}

@Injectable()
export default class UserService {
  constructor(private readonly configService: ConfigService) {}

  public async getGithubInfo(
    githubCodeDto: GithubCodeDto,
  ): Promise<AuthInterface> {
    const { code } = githubCodeDto;
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

    const { login, avatar_url, name, bio, company } = data;

    const authInfo: AuthInterface = {
      id: login,
      avatar: avatar_url,
      name,
      provider: 'Github',
    };

    return authInfo;
  }
}
