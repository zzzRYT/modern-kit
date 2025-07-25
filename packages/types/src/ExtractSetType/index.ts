/**
 * @description Set 타입의 제네릭 타입을 추출하는 타입입니다. Set<T>와 같은 타입에서 T를 추출하여 반환합니다.
 *
 * @template T - 타입을 추출할 Set 타입
 * @returns Set의 내부 요소 타입을 반환합니다. Set이 아닌 경우 never를 반환합니다.
 *
 * @example
 * type StringSet = Set<string>;
 * type Result = ExtractSetType<StringSet>; // string
 *
 * type NotASet = ExtractSetType<number>; // never
 */
export type ExtractSetType<T> = T extends Set<infer U> ? U : never;
