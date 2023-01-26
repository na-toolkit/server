import { CreateAccountInput } from './create-account.input';
import { Field, InputType, PartialType, PickType } from '@nestjs/graphql';

@InputType()
export class UpdateAccountInput extends PartialType(
  PickType(CreateAccountInput, ['name']),
) {
  @Field({ description: '用戶頭像' })
  profile: string;
}
