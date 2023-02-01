import { OmitTable } from '@/utils/omitTable';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dto/create-account.input';
import { UpdateAccountInput } from './dto/update-account.input';
import {
  Account,
  AccountStatus,
  AccountTable,
} from './entities/account.entity';
import { nanoid } from 'nanoid/async';
import { encrypt } from '@/utils/bcrypt';
import { formatUpdate } from '@/utils/orm-utils';
import { validateInput } from '@/utils/validate-input';
import { handleNotFoundException } from '@/utils/formatException';
import { AuthService } from '@/auth/auth.service';
import { LoginInput } from './dto/login.input';
import { JwtSignOutput } from '@/auth/dto/jwt-sign.output';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountTable)
    private accountRepo: Repository<AccountTable>,
    private readonly authService: AuthService,
  ) {}

  private formatCreateAccountInput<
    T extends Omit<CreateAccountInput, 'passwordInput'> & {
      accountUid: string;
      password: string;
      profile?: string;
      status?: AccountStatus;
    },
  >({
    profile = '',
    status = AccountStatus.Normal,
    ...rest
  }: T): OmitTable<AccountTable> & { password: string } {
    return {
      profile,
      status,
      ...rest,
    };
  }

  async create(createInput: CreateAccountInput): Promise<boolean> {
    await validateInput({
      schema: (joi) =>
        joi.object<CreateAccountInput, true>({
          account: joi.string(),
          name: joi.string(),
          passwordInput: joi.string(),
        }),
      input: createInput,
    });

    const { account, name, passwordInput } = createInput;
    const password = await encrypt(passwordInput);
    const accountUid = await nanoid();
    await this.accountRepo
      .createQueryBuilder('account')
      .insert()
      .values(
        this.formatCreateAccountInput({
          accountUid,
          account,
          name,
          password,
        }),
      )
      .execute();
    return true;
  }

  async update(
    updateInput: UpdateAccountInput,
    account: Account,
  ): Promise<boolean> {
    await validateInput({
      schema: (joi) =>
        joi.object<UpdateAccountInput, true>({
          name: joi.string(),
          profile: joi.string(),
        }),
      input: updateInput,
    });

    const { name, profile } = updateInput;
    await this.accountRepo
      .createQueryBuilder('account')
      .update()
      .set(
        formatUpdate({
          name,
          profile,
        }),
      )
      .where('id = :id', { id: account.id })
      .execute();
    return true;
  }

  async findByUid(accountUid: string): Promise<Account> {
    try {
      const account = this.accountRepo
        .createQueryBuilder('account')
        .where('account.accountUid = :accountUid', { accountUid })
        .getOneOrFail();
      return account;
    } catch (err) {
      throw handleNotFoundException({
        log: '找不到該帳號',
      });
    }
  }

  async login(loginInput: LoginInput): Promise<JwtSignOutput> {
    await validateInput({
      schema: (joi) =>
        joi.object<LoginInput, true>({
          account: joi.string(),
          passwordInput: joi.string(),
        }),
      input: loginInput,
    });

    const { account: accountInput, passwordInput } = loginInput;
    const account = await this.authService.getValidAccount(
      accountInput,
      'account',
      { password: true },
    );
    if (!account) {
      throw handleNotFoundException({
        log: '帳號不存在或凍結',
      });
    }
    await this.authService.checkPassword(passwordInput, account);
    const result = await this.authService.jwtSign({
      accountUid: account.accountUid,
    });
    return result;
  }
}
