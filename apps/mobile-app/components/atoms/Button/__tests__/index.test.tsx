import * as React from 'react';

import { shallow } from 'enzyme';

// eslint-disable-next-line
//@ts-ignore
import floatable, { __get__ as FoatableGet } from '../floatable';

describe('Button', () => {
  describe('floatable()', () => {
    const ROOT = FoatableGet('ROOT');

    describe.each(['top', 'bottom'])('float an element on $o ', (position) => {
      test(`should add style for floating an element on ${position}`, () => {
        const mock = jest.fn(() => <div />);
        const MockedComponent = floatable(mock);
        // @ts-ignore
        const wrapper = shallow(<MockedComponent floating={position} />);

        expect(wrapper.hasClass(`${ROOT}__floating`)).toBeTruthy();
        expect(wrapper.hasClass(`${ROOT}__floating--${position}`)).toBeTruthy();
      });
    });
  });
});
