import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './schema/expense.schema';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    private readonly usersService: UsersService) {}

  async create(createExpenseDto: CreateExpenseDto,userId: mongoose.Schema.Types.ObjectId) {
    const user = await this.usersService.findOne(userId);
    if (!Object.keys(user).length) throw new BadRequestException('User not found');

    const newExpense = await this.expenseModel.create({ ...createExpenseDto, user: user._id })
    
    await this.usersService.addExpense(user._id, newExpense._id)
    return newExpense;
  }

  findAll() {
    return this.expenseModel.find();
  }

  async findOne(id: mongoose.Schema.Types.ObjectId) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo ID');
    const expense = await this.expenseModel.findById(id).populate({path: 'user', select: '-createdAt -updatedAt -__v'});
    if(!expense) throw new NotFoundException("Expense not found")
    return expense
  }

  async update(id: mongoose.Schema.Types.ObjectId,updateExpenseDto: UpdateExpenseDto) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo ID');
    const updatedExpense = await this.expenseModel.findByIdAndUpdate(id, updateExpenseDto, {new:true});
    if(!updatedExpense) throw new NotFoundException("Expense not found")
    return updatedExpense
  }
  async remove(id: mongoose.Schema.Types.ObjectId) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo ID');
    const deletedExpense = await this.expenseModel.findByIdAndDelete(id);
    if(!deletedExpense) throw new NotFoundException("Expense not found")
    return deletedExpense
  }
}
