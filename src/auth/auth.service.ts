import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategy/jwt-payload.interface';
import { UserService } from './../users/users.service';
import { UserEntity } from 'src/db/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    try {
      const user = await this.userService.createUser(createUserDto);

      const payload: JwtPayload = {
        id: user.id.toString(),
        email: user.email,
      };
      const { token, refreshToken } = await this.generateToken(payload);
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        token,
        refreshToken,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload: JwtPayload = {
        id: user.id.toString(),
        email: user.email,
      };
      const { token, refreshToken } = await this.generateToken(payload);
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        token,
        refreshToken,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async generateToken(payload: JwtPayload): Promise<Record<string, string>> {
    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_SECRET_EXP,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXP,
      }),
    ]);

    return {
      token,
      refreshToken,
    };
  }
}
