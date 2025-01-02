import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class HasUser implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['user-id'];

    if (!userId) {
      throw new UnauthorizedException('User ID is missing in the headers.');
    }

    request.userId = userId;

    return true;
  }
}
