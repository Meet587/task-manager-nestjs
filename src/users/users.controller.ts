import { Controller, Body, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from 'src/schemas/user.schema';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() body: { name: string; email: string },
  ): Promise<User | null> {
    return this.userService.updateUser(id, body.name, body.email);
  }
}
