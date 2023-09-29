import * as React from 'react';

import classNames from 'classnames';

import LinkListItem from '../../atoms/LinkListItem';
import RecordSummary, { Props as RecordSummaryProps } from './RecordSummary';

const ROOT = 'mobile-app-molecules-expense-record-summary-list-item';

export type Props = Readonly<
  RecordSummaryProps & {
    className?: string;
    onClick: () => void;
  }
>;

export default class RecordSummaryListItem extends React.PureComponent<Props> {
  render() {
    const { className: _className, onClick, ...props } = this.props;
    const className = classNames(ROOT, _className);

    return (
      <LinkListItem className={className} onClick={onClick}>
        <RecordSummary {...props} />
      </LinkListItem>
    );
  }
}
