import {
  Account,
  AccountStatus,
  AccountTable,
  AccountWithPassword,
} from '@/accounts/entities/account.entity';
import { ErrorMessageCode } from '@/shared/types/errorMessageCode';
import { validEncrypt } from '@/utils/bcrypt';
import {
  handleBadRequestException,
  handleUnauthorizedException,
} from '@/utils/formatException';
import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export type jwtPayload = {
  accountUid: string;
  iat: number;
  exp: number;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(AccountTable)
    private readonly accountRepo: Repository<AccountTable>,
  ) {}

  async validateToken(token: string): Promise<jwtPayload | undefined> {
    try {
      const payload = await this.jwtService.verifyAsync<Promise<jwtPayload>>(
        token,
      );
      return payload;
    } catch (err) {
      return undefined;
    }
  }

  async getValidAccount(accountUid: string): Promise<Account | null> {
    const account = await this.accountRepo
      .createQueryBuilder('account')
      .where('account.accountUid = :accountUid', { accountUid })
      .andWhere('account.status = :status', { status: AccountStatus.Normal })
      .getOne();
    return account;
  }

  async checkPassword(
    password: string,
    account: AccountWithPassword,
  ): Promise<true> {
    let result = false;
    if (account.password) {
      result = await validEncrypt(password, account.password);
    }
    if (!result) {
      throw handleBadRequestException({
        messageCode: ErrorMessageCode.BAD_REQUEST,
        log: '帳號或密碼不正確',
      });
    }
    return result;
  }

  private async checkToken(
    auth: string | undefined,
  ): Promise<[string, jwtPayload]> {
    if (!auth) {
      throw handleUnauthorizedException({
        log: '無法找到相關的權限驗證信息',
      });
    }

    const [type, token] = auth.split(' ');
    if (type !== 'Bearer') {
      throw handleUnauthorizedException({
        log: '帳號的權限驗證信息不合法',
      });
    }
    const payload = await this.validateToken(token);
    if (!payload) {
      throw handleUnauthorizedException({
        log: '帳號的權限驗證信息不合法',
      });
    }
    const { accountUid } = payload;
    if (!accountUid) {
      throw handleUnauthorizedException({
        log: '帳號的權限驗證信息不合法: accountUid is empty',
      });
    }
    return [accountUid, payload];
  }

  async authToken(auth: string | undefined): Promise<Account> {
    const [accountUid] = await this.checkToken(auth);
    try {
      const account = await this.getValidAccount(accountUid);
      if (account === null) {
        throw handleUnauthorizedException({
          log: '帳號不存在或被凍結',
        });
      }
      return account;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw handleUnauthorizedException({
        log: `帳號不存在或被凍結: ${err?.message}`,
      });
    }
  }
}
