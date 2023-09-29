import React from 'react';

import msg from '../../../../../../../commons/languages';
import Navigation from '../../../../../molecules/commons/Navigation';

import './index.scss';

const ROOT = 'mobile-app-pages-expense-page-record-list';

export default (props: any) => {
  return (
    <article>
      <Navigation title={msg().Exp_Lbl_RecordItems} />
      <section className={ROOT}>{JSON.stringify(props.recordItem)}</section>
    </article>
  );
};
