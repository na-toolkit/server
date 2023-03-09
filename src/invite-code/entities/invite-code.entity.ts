import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum InviteCodeStatus {
  None = 0,
  Valid = 1,
  Invalid = 2,
}

@ObjectType()
@Entity('invite_codes')
export class InviteCodeTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ description: '邀請碼' })
  @Column({ length: 30, unique: true })
  code: string;

  @Column()
  status: InviteCodeStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

@ObjectType()
export class InviteCode extends OmitType(InviteCodeTable, ['deletedAt']) {}
