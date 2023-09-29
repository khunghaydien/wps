import * as React from 'react';

import { shallow } from 'enzyme';

import Icon from '../../Icon';
import Select from '../Select';

describe('Select', () => {
  const baseProps = {
    placeholder: 'None',
    options: [
      {
        value: 1,
        label: 'Apple',
      },
      {
        value: 2,
        label: 'Banana',
      },
    ],
  };

  describe('should chevrondown icon is visible.', () => {
    describe.each([
      {
        description: 'No props.',
        props: {},
      },
      {
        description: 'Icon is null.',
        props: {
          icon: null,
        },
      },
      {
        description: 'Size is null.',
        props: {
          size: null,
        },
      },
      {
        description: 'Size is 1.',
        props: {
          size: 1,
        },
      },
      {
        description: 'Multiple is false',
        props: {
          multiple: false,
        },
      },
    ])('%o', ({ description, props }) => {
      test(description, () => {
        const select = shallow(<Select {...props} {...baseProps} />);
        expect(select.find(Icon)).toHaveLength(1);
      });
    });
  });
  describe('should chevrondown icon is invisible.', () => {
    describe.each([
      {
        description: 'Icon is false.',
        props: {
          icon: false,
        },
      },
      {
        description: 'Size is 2.',
        props: {
          size: 2,
        },
      },
      {
        description: 'Multiple is true.',
        props: {
          multiple: true,
        },
      },
      {
        description: 'Size is 3, Multiple is true',
        props: {
          size: 3,
          multiple: true,
        },
      },
    ])('%o', ({ description, props }) => {
      test(description, () => {
        // @ts-ignore
        const select = shallow(<Select {...props} {...baseProps} />);
        expect(select.find(Icon)).toHaveLength(0);
      });
    });
  });
});
