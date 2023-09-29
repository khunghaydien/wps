import React from 'react';

import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useKey } from '../index';

const KeyedComponent = ({ 'data-testid': testId }: Record<string, any>) => {
  const key = useKey();
  return (
    <div key={key} data-testid={testId}>
      {key}
    </div>
  );
};

const TestComponent = () => {
  return (
    <>
      <KeyedComponent data-testid="1" />
      <KeyedComponent data-testid="2" />
    </>
  );
};

it('should be an unique key for each instance', () => {
  const { getByTestId } = render(<TestComponent />);
  const key1 = getByTestId('1');
  const key2 = getByTestId('2');

  expect(key1).not.toEqual(key2);
});

it('should generate an unique key', () => {
  const value1 = renderHook(() => useKey());
  const value2 = renderHook(() => useKey());

  expect(value1.result.current).not.toEqual(value2.result.current);
});
