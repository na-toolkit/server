import { InputType, Field, PickType } from '@nestjs/graphql';
import { Account } from '../entities/account.entity';

@InputType()
export class CreateAccountInput extends PickType(
  Account,
  ['account', 'name'],
  InputType,
) {
  @Field({ description: '用戶密碼' })
  passwordInput: string;
}
