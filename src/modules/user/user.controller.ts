import {
  Controller,
  Post,
  Body,
  ParseUUIDPipe,
  Param,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUsersDTO } from 'src/dtos/user.dto';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signin')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: LoginUsersDTO })
  createUser(@Body() createUserDto: { username: string; password: string }) {
    return this.userService.createUser(
      createUserDto.username,
      createUserDto.password,
    );
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginUsersDTO })
  signIn(@Body() login: LoginUsersDTO) {
    return this.userService.login(login);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the user' })
  findUser(@Param('id', ParseUUIDPipe) userId: string) {
    return this.userService.findUser(userId);
  }
}
