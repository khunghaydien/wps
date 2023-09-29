import * as React from 'react';

import { shallow } from 'enzyme';

import ToggleButton, {
  // eslint-disable-next-line
  //@ts-ignore
  __get__,
} from '../ToggleButton';

const withId = __get__('withId');

describe('ToggleButton', () => {
  describe('withId()', () => {
    test(`should let component have unique id`, () => {
      const mock = jest.fn(() => <div />);
      const MockedComponent = withId(mock);
      const wrapperA = shallow<typeof ToggleButton>(<MockedComponent />);
      const wrapperB = shallow<typeof ToggleButton>(<MockedComponent />);

      expect(wrapperA.state().id !== wrapperB.state().id).toBeTruthy();
    });

    test(`should not chagne unique id on props changed`, () => {
      const mock = jest.fn(() => <div />);
      const MockedComponent = withId(mock);
      const wrapper = shallow<typeof ToggleButton>(<MockedComponent />);

      const id0 = wrapper.state().id;
      // @ts-ignore
      wrapper.setProps({ testId: 'uniqueId' });
      const id1 = wrapper.state().id;

      expect(id0 === id1).toBeTruthy();
    });
  });
});
