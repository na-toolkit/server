import { handleGeneralException } from '@/utils/generalException';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InviteCode,
  InviteCodeStatus,
  InviteCodeTable,
} from './entities/invite-code.entity';

@Injectable()
export class InviteCodeService {
  constructor(
    @InjectRepository(InviteCodeTable)
    private codeRepo: Repository<InviteCodeTable>,
  ) {}

  async findByCode(
    code: string,
    opts?: {
      valid?: boolean;
    },
  ): Promise<InviteCode> {
    const { valid } = opts || {};
    try {
      const builder = await this.codeRepo
        .createQueryBuilder('code')
        .where('code.code = :code', { code });
      if (valid === true) {
        builder.andWhere('code.status = :status', {
          status: InviteCodeStatus.Valid,
        });
      }
      const inviteCode = builder.getOneOrFail();
      return inviteCode;
    } catch (err) {
      throw handleGeneralException('NOT_FOUND', {
        log: '找不到該邀請碼',
      });
    }
  }
}
