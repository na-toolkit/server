import { Account } from '@/accounts/entities/account.entity';
import { type Request } from 'express';

export type CustomRequest = Request & { account?: Account };
