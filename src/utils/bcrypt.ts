import { hash, compare } from 'bcrypt';
const SALTROUNDS = 11;

export const encrypt = async (value: string): Promise<string> => {
  if (!value) throw new Error('encrypt string cannot be empty');
  const valueHash = await hash(value, SALTROUNDS);
  return valueHash;
};

export const validEncrypt = async (
  value: string | Buffer,
  hash: string,
): Promise<boolean> => {
  const match = await compare(value, hash);
  return match;
};
