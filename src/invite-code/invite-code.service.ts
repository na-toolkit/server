import { handleNotFoundException } from '@/utils/formatException';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InviteCode, InviteCodeTable } from './entities/invite-code.entity';

@Injectable()
export class InviteCodeService {
  constructor(
    @InjectRepository(InviteCodeTable)
    private codeRepo: Repository<InviteCodeTable>,
  ) {}

  async findByCode(code: string): Promise<InviteCode> {
    try {
      const inviteCode = await this.codeRepo
        .createQueryBuilder('code')
        .where('code.code = :code', { code })
        .getOneOrFail();
      return inviteCode;
    } catch (err) {
      throw handleNotFoundException({
        log: '找不到該邀請碼',
      });
    }
  }
}
