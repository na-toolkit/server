import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('JwtSign')
export class JwtSignOutput {
  @Field({ description: 'token' })
  accessToken: string;

  @Field({ description: '有效時間' })
  expiresIn: Date;
}
