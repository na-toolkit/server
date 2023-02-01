/* https://docs.nestjs.com/graphql/scalars */

import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { formatTime } from './utils/dayjs';

@Scalar('UnixDate', () => Date)
export class DateScalar implements CustomScalar<number, Date> {
  description = 'Unix Timestamp';

  // client -> server: variables
  parseValue(value: unknown): Date {
    if (typeof value !== 'number' && typeof value !== 'string') {
      throw new Error('invalid unix timestamp');
    }
    const validValue = +value;
    if (Number.isNaN(validValue)) throw new Error('invalid unix timestamp');
    return new Date(validValue);
  }

  // client -> server: query
  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value));
    }
    throw new Error('invalid unix timestamp');
  }

  // server -> client
  serialize(value: Date): number {
    return +formatTime(value, 'x');
  }
}
