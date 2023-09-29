import * as React from 'react';

import classnames from 'classnames';

import './Row.scss';

const ROOT = `admin-pc-record-table-row`;

const Row = ({
  className,
  active,
  onClick,
  children,
}: {
  className?: string;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) => (
  <div
    className={classnames(
      ROOT,
      {
        active,
        clickable: onClick,
      },
      className
    )}
    onClick={onClick}
    onKeyPress={() => {}}
    role="button"
    tabIndex={0}
  >
    {children}
  </div>
);

export default Row;
