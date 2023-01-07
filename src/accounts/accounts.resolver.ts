import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';
import { CreateAccountInput } from './dto/create-account.input';
import { UpdateAccountInput } from './dto/update-account.input';

@Resolver(() => Account)
export class AccountsResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @Query(() => [Account], { name: 'accounts' })
  findAll() {
    return this.accountsService.findAll();
  }

  @Query(() => Account, { name: 'account' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.accountsService.findOne(id);
  }

  @Mutation(() => Account)
  removeAccount(@Args('id', { type: () => Int }) id: number) {
    return this.accountsService.remove(id);
  }
}
