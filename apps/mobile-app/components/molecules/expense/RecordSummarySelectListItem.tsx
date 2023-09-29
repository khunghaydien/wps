import * as React from 'react';

import classNames from 'classnames';

import RecordSummary, { Props as RecordSummaryProps } from './RecordSummary';

import './RecordSummarySelectListItem.scss';

const ROOT = 'mobile-app-molecules-expense-record-summary-select-list-item';

export type Props = Readonly<
  RecordSummaryProps & {
    className?: string;
    isSelected: boolean;
    onClick: () => void;
  }
>;

export default class RecordSummarySelectListItem extends React.PureComponent<Props> {
  render() {
    const { className, onClick, isSelected, ...props } = this.props;
    const finalClassName = classNames(ROOT, className);

    return (
      <div className={finalClassName} onClick={onClick}>
        <div className={`${ROOT}__checkbox`}>
          <input type="checkbox" checked={isSelected} />
        </div>
        <RecordSummary className={`${ROOT}__record-summary`} {...props} />
      </div>
    );
  }
}
