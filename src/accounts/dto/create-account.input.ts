import { InviteCode } from '@/invite-code/entities/invite-code.entity';
import { InputType, Field, PickType, IntersectionType } from '@nestjs/graphql';
import { Account } from '../entities/account.entity';

@InputType()
export class CreateAccountInput extends IntersectionType(
  PickType(Account, ['account', 'name'], InputType),
  PickType(InviteCode, ['code'], InputType),
) {
  @Field({ description: '用戶密碼' })
  passwordInput: string;
}
