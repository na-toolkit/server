import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsResolver } from './accounts.resolver';

@Module({
  providers: [AccountsResolver, AccountsService]
})
export class AccountsModule {}
