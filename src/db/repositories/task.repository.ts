import { TasksEntity } from 'src/db/entities/task.entity';
import { BaseAbstractRepository } from 'src/db/repositories/base/base.abstrac.repository';
import { TaskRepositoryInterface } from './../interfaces/task.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class TaskRepository
  extends BaseAbstractRepository<TasksEntity>
  implements TaskRepositoryInterface
{
  constructor(
    @InjectRepository(TasksEntity)
    private readonly tasksEntitiy: Repository<TasksEntity>,
  ) {
    super(tasksEntitiy);
  }
}
