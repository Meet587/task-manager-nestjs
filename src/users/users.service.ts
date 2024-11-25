import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(name: string, email: string): Promise<User> {
    try {
      const newUser = new this.userModel({ name, email });
      return await newUser.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateUser(
    id: string,
    name: string,
    email: string,
  ): Promise<User | null> {
    try {
      if (!isValidObjectId(id)) {
        throw new NotFoundException('User not found with this id.');
      }
      return await this.userModel
        .findByIdAndUpdate(id, { name, email }, { new: true })
        .exec();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
