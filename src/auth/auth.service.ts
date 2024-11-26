import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategy/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    try {
      const { name, email, password } = createUserDto;
      const existingUser = await this.userModel.findOne({ email });

      if (existingUser) {
        throw new HttpException('User already exists', 403);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new this.userModel({
        name,
        email,
        password: hashedPassword,
      });

      const user = await newUser.save();
      const payload: JwtPayload = {
        id: user._id.toString(),
        email: user.email,
      };
      return {
        id: user._id,
        email: user.email,
        name: user.name,
        token: await this.jwtService.signAsync(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_SECRET_EXP,
        }),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload: JwtPayload = {
        id: user._id.toString(),
        email: user.email,
      };
      return {
        id: user._id,
        email: user.email,
        name: user.name,
        token: await this.jwtService.signAsync(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_SECRET_EXP,
        }),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
