import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { verify } from './../../node_modules/@types/jsonwebtoken/index.d';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.getToken(request.headers);

    if (!token) throw new UnauthorizedException('Unauthorized access');
    try {
      const payLoad = await this.jwtService.verify(token);
        request.userId = payLoad.userId
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }

  getToken(headers) {
    if (!headers['authorization']) {
      return null;
    }
    const [type, token] = headers['authorization'].split(' ');

    return type === 'Bearer' ? token : null;
  }
}
