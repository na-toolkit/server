import { Account } from '@/accounts/entities/account.entity';
import { escapeLikeString } from '@/utils/escapeLikeString';
import { handleGeneralException } from '@/utils/generalHttpException';
import { OmitTable } from '@/utils/omitTable';
import { formatUpdate } from '@/utils/orm-utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid/async';
import { Repository } from 'typeorm';
import { CreateSentenceInput } from './dto/create-sentence.input';
import {
  SearchSentenceInput,
  SearchSentenceWithPaginationInput,
} from './dto/search-sentence.input';
import { UpdateSentenceInput } from './dto/update-sentence.input';
import {
  Sentence,
  SentenceInList,
  SentenceTable,
  SentenceWithPagination,
} from './entities/sentence.entity';

@Injectable()
export class SentencesService {
  private maxLimit = 5000;

  constructor(
    @InjectRepository(SentenceTable)
    private readonly sentenceRepo: Repository<SentenceTable>,
  ) {}

  private formatCreateSentence<
    T extends CreateSentenceInput & { sentenceUid: string; accountId: number },
  >({
    accountId,
    sentenceUid,
    content,
    translation = '',
    note = '',
  }: T): OmitTable<SentenceTable, 'account'> {
    return {
      accountId,
      sentenceUid,
      content,
      translation,
      note,
    };
  }

  async findByUid(sentenceUid: string, account?: Account): Promise<Sentence> {
    try {
      const builder = this.sentenceRepo
        .createQueryBuilder('sentence')
        .where('sentence.sentenceUid = :sentenceUid', { sentenceUid });
      if (account) {
        builder.andWhere('sentence.accountId = :accountId', {
          accountId: account.id,
        });
      }

      const sentence = await builder.getOneOrFail();
      return sentence;
    } catch (err) {
      throw handleGeneralException('NOT_FOUND', {
        log: '找不到該句子',
      });
    }
  }

  async findMany(
    searchInput: SearchSentenceWithPaginationInput,
    account: Account,
  ): Promise<SentenceWithPagination>;
  async findMany(
    searchInput: SearchSentenceInput,
    account: Account,
  ): Promise<SentenceInList[]>;
  async findMany(
    searchInput: SearchSentenceWithPaginationInput | SearchSentenceInput,
    account: Account,
  ): Promise<SentenceWithPagination | SentenceInList[]> {
    const { keyword } = searchInput;

    const builder = this.sentenceRepo
      .createQueryBuilder('sentence')
      .where('sentence.accountId = :accountId', { accountId: account.id });

    if (keyword) {
      builder.andWhere('sentence.content LIKE :keyword', {
        keyword: `%${escapeLikeString(keyword)}%`,
      });
    }

    builder.orderBy('sentence.createdAt', 'DESC');

    if ('paginationInfo' in searchInput) {
      const {
        paginationInfo: { currentPage, pageSize },
      } = searchInput;
      const [data, total] = await builder
        .skip((currentPage - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();
      return {
        data,
        paginationInfo: { currentPage, pageSize, total },
      };
    }
    const data = await builder.take(this.maxLimit).getMany();
    return data;
  }

  async create(
    createInput: CreateSentenceInput,
    account: Account,
  ): Promise<OmitTable<Sentence>> {
    // await validateInput({
    //   schema: (joi) =>
    //     joi.object<CreateSentenceInput, true>({
    //       content: joi.string().required(),
    //       translation: joi.string().allow('').optional(),
    //       note: joi.string().allow('').optional(),
    //     }),
    //   input: createInput,
    // });

    const { content, translation, note } = createInput;
    const sentenceUid = await nanoid();
    const createItem = this.formatCreateSentence({
      sentenceUid,
      accountId: account.id,
      content: content.trim(),
      translation: translation?.trim(),
      note,
    });
    await this.sentenceRepo
      .createQueryBuilder('sentence')
      .insert()
      .values(createItem)
      .execute();
    return createItem;
  }

  async update(
    updateInput: UpdateSentenceInput,
    account: Account,
  ): Promise<boolean> {
    // await validateInput({
    //   schema: (joi) =>
    //     joi.object<UpdateSentenceInput, true>({
    //       sentenceUid: joi.string().length(21).required(),
    //       content: joi.string().optional(),
    //       translation: joi.string().allow('').optional(),
    //       note: joi.string().allow('').optional(),
    //     }),
    //   input: updateInput,
    // });

    const { sentenceUid, content, translation, note } = updateInput;
    const sentence = await this.findByUid(sentenceUid, account);
    await this.sentenceRepo
      .createQueryBuilder('sentence')
      .update()
      .set(
        formatUpdate(
          {
            content: content?.trim(),
            translation: translation?.trim(),
            note,
          },
          { omitNullable: true },
        ),
      )
      .where('id = :id', { id: sentence.id })
      .execute();
    return true;
  }

  async remove(sentenceUid: string, account: Account): Promise<boolean> {
    const sentence = await this.findByUid(sentenceUid, account);
    await this.sentenceRepo
      .createQueryBuilder('sentence')
      .softDelete()
      .where('id = :id', { id: sentence.id })
      .execute();
    return true;
  }
}
