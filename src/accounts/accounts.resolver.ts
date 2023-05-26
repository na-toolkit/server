import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';
import { CreateAccountInput } from './dto/create-account.input';
import { UpdateAccountInput } from './dto/update-account.input';
import { UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@/auth/auth.guard';
import { JwtAccount } from '@/account.decorator';
import { LoginInput } from './dto/login.input';
import { JwtSignOutput } from '@/auth/dto/jwt-sign.output';
import { DtoJoiValidationPipe } from '@/joi-validation.pipe';

@UsePipes(new DtoJoiValidationPipe())
@Resolver(() => Account)
export class AccountsResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @Mutation(() => JwtSignOutput)
  login(@Args('input') loginInput: LoginInput): Promise<JwtSignOutput> {
    return this.accountsService.login(loginInput);
  }

  @Mutation(() => Boolean, { description: '註冊帳號' })
  register(@Args('input') createInput: CreateAccountInput) {
    return this.accountsService.create(createInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean, { description: '更新帳號信息' })
  updateAccount(
    @Args('test') test: string,
    @Args('input') updateInput: UpdateAccountInput,
    @JwtAccount() account: Account,
  ): Promise<boolean> {
    return this.accountsService.update(updateInput, account);
  }

  @UseGuards(AuthGuard)
  @Query(() => Account, { description: '獲取當前登入帳號信息' })
  whoami(@JwtAccount() account: Account): Account {
    return account;
  }
}
