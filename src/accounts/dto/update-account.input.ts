import { CreateAccountInput } from './create-account.input';
import { InputType, PartialType, PickType } from '@nestjs/graphql';

@InputType()
export class UpdateAccountInput extends PartialType(
  PickType(CreateAccountInput, ['name']),
) {}
