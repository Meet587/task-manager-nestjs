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
import { TaskManagmentService } from './task-managment.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { UpdateTaskStatus } from './dto/update-task-status-req.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@Controller('tasks')
@ApiTags('Task Managment')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TaskManagmentController {
  constructor(private readonly taskService: TaskManagmentService) {}

  @Post()
  @ApiBody({
    description: 'add new task',
    type: CreateTaskDto,
  })
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.taskService.createTask(createTaskDto);
  }

  @Get('list')
  @ApiOperation({
    summary: 'get all task for user',
    operationId: 'getAllTaskForUse',
  })
  async getTasksForUser(): Promise<any> {
    return await this.taskService.getTasksForUser();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'get task details by id',
    operationId: 'getTaskById',
  })
  async getTaskById(@Param('id') id: string) {
    return await this.taskService.getTaskById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'update task details by id',
    operationId: 'updateTaskById',
  })
  @ApiBody({
    type: UpdateTaskDto,
  })
  @ApiQuery({
    name: 'id',
    description: 'task id',
    type: Number,
  })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return await this.taskService.updateTask(id, updateTaskDto);
  }

  @Patch('/update-status/:id')
  @ApiOperation({
    summary: 'update task status by id',
    operationId: 'updateTaskStatusById',
  })
  @ApiBody({
    type: UpdateTaskStatus,
  })
  @ApiQuery({
    name: 'id',
    description: 'task id',
    type: Number,
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateTaskStatus: UpdateTaskStatus,
  ) {
    return await this.taskService.updateTaskStatsu(id, updateTaskStatus);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'delete task by id',
    operationId: 'deleteTaskById',
  })
  @ApiQuery({
    name: 'id',
    description: 'task id',
    type: Number,
  })
  async remove(@Param('id') id: string): Promise<boolean> {
    return await this.taskService.deleteTask(id);
  }
}
