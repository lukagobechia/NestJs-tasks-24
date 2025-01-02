import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';
import { QueryParamsDto } from './dto/queryParams.dto';
import { FilterUsersDto } from './dto/filterUser.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() query: FilterUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get('filter-by-age')
  @UseGuards(AuthGuard)
  filter(@Query() query){
    return this.usersService.filter(query)
  }

  @Get('user-count')
  @UseGuards(AuthGuard)
  userCount() {
    return this.usersService.userCount();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  update(
    @Req() request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = request.userId
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  remove(@Req() request) {
    const userId = request.userId
    return this.usersService.remove(userId);
  }
}
