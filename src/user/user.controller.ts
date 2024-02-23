import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { CommonResponseDto } from '../common/dto/common-response.dto';
import { ResponseMessage } from '../common/dto/response-message.enum';
import { TokenDto } from './dto/token.dto';
import { IsPublic } from '../common/decorator/is-public.decorator';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @IsPublic()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CommonResponseDto<void>> {
    await this.userService.createUser(createUserDto);

    return CommonResponseDto.success(ResponseMessage.CREATE_SUCCESS);
  }

  @Post('/login')
  @IsPublic()
  async doLogin(
    @Body() loginDto: LoginDto,
  ): Promise<CommonResponseDto<TokenDto>> {
    const result = await this.userService.doLogin(loginDto);

    return CommonResponseDto.success<TokenDto>(
      ResponseMessage.LOGIN_SUCCESS,
    ).setData(result);
  }
}
