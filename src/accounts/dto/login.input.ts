import { Field, InputType } from '@nestjs/graphql';
import { Root } from 'joi';

@InputType()
export class LoginInput {
  static schema(joi: Root) {
    return joi.object<LoginInput, true>({
      account: joi.string(),
      passwordInput: joi.string(),
    });
  }

  @Field({ description: '帳號名稱' })
  account: string;

  @Field({ description: '帳號密碼' })
  passwordInput: string;
}
