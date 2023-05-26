import { Field, InputType } from '@nestjs/graphql';
import { Root } from 'joi';

@InputType()
export class LoginInput {
  static joiSchema(joi: Root) {
    return joi.object<LoginInput, true>({
      account: joi.string().required(),
      passwordInput: joi.string().required(),
    });
  }

  @Field({ description: '帳號名稱' })
  account: string;

  @Field({ description: '帳號密碼' })
  passwordInput: string;
}
