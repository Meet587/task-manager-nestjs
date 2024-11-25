import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document , Schema as MongooseSchema} from 'mongoose';
import { Task } from './task.schema';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Task' })
  tasks: Task[];
}

export const UserSchema = SchemaFactory.createForClass(User);
