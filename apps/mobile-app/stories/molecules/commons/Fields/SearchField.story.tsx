import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { withKnobs } from '@storybook/addon-knobs';

import SearchField from '../../../../components/molecules/commons/Fields/SearchField';

export default {
  title: 'Components/molecules/commons/Fields/SearchField',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
    # Description

    This component is used as search field for mobile app。
  `)(() => (
  <SearchField
    placeHolder="Search"
    iconClick={action('onClick')}
    onChange={action('onChange')}
    label="Label"
    value="value"
  />
));
