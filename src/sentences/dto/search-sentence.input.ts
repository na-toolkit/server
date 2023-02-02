import { PaginationInput } from '@/shared/dto/pagination.input';
import { Field, InputType } from '@nestjs/graphql';

export class SearchSentenceInput {}

@InputType()
export class SearchSentenceWithPaginationInput extends SearchSentenceInput {
  @Field(() => PaginationInput, { description: '分頁資訊' })
  paginationInfo: PaginationInput;
}
