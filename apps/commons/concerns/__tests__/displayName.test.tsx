import * as React from 'react';

import { mount } from 'enzyme';

import displayName from '../displayName';

describe('displayName()', () => {
  let Component;
  beforeEach(() => {
    const NamelessComponent = class extends React.Component<
      Record<string, unknown>
    > {
      render() {
        return <div>TEST</div>;
      }
    };
    Component = displayName('TeamSpirit')(NamelessComponent);
  });

  test('Set displayName', () => {
    expect(Component.displayName).toEqual('TeamSpirit');
  });

  test('Render component using displayName', () => {
    const wrapper = mount(<Component />);
    expect(wrapper.name()).toEqual('TeamSpirit');
  });
});
