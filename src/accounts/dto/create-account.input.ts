import { InviteCode } from '@/invite-code/entities/invite-code.entity';
import { InputType, Field, PickType, IntersectionType } from '@nestjs/graphql';
import { Root } from 'joi';
import { Account } from '../entities/account.entity';

@InputType()
export class CreateAccountInput extends IntersectionType(
  PickType(Account, ['account', 'name'], InputType),
  PickType(InviteCode, ['code'], InputType),
) {
  static schema(joi: Root) {
    return joi.object<CreateAccountInput, true>({
      account: joi.string(),
      name: joi.string(),
      passwordInput: joi.string(),
      code: joi.string(),
    });
  }

  @Field({ description: '用戶密碼' })
  passwordInput: string;
}
