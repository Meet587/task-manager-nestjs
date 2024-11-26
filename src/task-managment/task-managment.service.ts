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
import { ResponceDto } from './../interceptors/dtos/resposeDto.dto';

@Injectable({ scope: Scope.REQUEST })
export class TaskManagmentService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<ResponceDto<Task>> {
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
      await newTask.save();
      return { message: 'task created.', data: newTask };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getTasksForUser(): Promise<ResponceDto<Task[]>> {
    try {
      const payload = this.request.user as JwtPayload;
      if (!payload.id) {
        throw new UnauthorizedException();
      }
      const userId = payload.id;
      const list = await this.taskModel.find({ user: userId });
      return { message: 'task list fetched.', data: list };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getTaskById(taskId: string): Promise<ResponceDto<Task | null>> {
    try {
      if (!isValidObjectId(taskId)) {
        throw new BadRequestException('invalid task id.');
      }
      const task = await this.taskModel.findById(taskId);
      return { message: 'task fetched.', data: task };
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
  ): Promise<ResponceDto<Task | null>> {
    try {
      if (!isValidObjectId(taskId)) {
        throw new BadRequestException('invalid task id.');
      }
      const oldTask = await this.taskModel.findById(taskId);
      if (!oldTask) {
        throw new NotFoundException('task not found.');
      }
      const updatedTask = await this.taskModel.findByIdAndUpdate(
        taskId,
        {
          status: updateTaskStatus.status,
        },
        { new: true },
      );
      return { message: 'task updated.', data: updatedTask };
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
  ): Promise<ResponceDto<Task | null>> {
    try {
      if (!isValidObjectId(taskId)) {
        throw new BadRequestException('invalid task id.');
      }
      const oldTask = await this.taskModel.findById(taskId);
      if (!oldTask) {
        throw new NotFoundException('task not found.');
      }
      const updated = await this.taskModel.findByIdAndUpdate(
        taskId,
        {
          title: updateTaskDto.title,
          description: updateTaskDto.description,
          status: updateTaskDto.status,
        },
        { new: true },
      );
      return { message: 'task updated.', data: updated };
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
