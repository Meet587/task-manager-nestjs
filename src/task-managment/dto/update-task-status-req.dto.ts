import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TaskStatusEnum } from 'src/db/entities/task.entity';

export class UpdateTaskStatus {
  @IsEnum(TaskStatusEnum)
  @ApiProperty({
    name: 'status',
    required: true,
    description: 'task status',
    enum: TaskStatusEnum,
  })
  status: TaskStatusEnum;
}
