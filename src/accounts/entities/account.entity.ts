import { ObjectType, Field, OmitType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
