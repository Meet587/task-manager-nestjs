import { Module } from '@nestjs/common';
import { TaskManagmentController } from './task-managment.controller';
import { TaskManagmentService } from './task-managment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksEntity } from 'src/db/entities/task.entity';
import { TaskRepository } from 'src/db/repositories/task.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TasksEntity])],
  controllers: [TaskManagmentController],
  providers: [
    TaskManagmentService,
    { provide: 'taskRepositoryInterface', useClass: TaskRepository },
  ],
})
export class TaskManagmentModule {}
