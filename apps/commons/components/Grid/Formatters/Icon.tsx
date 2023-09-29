import * as React from 'react';

import './Icon.scss';

const ROOT = 'commons-grid-formatters-icon';

type Props = {
  align: 'top' | 'bottom' | 'middle';
  src: string;
};

const alignClassNames = {
  top: `${ROOT}__top`,
  middle: `${ROOT}__middle`,
  bottom: `${ROOT}__bottom`,
};

export default (props: Props) => {
  const alignClass = alignClassNames[props.align];
  return (
    <div className={`${ROOT} ${alignClass}`}>
      <img src={props.src} />
    </div>
  );
};
