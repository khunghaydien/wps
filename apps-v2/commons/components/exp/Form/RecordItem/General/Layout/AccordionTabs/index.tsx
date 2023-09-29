import React, { ReactElement } from 'react';

import './index.scss';

type Props = {
  children: ReactElement;
  className?: string;
};

const AccordionTabs = ({ children, className }: Props) => (
  <div className={`accordion-tabs ${className}`}>{children}</div>
);

export default AccordionTabs;
