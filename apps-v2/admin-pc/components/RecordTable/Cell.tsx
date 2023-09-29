import * as React from 'react';

import classnames from 'classnames';

import './Cell.scss';

const ROOT = 'admin-pc-record-table-cell';

const Cell = ({
  className,
  width = 'auto',
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  width: string;
  role?: string;
  tabIndex?: number;
  onClick?: () => void;
}) => {
  const flexBasis = {
    'flex-basis': width,
  } as React.CSSProperties;
  return (
    <div className={classnames(ROOT, className)} style={flexBasis} {...props}>
      {children}
    </div>
  );
};

export default Cell;
