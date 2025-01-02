import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import mongoose from 'mongoose';
import { HasUser } from 'src/guards/hasUser.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseGuards(HasUser)
  create(@Body() createExpenseDto: CreateExpenseDto, @Req() request) {
    const userId = request.userId
    console.log(userId)
    return this.expensesService.create(createExpenseDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.expensesService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: mongoose.Schema.Types.ObjectId, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.expensesService.remove(id);
  }
}
