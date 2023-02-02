import {
  InputType,
  PartialType,
  PickType,
  IntersectionType,
} from '@nestjs/graphql';
import { Sentence } from '../entities/sentence.entity';

@InputType()
export class CreateSentenceInput extends IntersectionType(
  PartialType(PickType(Sentence, ['translation', 'note'], InputType)),
  PickType(Sentence, ['content'], InputType),
) {}
