import React from 'react';

import Tooltip from '@commons/components/Tooltip';
import InfoIcon from '@commons/images-pre-optimized/icons/info.svg';

import './index.scss';

const ROOT = 'list-header-nav-icon';
type Props = {
  hintAlign?: string;
  hintMsg?: string;
};
const ListHeaderNavIcon = (props: Props) => {
  const { hintAlign, hintMsg } = props;
  return (
    <Tooltip
      id={ROOT}
      align={hintAlign}
      content={<div className={`${ROOT}__hintMsg`}>{hintMsg}</div>}
      hasStaticAlignment={false}
    >
      <InfoIcon className={`${ROOT}__info`} />
    </Tooltip>
  );
};

export default ListHeaderNavIcon;
