import * as React from 'react';

import { mount } from 'enzyme';

import Modal from '../Modal';

class Children extends React.Component {
  render() {
    return <div />;
  }
}

describe('Modal', () => {
  test('Render children', () => {
    const wrapper = mount(
      <Modal>
        <Children />
      </Modal>
    );

    expect(wrapper.find(Children).length).toEqual(1);
  });
});
