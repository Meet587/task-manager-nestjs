import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { Task } from 'src/schemas/task.schema';
import { TaskManagmentService } from './task-managment.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { UpdateTaskStatus } from './dto/update-task-status-req.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskManagmentController {
  constructor(private readonly taskService: TaskManagmentService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskService.createTask(createTaskDto);
  }

  @Get('list')
  async getTasksForUser(): Promise<Task[]> {
    return await this.taskService.getTasksForUser();
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task | null> {
    return await this.taskService.getTaskById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task | null> {
    return await this.taskService.updateTask(id, updateTaskDto);
  }

  @Patch('/update-status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateTaskStatus: UpdateTaskStatus,
  ): Promise<Task | null> {
    return await this.taskService.updateTaskStatsu(id, updateTaskStatus);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return await this.taskService.deleteTask(id);
  }
}
