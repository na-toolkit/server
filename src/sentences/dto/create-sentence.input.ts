import { Field, InputType, PartialType, PickType } from '@nestjs/graphql';
import { Sentence } from '../entities/sentence.entity';

@InputType()
export class CreateSentenceInput extends PartialType(
  PickType(Sentence, ['translation', 'note']),
) {
  @Field({ description: '內容' })
  content: string;
}
