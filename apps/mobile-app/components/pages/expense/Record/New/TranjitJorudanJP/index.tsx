import React from 'react';

import msg from '../../../../../../../commons/languages';
import Navigation from '../../../../../molecules/commons/Navigation';

import './index.scss';

const ROOT = 'mobile-app-pages-expense-page-record-new-transit-jorudan-jp';

export default () => (
  <article>
    <Navigation title={msg().Exp_Lbl_RouteSearch} />
    <section className={ROOT}>body</section>
  </article>
);
