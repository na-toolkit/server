import { Module } from '@nestjs/common';
import { InviteCodeService } from './invite-code.service';
import { InviteCodeResolver } from './invite-code.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteCodeTable } from './entities/invite-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InviteCodeTable])],
  providers: [InviteCodeResolver, InviteCodeService],
  exports: [InviteCodeService],
})
export class InviteCodeModule {}
