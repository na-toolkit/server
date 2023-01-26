import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';
import { CreateAccountInput } from './dto/create-account.input';
import { UpdateAccountInput } from './dto/update-account.input';

@Resolver(() => Account)
export class AccountsResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @Query(() => Account)
  getAccount(@Args('accountUid') accountUid: string) {
    return this.accountsService.findByUid(accountUid);
  }

  @Mutation(() => Boolean, { description: '註冊帳號' })
  register(@Args('input') createInput: CreateAccountInput) {
    return this.accountsService.create(createInput);
  }

  @Mutation(() => Account, { description: '更新帳號信息' })
  updateAccount(@Args('input') updateInput: UpdateAccountInput) {
    return this.accountsService.update(updateInput);
  }
}
