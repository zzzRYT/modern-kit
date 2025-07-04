import { describe, it, expectTypeOf } from 'vitest';
import { EnumerateNumbers } from '.';

describe('EnumerateNumbers', () => {
  it('number 타입이라면 0 ~ N-1까지의 숫자 유니언 타입을 생성합니다.', () => {
    const validEnumerate: EnumerateNumbers<6> = 4;

    expectTypeOf(validEnumerate).toEqualTypeOf<4>();
  });

  it('number타입이 아니라면 never타입을 반환합니다.', () => {
    const stringEnumerate: EnumerateNumbers<'6'> =
      '6' as unknown as EnumerateNumbers<'6'>;
    const booleanEnumerate: EnumerateNumbers<true> =
      true as unknown as EnumerateNumbers<true>;
    const objectEnumerate: EnumerateNumbers<{ value: 6 }> = {
      value: 6,
    } as unknown as EnumerateNumbers<{ value: 6 }>;
    const arrayEnumerate: EnumerateNumbers<number[]> = [
      1, 2, 3,
    ] as unknown as EnumerateNumbers<number[]>;

    expectTypeOf(stringEnumerate).toEqualTypeOf<never>();
    expectTypeOf(booleanEnumerate).toEqualTypeOf<never>();
    expectTypeOf(objectEnumerate).toEqualTypeOf<never>();
    expectTypeOf(arrayEnumerate).toEqualTypeOf<never>();
  });
});
