import { TasksEntity } from 'src/db/entities/task.entity';
import { BaseInterfacerepository } from 'src/db/repositories/base/base.interface.repository';

export interface TaskRepositoryInterface
  extends BaseInterfacerepository<TasksEntity> {}
