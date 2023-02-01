import { Module } from '@nestjs/common';
import { SentencesService } from './sentences.service';
import { SentencesResolver } from './sentences.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentenceTable } from './entities/sentence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SentenceTable])],
  providers: [SentencesResolver, SentencesService],
})
export class SentencesModule {}
