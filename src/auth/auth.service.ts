import {
  Account,
  AccountStatus,
  AccountTable,
  AccountWithPassword,
} from '@/accounts/entities/account.entity';
import { ErrorMessageCode } from '@/shared/types/errorMessageCode';
import { validEncrypt } from '@/utils/bcrypt';
import { handleGeneralException } from '@/utils/generalException';
import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtSignOutput } from './dto/jwt-sign.output';
import ms from 'ms';
import { CustomConfigService } from '@/shared/modules/custom-config/custom-config.service';

export type jwtPayload = {
  accountUid: string;
  iat: number;
  exp: number;
};

export type jwtPayloadContent = Omit<jwtPayload, 'iat' | 'exp'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(AccountTable)
    private readonly accountRepo: Repository<AccountTable>,
    private readonly configService: CustomConfigService,
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

  async getValidAccount(
    input: string,
    type: 'accountUid' | 'account',
    opts: {
      password: true;
    },
  ): Promise<AccountWithPassword | null>;
  async getValidAccount(
    input: string,
    type: 'accountUid' | 'account',
    opts?: {
      password?: false;
    },
  ): Promise<Account | null>;
  async getValidAccount(
    input: string,
    type: 'accountUid' | 'account',
    opts?: {
      password?: boolean;
    },
  ): Promise<Account | AccountWithPassword | null> {
    const { password = false } = opts || {};
    const builder = this.accountRepo.createQueryBuilder('account');
    if (password) {
      builder.addSelect('account.password');
    }
    builder.where('account.status = :status', { status: AccountStatus.Normal });
    switch (type) {
      case 'account':
        builder.andWhere('account.account = :account', { account: input });
        break;
      case 'accountUid':
        builder.andWhere('account.accountUid = :accountUid', {
          accountUid: input,
        });
    }
    const account = await builder.getOne();
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
      throw handleGeneralException('BAD_REQUEST', {
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
      throw handleGeneralException('UNAUTHORIZED', {
        log: '無法找到相關的權限驗證信息',
      });
    }

    const [type, token] = auth.split(' ');
    if (type !== 'Bearer') {
      throw handleGeneralException('UNAUTHORIZED', {
        log: '帳號的權限驗證信息不合法',
      });
    }
    const payload = await this.validateToken(token);
    if (!payload) {
      throw handleGeneralException('UNAUTHORIZED', {
        log: '帳號的權限驗證信息不合法',
      });
    }
    const { accountUid } = payload;
    if (!accountUid) {
      throw handleGeneralException('UNAUTHORIZED', {
        log: '帳號的權限驗證信息不合法: accountUid is empty',
      });
    }
    return [accountUid, payload];
  }

  async authToken(auth: string | undefined): Promise<Account> {
    const [accountUid] = await this.checkToken(auth);
    try {
      const account = await this.getValidAccount(accountUid, 'accountUid');
      if (account === null) {
        throw handleGeneralException('UNAUTHORIZED', {
          log: '帳號不存在或被凍結',
        });
      }
      return account;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw handleGeneralException('UNAUTHORIZED', {
        log: `帳號不存在或被凍結: ${err?.message}`,
      });
    }
  }

  jwtSign(signContent: jwtPayloadContent): JwtSignOutput {
    const accessToken = this.jwtService.sign(signContent);
    const expiresIn = this.configService.get('jwt.expiresIn');
    const expiresTimestamp = +new Date() + ms(expiresIn);
    return { accessToken, expiresIn: new Date(expiresTimestamp) };
  }
}
