import { Resolver } from '@nestjs/graphql';
import { InviteCodeService } from './invite-code.service';

@Resolver()
export class InviteCodeResolver {
  constructor(private readonly inviteCodeService: InviteCodeService) {}
}
