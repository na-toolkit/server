import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsResolver } from './accounts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTable } from './entities/account.entity';
import { InviteCodeModule } from '@/invite-code/invite-code.module';
import { BullModule } from '@nestjs/bull';
import { ACCOUNT_SCHEDULE_NAME } from './const';
import { AccountsScheduleConsumer } from './accounts-schedule.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountTable]),
    BullModule.registerQueue({ name: ACCOUNT_SCHEDULE_NAME }),
    InviteCodeModule,
  ],
  providers: [AccountsResolver, AccountsService, AccountsScheduleConsumer],
})
export class AccountsModule {}
