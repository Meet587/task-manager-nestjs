import { IsEnum } from 'class-validator';
import { TaskStatusEnum } from 'src/schemas/task.schema';

export class UpdateTaskStatus {
  @IsEnum(TaskStatusEnum)
  status: TaskStatusEnum;
}
