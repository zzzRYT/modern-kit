import { describe, it, expect, afterEach, vi, expectTypeOf } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSessionStorage } from '.';
import { renderToString } from 'react-dom/server';

afterEach(() => {
  sessionStorage.clear();
});

describe('useSessionStorage', () => {
  it('sessionStorage에 값이 없을 때 기본값으로 초기화되어야 합니다', () => {
    const { result } = renderHook(() =>
      useSessionStorage({ key: 'test', initialValue: 'default' })
    );

    expect(result.current.state).toBe('default');
  });

  it('sessionStorage에 값이 없을 때 기본값 함수의 반환값으로 초기화되어야 합니다', () => {
    const { result } = renderHook(() =>
      useSessionStorage({ key: 'test', initialValue: () => 'default' })
    );

    expect(result.current.state).toBe('default');
  });

  it('sessionStorage에 저장된 값으로 초기화되어야 합니다', () => {
    sessionStorage.setItem('test', JSON.stringify('storedValue'));

    const { result } = renderHook(() =>
      useSessionStorage({ key: 'test', initialValue: 'default' })
    );

    expect(result.current.state).toBe('storedValue');
  });

  it('상태가 변경될 때 sessionStorage도 업데이트되어야 합니다(1)', async () => {
    const { result } = renderHook(() =>
      useSessionStorage({ key: 'test', initialValue: 'default' })
    );

    await waitFor(() => {
      result.current.setState('newValue');
    });

    expect(result.current.state).toBe('newValue');
    expect(sessionStorage.getItem('test')).toBe(JSON.stringify('newValue'));
  });

  it('상태가 변경될 때 sessionStorage도 업데이트되어야 합니다(2)', async () => {
    sessionStorage.setItem('test', JSON.stringify([1, 2, 3]));

    const { result } = renderHook(() =>
      useSessionStorage({ key: 'test', initialValue: [1, 2, 3] })
    );

    await waitFor(() => {
      result.current.setState((state) => [...state, 4]);
    });

    expect(result.current.state).toEqual([1, 2, 3, 4]);
    expect(sessionStorage.getItem('test')).toBe(JSON.stringify([1, 2, 3, 4]));
  });

  it('sessionStorage에서 값이 제거되어야 합니다', async () => {
    sessionStorage.setItem('test', JSON.stringify('storedValue'));

    const { result } = renderHook(() =>
      useSessionStorage<string>({ key: 'test' })
    );

    await waitFor(() => {
      result.current.removeState();
    });

    expect(result.current.state).toBeNull();
    expect(sessionStorage.getItem('test')).toBeNull();
  });

  it('서버 사이드 렌더링 중에는 초기값이 렌더링되어야 합니다', async () => {
    const TestComponent = () => {
      const { state } = useSessionStorage({ key: 'test', initialValue: 'ssr' });
      return <p>{state}</p>;
    };

    const html = renderToString(<TestComponent />); // server side rendering

    expect(html).toContain('ssr');
  });

  it('initialValue의 존재 여부에 따라 타입이 추론되어야 합니다', () => {
    const { result: result1 } = renderHook(() =>
      useSessionStorage<string>({ key: 'test' })
    );
    expectTypeOf(result1.current.state).toEqualTypeOf<string | null>();

    const { result: result2 } = renderHook(() =>
      useSessionStorage<string>({ key: 'test', initialValue: 'default' })
    );
    expectTypeOf(result2.current.state).toEqualTypeOf<string>();
  });

  it('sessionStorage에 유효하지 않은 JSON이 포함되어 있을 때 에러가 발생해야 합니다', async () => {
    sessionStorage.setItem('test', "{key: 'value'}");

    expect(() => {
      return renderHook(() => useSessionStorage({ key: 'test' }));
    }).toThrowError();
  });

  it('sessionStorage에 아이템 설정이 실패할 때 에러가 발생해야 합니다', async () => {
    const { result } = renderHook(() => useSessionStorage({ key: 'test' }));

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error();
    });

    expect(() => result.current.setState('error')).toThrowError();
  });

  it('sessionStorage에서 아이템 제거가 실패할 때 에러가 발생해야 합니다', async () => {
    const { result } = renderHook(() => useSessionStorage({ key: 'test' }));

    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error();
    });

    expect(() => result.current.removeState()).toThrowError();
  });
});
