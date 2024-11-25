import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatusEnum } from 'src/schemas/task.schema';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status?: TaskStatusEnum;
}
