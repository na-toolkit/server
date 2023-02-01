import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsResolver } from './accounts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTable } from './entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountTable])],
  providers: [AccountsResolver, AccountsService],
})
export class AccountsModule {}
