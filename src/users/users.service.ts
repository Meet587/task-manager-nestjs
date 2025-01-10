import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepositoryInterface } from './../db/interfaces/user.interface';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { UserEntity } from 'src/db/entities/user.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @Inject('userRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const isExist = await this.userRepository.findByEmail(
        createUserDto.email,
      );
      if (isExist) {
        throw new ConflictException('user alredy exist with this email.');
      }
      const hashPassword = await bcrypt.hash(createUserDto.password, 12);
      const newUser = await this.userRepository.save({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashPassword,
      });
      delete newUser.password;
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundException('user not found with this email.');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

}
