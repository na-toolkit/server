import {
  InputType,
  PartialType,
  PickType,
  IntersectionType,
} from '@nestjs/graphql';
import { Sentence } from '../entities/sentence.entity';
import { Root } from 'joi';

@InputType()
export class CreateSentenceInput extends IntersectionType(
  PartialType(PickType(Sentence, ['translation', 'note'], InputType)),
  PickType(Sentence, ['content'], InputType),
) {
  static joiSchema(joi: Root) {
    return joi.object<CreateSentenceInput, true>({
      content: joi.string().required(),
      translation: joi.string().allow('').optional(),
      note: joi.string().allow('').optional(),
    });
  }
}
