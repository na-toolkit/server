import { ObjectType, Field, OmitType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AccountStatus {
  None = 0,
  Verify = 1,
  Normal = 2,
  Frozen = 99,
}

registerEnumType(AccountStatus, {
  name: 'AccountStatus',
  valuesMap: {
    Verify: { description: '待驗證' },
    Normal: { description: '正常' },
    Frozen: { description: '凍結 ' },
  },
});

@ObjectType()
@Entity('accounts')
export class AccountTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ description: 'UID' })
  @Column({ length: 21, name: 'account_uid' })
  accountUid: string;

  @Field({ description: '用戶頭像' })
  @Column()
  profile: string;

  @Field({ description: '用戶帳號' })
  @Column({ unique: true })
  account: string;

  @Field({ description: '用戶暱稱' })
  @Column()
  name: string;

  @Column({ length: 60, select: false })
  password?: string;

  @Field(() => AccountStatus)
  @Column()
  status: AccountStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

@ObjectType()
export class Account extends OmitType(AccountTable, [
  'password',
  'deletedAt',
]) {}

@ObjectType()
export class AccountWithPassword extends Account {
  @Field({ description: '密碼' })
  password?: string;
}
