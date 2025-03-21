import { bench, describe } from 'vitest';
import { flatMap } from '.';
import { flatMapDepth as flatMapDepthLodash } from 'lodash-es';

function createNestedArray(arr: any[], depth: number) {
  let result = arr;

  for (let i = 0; i < depth; i++) {
    result = [result];
  }
  return result;
}

describe('flatMap', () => {
  const iterateeDepth = (item: number) =>
    createNestedArray([item, item, item], 10);
  const arr = Array.from({ length: 30 }, (_, i) => i);

  bench('modern-kit/flatMap', () => {
    flatMap(arr, iterateeDepth, 10);
  });

  bench('lodash/flatMapDepth', () => {
    flatMapDepthLodash(arr, iterateeDepth, 10);
  });

  bench('js built-in/map.flat', () => {
    arr.map(iterateeDepth).flat(10);
  });
});
