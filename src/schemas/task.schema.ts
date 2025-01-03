import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export enum TaskStatusEnum {
  TO_DO = 'To do',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({
    required: true,
    enum: TaskStatusEnum,
    default: TaskStatusEnum.TO_DO,
  })
  status: TaskStatusEnum;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
