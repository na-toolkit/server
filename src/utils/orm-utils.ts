import { omitBy } from 'lodash';

export const formatUpdate = <T extends Record<string, unknown>>(
  updateData: T,
  opts?: { omitNullable?: boolean },
): Partial<T> => {
  const { omitNullable = false } = opts || {};
  return omitBy<T>(
    updateData,
    (v) => v === undefined || (omitNullable && v === null),
  );
};
