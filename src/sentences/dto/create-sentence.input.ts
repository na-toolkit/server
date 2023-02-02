import {
  InputType,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Sentence } from '../entities/sentence.entity';

@InputType()
export class CreateSentenceInput extends IntersectionType(
  PickType(Sentence, ['content']),
  PartialType(PickType(Sentence, ['translation', 'note'])),
) {}
