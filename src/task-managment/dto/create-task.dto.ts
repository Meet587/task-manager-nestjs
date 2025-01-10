import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatusEnum } from 'src/db/entities/task.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'title',
    required: true,
    description: 'task title',
    type: String,
  })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'description',
    required: false,
    description: 'task description',
    type: String,
  })
  description?: string;

  @IsEnum(TaskStatusEnum)
  @IsOptional()
  @ApiProperty({
    name: 'status',
    required: false,
    description: 'task status',
    enum: TaskStatusEnum,
  })
  status?: TaskStatusEnum;
}
