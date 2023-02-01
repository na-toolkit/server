import { OmitTable } from '@/utils/omitTable';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSentenceInput } from './dto/create-sentence.input';
import { SentenceTable } from './entities/sentence.entity';

@Injectable()
export class SentencesService {
  constructor(
    @InjectRepository(SentenceTable)
    private readonly sentenceRepo: Repository<SentenceTable>,
  ) {}

  private formatCreateSentence<
    T extends CreateSentenceInput & { sentenceUid: string },
  >({
    sentenceUid,
    content,
    translation = '',
    note = '',
  }: T): OmitTable<SentenceTable> {
    return {
      sentenceUid,
      content,
      translation,
      note,
    };
  }
}
