export type OmitTable<T, U extends keyof any = ''> = Omit<
  T,
  U | 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
