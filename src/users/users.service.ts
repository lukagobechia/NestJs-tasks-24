import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { faker }from '@faker-js/faker';
import { QueryParamsDto } from './dto/queryParams.dto';
import { FilterUsersDto } from './dto/filterUser.dto';
@Injectable()
export class UsersService {


  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userModel.findOne({email: createUserDto.email});
    if (existUser) throw new BadRequestException('user already exsists');
    return this.userModel.create(createUserDto);
  }

  findAll(query:QueryParamsDto) {
    const {page=1, take=50} = query;
    const limit = Math.min(take,50)
    return this.userModel.find().skip((page-1)*limit).limit(page*limit);
  }
  async filter(filter:FilterUsersDto){
    const {age, ageFrom, ageTo, page=1, take=50} = filter;
console.log(page,take, age)
    const query: Record <string, any> = {};

    if(age){
      query.age = age
    } else {
      if(ageFrom) query.age = {$gte: ageFrom}
      if(ageTo) query.age = {...query.age, $lte: ageTo}
    }
    const limit = Math.min(take,50)
    const users = await this.userModel.find(query).skip((page - 1) * limit).limit(page*limit)

    return users;
  }
  userCount(){
    return this.userModel.countDocuments()
  }

  async findOne(id: mongoose.Schema.Types.ObjectId) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo ID');
    const user = await this.userModel.findById(id).populate({path: 'expenses', select: '-createdAt -updatedAt -__v -user'});
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: mongoose.Schema.Types.ObjectId,updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo ID');
    const updatedUser = await this.userModel.findByIdAndUpdate(id,updateUserDto,{ new: true });
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async remove(id: mongoose.Schema.Types.ObjectId) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid mongo ID');
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) throw new NotFoundException('User not found');
    return deletedUser;
  }

  async findOneByEmail(email:string) {
    const existUser = await this.userModel.findOne({email: email}).select('+password')
    return existUser;
  }
  async addExpense(userId, expenseId) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User Not Found');

    const expenses = user.expenses;
    expenses.push(expenseId);

    const updatedUser = await this.userModel.findByIdAndUpdate(userId,{ ...user, expenses },{ new: true });
    return updatedUser;
  }
}
