import { describe, it, expectTypeOf } from 'vitest';
import { Range } from '.';

describe('Range', () => {
  it('범위 내 숫자라면 정상 출력하고, 범위 밖 숫자라면 타입에러를 발생시킵니다.', () => {
    const intraRangeIntegers: Range<1, 5> = 3;
    const outOfRangeInteger = 6 as unknown as Range<1, 5>;

    expectTypeOf(intraRangeIntegers).toEqualTypeOf<3>();
    expectTypeOf(outOfRangeInteger).not.toMatchTypeOf<6>();
  });

  it('<number, number>타입 이라면 해당 타입을 반환하고, <number, number>타입이 아니라면 never를 반환합니다.', () => {
    const otherTypeRange: Range<1, '5'> = null as unknown as Range<1, '5'>;

    expectTypeOf(otherTypeRange).toEqualTypeOf<never>();
  });
});
