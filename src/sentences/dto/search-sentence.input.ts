import { PaginationInput } from '@/shared/dto/pagination.input';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SearchSentenceInput {
  @Field({ description: '關鍵字', nullable: true })
  keyword?: string;
}

@InputType()
export class SearchSentenceWithPaginationInput extends SearchSentenceInput {
  @Field(() => PaginationInput, { description: '分頁資訊' })
  paginationInfo: PaginationInput;
}
