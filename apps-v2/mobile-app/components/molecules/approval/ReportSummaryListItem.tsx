import * as React from 'react';

import classNames from 'classnames';

import styled, { css } from 'styled-components';

import $LinkListItem from '../../atoms/LinkListItem';
import ReportSummary from './ReportSummary';
import { colors } from '@mobile/styles/variables';

const ROOT = 'mobile-app-molecules-approval-report-summary-list-item';

const LinkListItem = styled($LinkListItem)`
  ${(props) =>
    props.checked
      ? css`
          &&& {
            background-color: ${colors.blue100};
          }
        `
      : ''}
`;

type Props = Readonly<
  React.ComponentProps<typeof ReportSummary> & {
    className?: string;
    onClick: () => void;
    onCheck?: () => void;
  }
>;

const ReportSummaryListItem: React.FC<Props> = ({
  className: _className,
  onClick,
  onCheck: $onCheck,
  ...props
}) => {
  const className = React.useMemo(
    () => classNames(ROOT, _className),
    [_className]
  );
  const onCheck = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if ($onCheck) {
        event.preventDefault();
        event.stopPropagation();
        $onCheck();
      }
    },
    [$onCheck]
  );

  return (
    <LinkListItem
      className={className}
      onClick={onClick}
      checked={props.checked}
    >
      <ReportSummary onCheck={onCheck} {...props} />
    </LinkListItem>
  );
};

export default ReportSummaryListItem;
