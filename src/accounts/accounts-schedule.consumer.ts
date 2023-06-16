import { Process, Processor } from '@nestjs/bull';
import {
  ACCOUNT_SCHEDULE_NAME,
  ACCOUNT_SCHEDULE_PRINT_LOGGER_NAME,
} from './const';
import { PinoLogger } from 'nestjs-pino';
import { AccountsService } from './accounts.service';

@Processor(ACCOUNT_SCHEDULE_NAME)
export class AccountsScheduleConsumer {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountsService: AccountsService,
  ) {
    this.logger.setContext(AccountsScheduleConsumer.name);
  }

  @Process(ACCOUNT_SCHEDULE_PRINT_LOGGER_NAME)
  printLogger() {
    this.accountsService.printLogger(new Date());
  }
}
