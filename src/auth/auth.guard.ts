import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { getRequestFromContext } from '@/utils/getRequestFromContext';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = getRequestFromContext(context);
    if (!request) return false;
    // 驗證 token
    const auth = request.headers.authorization as string;
    const account = await this.authService.authToken(auth);
    request.account = account;
    return true;
  }
}
