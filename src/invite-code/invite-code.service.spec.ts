import { Test, TestingModule } from '@nestjs/testing';
import { InviteCodeService } from './invite-code.service';

describe('InviteCodeService', () => {
  let service: InviteCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InviteCodeService],
    }).compile();

    service = module.get<InviteCodeService>(InviteCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
