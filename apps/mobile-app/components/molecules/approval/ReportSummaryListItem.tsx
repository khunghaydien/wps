import * as React from 'react';

import classNames from 'classnames';

import LinkListItem from '../../atoms/LinkListItem';
import ReportSummary, { Props as ReportSummaryProps } from './ReportSummary';

const ROOT = 'mobile-app-molecules-approval-report-summary-list-item';

export type Props = Readonly<
  ReportSummaryProps & {
    className?: string;
    onClick: () => void;
  }
>;

export default class ReportSummaryListItem extends React.PureComponent<Props> {
  render() {
    const { className: _className, onClick, ...props } = this.props;
    const className = classNames(ROOT, _className);

    return (
      <LinkListItem className={className} onClick={onClick}>
        <ReportSummary {...props} />
      </LinkListItem>
    );
  }
}
