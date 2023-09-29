import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { number, withKnobs } from '@storybook/addon-knobs';

import Pagination from '../components/Pagination';

export default {
  title: 'commons',
  decorators: [withKnobs],
};

export const Pagenation = withInfo(`
    # Description

    ページャーコンポーネント
    自動的にページャーを作成します

    # Propsについて

    currentPage:現在のページ
    pageSize: １ページの件数
    displayNum: 表示するページ数
    totalNum: 件数
  `)(() => (
  // @ts-ignore
  <Pagination
    currentPage={number('current', 18)}
    pageSize={number('pageSize', 30)}
    displayNum={number('displayNum', 5)}
    totalNum={number('totalNum', 524)}
    // @ts-ignore
    onClick={action('pageClick')}
  />
));
