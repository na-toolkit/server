import { Test, TestingModule } from '@nestjs/testing';
import { InviteCodeResolver } from './invite-code.resolver';
import { InviteCodeService } from './invite-code.service';

describe('InviteCodeResolver', () => {
  let resolver: InviteCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InviteCodeResolver, InviteCodeService],
    }).compile();

    resolver = module.get<InviteCodeResolver>(InviteCodeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
