import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateSentenceInput } from './create-sentence.input';

@InputType()
export class UpdateSentenceInput extends PartialType(CreateSentenceInput) {
  @Field(() => ID)
  sentenceUid: string;
}
