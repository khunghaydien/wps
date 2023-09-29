import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import SearchButtonField from '../../../../components/molecules/commons/Fields/SearchButtonField';

export default {
  title: 'Components/molecules/commons/Fields/SearchButtonField',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
    # Description

    This component is used like a button for searching in next page with delete function in mobile app.
  `)(() => (
  <SearchButtonField
    placeholder={text('placeholder', 'Search')}
    onClick={action('onClick')}
    onClickDeleteButton={action('onClickDeleteButton')}
    label={text('label', 'Label')}
    value={text('value', 'value')}
    disabled={boolean('disabled', false)}
    required={boolean('required', false)}
    readOnly={boolean('readOnly', false)}
  />
));
