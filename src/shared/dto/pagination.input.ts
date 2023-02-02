import { InputType, PickType } from '@nestjs/graphql';
import { Pagination } from './pagination.output';

@InputType('PaginationInput')
export class PaginationInput extends PickType(
  Pagination,
  ['currentPage', 'pageSize'],
  InputType,
) {}
