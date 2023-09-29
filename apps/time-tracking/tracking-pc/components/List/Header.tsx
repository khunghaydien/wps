import React from 'react';

import msg from '../../../../commons/languages';

import './Header.scss';
import './column.scss';

const ROOT = 'tracking-pc-list-header';
const COLUMN_ROOT = 'tracking-pc-list-column';

export default class Header extends React.Component {
  render() {
    return (
      <header className={`${ROOT}`}>
        <div className={`${ROOT}__item ${COLUMN_ROOT}--date`}>
          {msg().Trac_Lbl_Date}
        </div>
        <div className={`${ROOT}__item ${COLUMN_ROOT}--name`}>
          {msg().Trac_Lbl_Job}/{msg().Trac_Lbl_WorkCategory}
        </div>
        <div className={`${ROOT}__item ${COLUMN_ROOT}--tracking-graph`}>
          {msg().Trac_Lbl_WorkTimeGraph}
        </div>
        <div className={`${ROOT}__item ${COLUMN_ROOT}--work-time`}>
          {msg().Trac_Lbl_Work}
        </div>
        <div className={`${ROOT}__item ${COLUMN_ROOT}--comment`}>
          {msg().Trac_Lbl_Comments}
        </div>
      </header>
    );
  }
}
