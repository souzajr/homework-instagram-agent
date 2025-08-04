import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Always return true to allow access
    return true;
  }

  handleRequest(err: any, user: any) {
    // Don't throw error if no user found - just return null
    return user || null;
  }
}