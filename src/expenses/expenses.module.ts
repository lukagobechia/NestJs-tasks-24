import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpensesSchema } from './schema/expense.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{name: Expense.name, schema:ExpensesSchema}]),UsersModule],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}