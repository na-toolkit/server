import { Resolver } from '@nestjs/graphql';
import { SentencesService } from './sentences.service';

@Resolver()
export class SentencesResolver {
  constructor(private readonly sentencesService: SentencesService) {}
}
