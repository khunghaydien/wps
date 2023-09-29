import * as React from 'react';

import { action } from '@storybook/addon-actions';

import Component from '..';
import OwnerEmployee from '../OwnerEmployee';

const OwnerEmployeeContainer = () => (
  <OwnerEmployee
    allowedSwitching={true}
    ownerEmployee={{
      id: 'ID',
      code: '0001',
      name: 'スピリット太郎',
      department: {
        name: '部署名',
      },
      delegated: false,
    }}
    changeOwnerEmployee={action('changeOwnerEmployee')}
  />
);

export const Default = () => <Component {...{ OwnerEmployeeContainer }} />;
