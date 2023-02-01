import { Test, TestingModule } from '@nestjs/testing';
import { SentencesResolver } from './sentences.resolver';
import { SentencesService } from './sentences.service';

describe('SentencesResolver', () => {
  let resolver: SentencesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SentencesResolver, SentencesService],
    }).compile();

    resolver = module.get<SentencesResolver>(SentencesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
