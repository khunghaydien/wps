import React from 'react';

import { action } from '@storybook/addon-actions';

import { WORK_SYSTEM_TYPE } from '@attendance/domain/models/WorkingType';

import ListSearchFormWithType, {
  FIELD_TYPE,
} from '../components/ListSearchFormWithType';

export default {
  title: 'admin-pc/ListSearchFormWithType',

  decorators: [
    (story: Function) => (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {story()}
      </div>
    ),
  ],
};

export const Default = () => (
  <ListSearchFormWithType
    fields={[
      {
        key: 'code',
        label: 'Code',
        value: 'code',
        fieldType: FIELD_TYPE.TEXT,
        width: '100px',
      },
      {
        key: 'name',
        label: 'Name',
        value: 'name',
        fieldType: FIELD_TYPE.DATE,
        width: '150px',
      },
      {
        key: 'work',
        label: 'Department',
        value: '',
        fieldType: FIELD_TYPE.DROPDOWN,
        options: [
          {
            label: 'Fix',
            value: WORK_SYSTEM_TYPE.JP_Fix,
          },
          {
            label: 'Flex',
            value: WORK_SYSTEM_TYPE.JP_Flex,
          },
          {
            label: 'Modified',
            value: WORK_SYSTEM_TYPE.JP_Modified,
          },
          {
            label: 'Discretion',
            value: WORK_SYSTEM_TYPE.JP_Discretion,
          },
          {
            label: 'Manager',
            value: WORK_SYSTEM_TYPE.JP_Manager,
          },
        ],
      },
    ]}
    onChange={action('onChange')}
    onSubmit={action('onSubmit')}
  />
);
