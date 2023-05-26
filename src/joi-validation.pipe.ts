import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Type,
} from '@nestjs/common';
import * as Joi from 'joi';
import { handleGeneralException } from './utils/generalHttpException';
import { Logger } from '@nestjs/common';

// type DtoWithSchema = Type & { schema?: (joi: Root) => ObjectSchema };

@Injectable()
export class DtoJoiValidationPipe implements PipeTransform {
  private readonly logger = new Logger(DtoJoiValidationPipe.name);
  // private dtoRegister: Record<string, DtoWithSchema> = {};

  // constructor(dtoArrayWithSchema: DtoWithSchema[]);
  // constructor(dtoWithSchema: DtoWithSchema);
  // constructor(dtosWithSchema: DtoWithSchema | DtoWithSchema[]) {
  //   if (Array.isArray(dtosWithSchema)) {
  //     dtosWithSchema.forEach((v) => {
  //       this.dtoRegister[v.name] = v;
  //     });
  //   } else this.dtoRegister[dtosWithSchema.name] = dtosWithSchema;
  // }

  transform(value: unknown, metadata: ArgumentMetadata) {
    const { type } = metadata;
    const metatype:
      | (Type<any> & {
          joiSchema?: (joi: Joi.Root) => Joi.ObjectSchema;
        })
      | undefined = metadata?.metatype as unknown as any;
    if (type === 'body' && metatype?.joiSchema) {
      const { error } = metatype.joiSchema(Joi).validate(value);
      if (error) {
        throw handleGeneralException('BAD_REQUEST', { log: error.message });
      }
    }
    return value;
  }
}
