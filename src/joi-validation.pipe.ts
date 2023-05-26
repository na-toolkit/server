import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Type,
} from '@nestjs/common';
import { ObjectSchema, Root } from 'joi';
import * as Joi from 'joi';
import { handleGeneralException } from './utils/generalException';

type DtoWithSchema = Type & { schema?: (joi: Root) => ObjectSchema };

@Injectable()
export class GqlJoiToDtoPipe implements PipeTransform {
  private dtoRegister: Record<string, DtoWithSchema> = {};

  constructor(dtoArrayWithSchema: DtoWithSchema[]);
  constructor(dtoWithSchema: DtoWithSchema);
  constructor(dtosWithSchema: DtoWithSchema | DtoWithSchema[]) {
    if (Array.isArray(dtosWithSchema)) {
      dtosWithSchema.forEach((v) => {
        this.dtoRegister[v.name] = v;
      });
    } else this.dtoRegister[dtosWithSchema.name] = dtosWithSchema;
  }

  transform(value: unknown, metadata: ArgumentMetadata) {
    const { type, data, metatype } = metadata;
    if (
      type === 'body' &&
      data === 'input' &&
      metatype?.name &&
      this.dtoRegister[metatype.name]
    ) {
      const schemaFunc = this.dtoRegister[metatype.name]?.schema;
      if (schemaFunc) {
        const { error } = schemaFunc(Joi).validate(value);
        if (error) {
          throw handleGeneralException('BAD_REQUEST', { log: error.message });
        }
      }
    }
    return value;
  }
}