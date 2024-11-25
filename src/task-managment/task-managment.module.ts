import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from 'src/schemas/task.schema';
import { TaskManagmentController } from './task-managment.controller';
import { TaskManagmentService } from './task-managment.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  controllers: [TaskManagmentController],
  providers: [TaskManagmentService],
})
export class TaskManagmentModule {}
