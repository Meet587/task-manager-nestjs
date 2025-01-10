import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/strategy/jwt-payload.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatus } from './dto/update-task-status-req.dto';
import { ConfigService } from '@nestjs/config';
import { TaskRepositoryInterface } from './../db/interfaces/task.interface';
import { TasksEntity } from 'src/db/entities/task.entity';

@Injectable({ scope: Scope.REQUEST })
export class TaskManagmentService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly configService: ConfigService,
    @Inject('taskRepositoryInterface')
    private readonly taskRepository: TaskRepositoryInterface,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<any> {
    try {
      const payload = this.request.user as JwtPayload;
      if (!payload) {
        throw new UnauthorizedException();
      }

      const newTask = await this.taskRepository.save({
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status,
        userId: <any>payload.id,
      });

      return { message: 'task created.', data: newTask };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getTasksForUser(): Promise<any> {
    try {
      const payload = this.request.user as JwtPayload;
      if (!payload?.id) {
        throw new UnauthorizedException();
      }
      const userId = Number(payload.id);
      const list = await this.taskRepository.findAll({
        where: {
          userId: <any>userId,
        },
      });
      return { message: 'task list fetched.', data: list };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getTaskById(taskId: string): Promise<any> {
    try {
      const payload = this.request.user as JwtPayload;
      if (!payload?.id) {
        throw new UnauthorizedException();
      }
      const userId = Number(payload.id);
      const task = await this.taskRepository.findByCondition({
        where: {
          id: +taskId,
          userId: <any>userId,
        },
      });
      if (!task) {
        throw new NotFoundException('task not found.');
      }
      return { message: 'task fetched.', data: task };
    } catch (error) {
      console.log(error);
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
  ): Promise<any> {
    try {
      const task = await this.findById(taskId);

      task.status = updateTaskStatus.status;

      await this.taskRepository.save(task);
      return true;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async updateTask(taskId: string, updateTaskDto: UpdateTaskDto): Promise<any> {
    try {
      const task = await this.findById(taskId);
      task.title = updateTaskDto.title;
      task.description = updateTaskDto.description;
      task.status = updateTaskDto.status;
      await this.taskRepository.save(task);

      return true;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteTask(taskId: string): Promise<boolean> {
    try {
      const task = await this.findById(taskId);
      await this.taskRepository.remove(task);

      return true;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findById(taskId: string): Promise<TasksEntity> {
    try {
      const task = await this.taskRepository.findOneById(taskId);

      if (!task) {
        throw new NotFoundException('Task not found.');
      }
      return task;
    } catch (error) {
      throw error;
    }
  }
}
