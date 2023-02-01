import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

@ObjectType()
export class Sentence extends OmitType(SentenceTable, ['deletedAt']) {}
