import { CreateAccountInput } from './create-account.input';
import { Field, InputType, PartialType, PickType } from '@nestjs/graphql';
import { Root } from 'joi';

@InputType()
export class UpdateAccountInput extends PartialType(
  PickType(CreateAccountInput, ['name']),
) {
  static joiSchema(joi: Root) {
    return joi.object<UpdateAccountInput, true>({
      name: joi.string(),
      profile: joi.string(),
    });
  }

  @Field({ description: '用戶頭像' })
  profile: string;
}
