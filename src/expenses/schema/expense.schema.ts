import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schema/user.schema';

@Schema({ timestamps: true })
export class Expense {
  @Prop({ type: Number })
  amount: number;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  category: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Schema.Types.ObjectId;
}

export const ExpensesSchema = SchemaFactory.createForClass(Expense);
