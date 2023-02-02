import { ObjectType, Field, OmitType, Int } from '@nestjs/graphql';

@ObjectType('PaginationInfo')
export class Pagination {
  @Field(() => Int, { description: '資料總筆數' })
  total: number;

  @Field(() => Int, { description: '當前頁數' })
  currentPage: number;

  @Field(() => Int, { description: '取得資料數' })
  pageSize: number;
}

@ObjectType('PaginationInfoWithoutTotal')
export class PaginationWithoutTotal extends OmitType(Pagination, ['total']) {}
