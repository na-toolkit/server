import { OmitTable } from '@/utils/omitTable';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dto/create-account.input';
import { UpdateAccountInput } from './dto/update-account.input';
import { Account, AccountTable } from './entities/account.entity';
import { nanoid } from 'nanoid/async';
import { encrypt } from '@/utils/bcrypt';
import { formatUpdate } from '@/utils/orm-utils';
import { validateInput } from '@/utils/validate-input';
import { handleNotFoundException } from '@/utils/formatException';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountTable)
    private accountRepo: Repository<AccountTable>,
  ) {}

  private formatCreateAccountInput<
    T extends Omit<CreateAccountInput, 'passwordInput'> & {
      accountUid: string;
      password: string;
      profile?: string;
    },
  >({
    profile = '',
    ...rest
  }: T): OmitTable<AccountTable> & { password: string } {
    return {
      profile,
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

  async update(updateInput: UpdateAccountInput): Promise<boolean> {
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
}
