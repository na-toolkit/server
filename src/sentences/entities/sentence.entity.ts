import { Account, AccountTable } from '@/accounts/entities/account.entity';
import { Pagination } from '@/shared/dto/pagination.output';
import {
  Field,
  IntersectionType,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity('sentences')
export class SentenceTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ description: 'UID' })
  @Column({ length: 21, name: 'sentence_uid' })
  sentenceUid: string;

  @Field({ description: '內容' })
  @Column({ length: '1000' })
  content: string;

  @Field({ description: '對應翻譯' })
  @Column({ length: '1000' })
  translation: string;

  @Field({ description: '備註' })
  @Column({ type: 'text' })
  note: string;

  @Field(() => Account, { description: '所屬帳號' })
  @ManyToOne(() => AccountTable, (account) => account.id)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
  account: Account;

  @Column({ name: 'account_id' })
  accountId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

@ObjectType()
export class Sentence extends OmitType(SentenceTable, [
  'deletedAt',
  'account',
]) {}

@ObjectType()
export class SentenceWithAccount extends IntersectionType(
  Sentence,
  PickType(SentenceTable, ['account']),
) {}

@ObjectType()
export class SentenceInList extends Sentence {}

@ObjectType()
export class SentenceWithPagination {
  @Field(() => [SentenceInList])
  data: SentenceInList[];

  @Field(() => Pagination, { description: '分頁資訊' })
  paginationInfo: Pagination;
}
