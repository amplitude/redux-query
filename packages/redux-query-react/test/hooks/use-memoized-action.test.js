import { renderHook } from 'react-hooks-testing-library';

import useMemoizedQueryConfig from '../../src/hooks/use-memoized-query-config';

describe('useMemoizedQueryConfig', () => {
  it('should merge in a callback', () => {
    const queryConfig = {
      url: '/api',
      body: {
        planet: 'earth',
      },
    };

    const callback = () => {};
    const transform = queryConfig => ({ ...queryConfig, unstable_preDispatchCallback: callback });

    const { result } = renderHook(() => useMemoizedQueryConfig(queryConfig, transform));

    expect(result.current).toEqual({
      url: '/api',
      body: {
        planet: 'earth',
      },
      unstable_preDispatchCallback: callback,
    });
  });

  it('should memoize the query config', () => {
    const queryConfig = {
      url: '/api',
      body: {
        planet: 'earth',
      },
    };

    const callback = () => {};

    // Initial render

    const transform = queryConfig => ({ ...queryConfig, unstable_preDispatchCallback: callback });
    const { result, rerender } = renderHook(() => useMemoizedQueryConfig(queryConfig, transform));
    const returnValue1 = result.current;

    // Rerending but no props changed and the query config is the exact same, so the return value
    // better be memoized (reference equality memoization)

    rerender();
    const returnValue2 = result.current;

    expect(returnValue1).toBe(returnValue2);
  });

  it('should memoize the query config if query key is same, even if query config is different', () => {
    const queryConfig1 = {
      url: '/api',
      body: {
        planet: 'earth',
      },
    };
    const queryConfig2 = {
      url: '/api',
      body: {
        planet: 'earth',
      },
      update: {
        distanceFromSun: (prevValue, newValue) => newValue,
      },
    };

    const callback = () => {};
    const transform = queryConfig => ({ ...queryConfig, unstable_preDispatchCallback: callback });

    const { result, rerender } = renderHook(() => useMemoizedQueryConfig(queryConfig1, transform));
    const firstReturnValue = result.current;
    rerender(queryConfig2, callback);
    const secondReturnValue = result.current;
    expect(firstReturnValue).toBe(secondReturnValue);
  });

  it('should return a new action if query key changes', () => {
    const queryConfig1 = {
      url: '/api',
      body: {
        planet: 'earth',
      },
    };

    const queryConfig2 = {
      url: '/api',
      body: {
        planet: 'mars',
      },
      update: {
        distanceFromSun: (prevValue, newValue) => newValue,
      },
    };

    let queryConfig = queryConfig1;
    const callback = () => {};
    const transform = queryConfig => ({ ...queryConfig, unstable_preDispatchCallback: callback });

    // Initial render

    const { result, rerender } = renderHook(() => useMemoizedQueryConfig(queryConfig, transform));
    const firstReturnValue = result.current;

    // Something in the component ancestry updated and now the query config has changed with a new
    // query key. React is now rerendering the component that has this hook, and the action better
    // have updated!

    queryConfig = queryConfig2;
    rerender();
    const secondReturnValue = result.current;

    expect(firstReturnValue).not.toBe(secondReturnValue);
    expect(firstReturnValue).toEqual({
      ...queryConfig1,
      unstable_preDispatchCallback: callback,
    });
    expect(secondReturnValue).toEqual({
      ...queryConfig2,
      unstable_preDispatchCallback: callback,
    });
  });
});
