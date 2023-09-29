import * as React from 'react';

import { shallow } from 'enzyme';

import clickable from '../clickable';

type A = <T>(a?: T) => React.SyntheticEvent<T>;

const syntheticEvent: A = (a) => {
  return {
    target: a,
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  } as any;
};

describe('clickable()', () => {
  test('onClick handler should be called', () => {
    const mock = jest.fn(() => <div />);
    const MockedComponent = clickable(mock);
    const handler = jest.fn(() => {});
    const wrapper = shallow<InstanceType<any>>(
      <MockedComponent onClick={handler} />
    );

    const mockSythenicEvent = syntheticEvent();
    wrapper.instance().handleClick(mockSythenicEvent);

    expect(handler).toHaveBeenCalled();
  });
});
