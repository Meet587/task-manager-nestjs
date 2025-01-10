import { Controller, UseGuards, Get } from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('User Managment')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-all-users')
  @ApiOperation({
    summary: 'get all user list',
    operationId: 'getAllUserList',
  })
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
}
