import { ObjectKeys } from '@modern-kit/types';

export function objectEntries<T extends Record<PropertyKey, T[keyof T]>>(
  obj: T
): [ObjectKeys<T>, T[ObjectKeys<T>]][] {
  return Object.entries(obj) as [ObjectKeys<T>, T[ObjectKeys<T>]][];
}
