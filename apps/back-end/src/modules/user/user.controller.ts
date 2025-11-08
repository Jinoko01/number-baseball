import { Controller, Post, Body } from '@nestjs/common';
import UserService from './user.service';
import { GithubCodeDto } from './dto/user.dto';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/github-info')
  public async getGithubInfo(@Body() githubCodeDto: GithubCodeDto) {
    console.log(githubCodeDto);
    const user = await this.userService.getGithubInfo(githubCodeDto);

    return {
      status: 200,
      message: '깃허브 유저 정보를 조회하였습니다.',
      data: {
        user,
      },
    };
  }
}
