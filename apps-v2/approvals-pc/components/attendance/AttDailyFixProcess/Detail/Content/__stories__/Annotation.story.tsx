import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import styled from 'styled-components';

import Component from '../Annotation';

export default {
  title: 'approvals-pc/attendance/AttDailyFixProcess/Detail/Content/Annotation',
  decorators: [withKnobs],
};

const Wrap = styled.div`
  width: 500px;
`;

export const Default = (): React.ReactElement => (
  <Wrap>
    <div>
      <Component
        expanded={boolean('expanded', false)}
        onClickShowAll={action('onClickShowAll')}
      />
    </div>
    <div>
      <Component expanded={false} onClickShowAll={action('onClickShowAll')} />
    </div>
    <div>
      <Component expanded={true} onClickShowAll={action('onClickShowAll')} />
    </div>
  </Wrap>
);
