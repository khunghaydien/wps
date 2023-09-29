import React from 'react';

import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';

import ItemList from '../../../components/organisms/tracking/ItemList';

export default {
  title: 'Components/organisms/tracking',
  decorators: [withKnobs, withInfo],
};

export const _ItemList = () => (
  <ItemList
    items={[
      {
        id: '1',
        code: 'DEV-10000000000000000000000000',
        name: '〇一二三四五六七八九〇一二三四五六七八九〇一二三四五六七八九〇一二三四五六七八九〇一二三四五六七八九〇一二三四五六七八九〇一二三四五六七八九〇一二三四五全角８０',
        hasChildren: false,
        parentId: null,
        hasJobType: true,
        workCategories: [],
        isDirectCharged: false,
        isEditLocked: false,
      },
      {
        id: '2',
        code: 'DEV-10002',
        name: '契約プロジェクト',
        hasChildren: false,
        parentId: null,
        hasJobType: true,
        workCategories: [],
        isDirectCharged: false,
        isEditLocked: false,
      },
      {
        id: '3',
        code: 'DEV-10003',
        name: 'PD',
        hasChildren: false,
        parentId: null,
        hasJobType: true,
        workCategories: [],
        isDirectCharged: false,
        isEditLocked: false,
      },
      {
        id: '4',
        code: 'DEV-10004',
        name: 'WSP_Tracking',
        hasChildren: false,
        parentId: null,
        hasJobType: true,
        workCategories: [],
        isDirectCharged: false,
        isEditLocked: false,
      },
      {
        id: '5',
        code: '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
        name: '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
        hasChildren: false,
        parentId: null,
        hasJobType: true,
        workCategories: [],
        isDirectCharged: false,
        isEditLocked: false,
      },
      {
        id: '6',
        code: 'TOO LONG CODE TOO LONG CODE TOO LONG CODE TOO LONG CODE',
        name: 'TOO LONG TEXT TOO LONG TEXT TOO LONG TEXT TOO LONG TEXT TOO LONG TEXT TOO LONG TEXT TOO LONG TEXT TOO LONG TEXT TOO LONG TEXT TOO LONG TEXT TOO LONG TEXT TOO LONG TEXT',
        hasChildren: false,
        parentId: null,
        hasJobType: true,
        workCategories: [],
        isDirectCharged: false,
        isEditLocked: false,
      },
    ]}
    onClickChildJob={action('onClickChildJob')}
    onClickJob={action('onClickJob')}
  />
);

_ItemList.storyName = 'ItemList';
