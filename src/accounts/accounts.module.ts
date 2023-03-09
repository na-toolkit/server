import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsResolver } from './accounts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTable } from './entities/account.entity';
import { InviteCodeModule } from '@/invite-code/invite-code.module';

@Module({
  imports: [TypeOrmModule.forFeature([AccountTable]), InviteCodeModule],
  providers: [AccountsResolver, AccountsService],
})
export class AccountsModule {}
