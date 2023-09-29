import * as React from 'react';

import { shallow } from 'enzyme';

import closable from '../closable';

const Component = closable(
  class extends React.Component<any> {
    render() {
      return <div />;
    }
  }
);

describe('closable()', () => {
  test('Open as default', () => {
    const wrapper = shallow<typeof closable>(<Component />);

    expect(wrapper.state().isOpening).toBeTruthy();
  });

  test('Close onClickCloseButton', () => {
    const wrapper = shallow<InstanceType<any>>(<Component />);
    wrapper.instance().onClickCloseButton();
    expect(wrapper.state().isOpening).toBeTruthy();
  });

  describe('props: isOpened', () => {
    test('Closed if isOpened is false', () => {
      const wrapper = shallow<typeof closable>(<Component isOpened={false} />);

      expect(wrapper.state().isOpening).toBeFalsy();
    });

    test('Opened if isOpened is true', () => {
      const wrapper = shallow(<Component isOpened />) as any;

      expect(wrapper.state().isOpening).toBeTruthy();
    });
  });

  describe('props: onClickCloseButton', () => {
    test('Call onClickCloseButton handler', () => {
      const handler = jest.fn(() => {});
      const wrapper = shallow<InstanceType<any>>(
        <Component isOpened onClickCloseButton={handler} />
      );
      wrapper.instance().onClickCloseButton();

      expect(handler).toHaveBeenCalled();
    });
  });
});
