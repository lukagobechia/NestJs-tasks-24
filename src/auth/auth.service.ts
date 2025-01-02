import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';
@Injectable()
export class AuthService {
  constructor(private readonly usersService:UsersService, private readonly jwtService:JwtService) {}

  async signUp(signUpDto: SignUpDto) {
    const existUser = await this.usersService.findOneByEmail(signUpDto.email)
    if(existUser) {
      throw new BadRequestException("User already exists")
    }
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10)
    const newUser = await this.usersService.create({...signUpDto, password: hashedPassword})
    return 'User registered successfully'
  }

  async signIn(signInDto: SignInDto) {
    const existUser = await this.usersService.findOneByEmail(signInDto.email);
    if(!existUser)  throw new BadRequestException('Email or password is incorrectd')
    
    const isPassEqual = await bcrypt.compare(signInDto.password,existUser.password)
    if(!isPassEqual)  throw new UnauthorizedException('Email or password is incorrectd')
    const payLoad = {
     userId: existUser._id
    } 
    const accessToken = await this.jwtService.sign(payLoad, {expiresIn: '1h'})
      return {accessToken}
    }

  async getCurrentUser(userId:mongoose.Schema.Types.ObjectId) {
    const user = await this.usersService.findOne(userId);

    return user
  }
}
