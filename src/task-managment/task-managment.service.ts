import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { isValidObjectId, Model } from 'mongoose';
import { JwtPayload } from 'src/auth/strategy/jwt-payload.interface';
import { Task } from 'src/schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatus } from './dto/update-task-status-req.dto';

@Injectable({ scope: Scope.REQUEST })
export class TaskManagmentService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const payload = this.request.user as JwtPayload;
      if (!payload.id) {
        throw new UnauthorizedException();
      }
      const newTask = new this.taskModel({
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status,
        user: payload.id,
      });
      return await newTask.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getTasksForUser(): Promise<Task[]> {
    try {
      const payload = this.request.user as JwtPayload;
      if (!payload.id) {
        throw new UnauthorizedException();
      }
      const userId = payload.id;
      return this.taskModel.find({ user: userId }).exec();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    try {
      if (!isValidObjectId(taskId)) {
        throw new BadRequestException('invalid task id.');
      }
      return this.taskModel.findById(taskId).exec();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async updateTaskStatsu(
    taskId: string,
    updateTaskStatus: UpdateTaskStatus,
  ): Promise<Task | null> {
    try {
      if (!isValidObjectId(taskId)) {
        throw new BadRequestException('invalid task id.');
      }
      const oldTask = await this.taskModel.findById(taskId);
      if (!oldTask) {
        throw new NotFoundException('task not found.');
      }
      return await this.taskModel
        .findByIdAndUpdate(
          taskId,
          {
            status: updateTaskStatus.status,
          },
          { new: true },
        )
        .exec();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task | null> {
    try {
      if (!isValidObjectId(taskId)) {
        throw new BadRequestException('invalid task id.');
      }
      const oldTask = await this.taskModel.findById(taskId);
      if (!oldTask) {
        throw new NotFoundException('task not found.');
      }
      return await this.taskModel
        .findByIdAndUpdate(
          taskId,
          {
            title: updateTaskDto.title,
            description: updateTaskDto.description,
            status: updateTaskDto.status,
          },
          { new: true },
        )
        .exec();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteTask(taskId: string): Promise<boolean> {
    try {
      if (!isValidObjectId(taskId)) {
        throw new BadRequestException('invalid task id.');
      }
      const oldTask = await this.taskModel.findById(taskId);
      if (!oldTask) {
        throw new NotFoundException('task not found.');
      }
      await this.taskModel.findByIdAndDelete(taskId).exec();
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
