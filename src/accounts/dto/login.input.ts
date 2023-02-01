import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field({ description: '帳號名稱' })
  account: string;

  @Field({ description: '帳號密碼' })
  passwordInput: string;
}
