import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateSentenceInput } from './create-sentence.input';
import { Root } from 'joi';

@InputType()
export class UpdateSentenceInput extends PartialType(CreateSentenceInput) {
  static schema(joi: Root) {
    return joi.object<UpdateSentenceInput, true>({
      sentenceUid: joi.string().length(21).required(),
      content: joi.string().optional(),
      translation: joi.string().allow('').optional(),
      note: joi.string().allow('').optional(),
    });
  }

  @Field(() => ID)
  sentenceUid: string;
}
