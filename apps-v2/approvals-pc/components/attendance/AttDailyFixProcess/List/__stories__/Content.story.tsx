import * as React from 'react';

import { action } from '@storybook/addon-actions';

import { defaultValue as records } from '../../__stories__/mocks/records.mock';
import Component from '../Content';

export default {
  title: 'approvals-pc/attendance/AttDailyFixProcess/List/Content',
};

const props: React.ComponentProps<typeof Component> = {
  requests: records,
  order: {
    key: 'submitter.employee.code',
    direction: 'asc',
  },
  selectedId: '0003',
  checkedIds: ['0002'],
  checkedAll: false,
  maxSelection: 100,
  onClickSort: action('onClickSort'),
  onCheckAll: action('onCheckAll'),
  onClickRow: action('onClickRow'),
  onCheckRow: action('onCheckRow'),
  onChangeMaxSelection: action('onChangeMaxSelection'),
};

export const Default = (): React.ReactNode => <Component {...props} />;

export const MinSize = (): React.ReactNode => (
  <div
    style={{
      minWidth: '1024px',
      maxWidth: '1024px',
    }}
  >
    <Component {...props} />
  </div>
);

export const SelectedMax = (): React.ReactNode => (
  <Component
    {...{
      ...props,
      maxSelection: 1,
      checkedAll: true,
    }}
  />
);
