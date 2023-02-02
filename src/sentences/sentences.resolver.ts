import { JwtAccount } from '@/account.decorator';
import { Account } from '@/accounts/entities/account.entity';
import { AuthGuard } from '@/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateSentenceInput } from './dto/create-sentence.input';
import { SearchSentenceWithPaginationInput } from './dto/search-sentence.input';
import { UpdateSentenceInput } from './dto/update-sentence.input';
import { Sentence, SentenceWithPagination } from './entities/sentence.entity';
import { SentencesService } from './sentences.service';

@UseGuards(AuthGuard)
@Resolver()
export class SentencesResolver {
  constructor(private readonly sentencesService: SentencesService) {}

  @Query(() => Sentence)
  async getSentence(
    @Args('sentenceUid', { type: () => ID }) sentenceUid: string,
    @JwtAccount() account: Account,
  ): Promise<Sentence> {
    const result = await this.sentencesService.findByUid(sentenceUid, account);
    return result;
  }

  @Query(() => SentenceWithPagination)
  async getSentenceList(
    @Args('input') searchInput: SearchSentenceWithPaginationInput,
    @JwtAccount() account: Account,
  ): Promise<SentenceWithPagination> {
    const result = await this.sentencesService.findMany(searchInput, account);
    return result;
  }

  @Mutation(() => Boolean)
  async createSentence(
    @Args('input') createInput: CreateSentenceInput,
    @JwtAccount() account: Account,
  ): Promise<boolean> {
    const result = await this.sentencesService.create(createInput, account);
    return result;
  }

  @Mutation(() => Boolean)
  async updateSentence(
    @Args('input') updateInput: UpdateSentenceInput,
    @JwtAccount() account: Account,
  ): Promise<boolean> {
    const result = await this.sentencesService.update(updateInput, account);
    return result;
  }
}
