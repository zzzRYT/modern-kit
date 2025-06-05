import { describe, it, expectTypeOf } from 'vitest';
import { Range } from '.';

describe('Range', () => {
  it('범위 내의 숫자라면 타입을 반환합니다.', () => {
    const intraRangeIntegers: Range<1, 5> = 3;

    expectTypeOf(intraRangeIntegers).toEqualTypeOf<3>();
  });

  it('범위 밖의 숫자라면 타입 에러를 발생시킵니다.', () => {
    // @ts-expect-error
    const outOfRange: Range<1, 5> = 7;
    expectTypeOf(outOfRange).not.toEqualTypeOf<7>();
  });

  it('Range 타입이 정수가 아니라면 에러를 발생시킵니다.', () => {
    // @ts-expect-error
    const wrong: Range<1, 5> = 'hello world';
    expectTypeOf(wrong).not.toEqualTypeOf<'hello world'>();
  });
});
