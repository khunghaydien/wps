import * as React from 'react';

import './FieldGroupFrame.scss';

const ROOT = 'commons-grid-filters-field-group-frame';

type SeperatorIfc = {
  key: string;
  children?: React.ReactNode;
};

const Seperator = (_props?: SeperatorIfc) => (
  <span className={`${ROOT}__separator`}>/</span>
);

const Field = (props: { children: React.ReactNode }) => (
  <span className={`${ROOT}__field`}>{props.children}</span>
);

type Props = {
  children: React.ReactNode[];
  className?: string;
};

const FieldGroupFrame = (props: Props) => (
  <div className={`${ROOT} ${props.className || ''}`}>
    {(props.children || []).reduce((elms: React.ReactNode[], elm, index) => {
      if (index > 0) {
        elms.push(<Seperator key={`separator-${index}`}>/</Seperator>);
      }
      elms.push(<Field key={`field-${index}`}>{elm}</Field>);
      return elms;
    }, [])}
  </div>
);

export default FieldGroupFrame;
