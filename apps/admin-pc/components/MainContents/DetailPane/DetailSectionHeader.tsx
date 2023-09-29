import * as React from 'react';

import classNames from 'classnames';

import IconButton from '../../../../commons/components/buttons/IconButton';

import btnClose from '../../../images/btnClose.png';
import btnOpen from '../../../images/btnOpen.png';

import './DetailSectionHeader.scss';

const ROOT = 'admin-pc-main-contents-detail-pane-detail-section-header';

type Props = {
  children: React.ReactNode;
  isExpandable?: boolean;
  isClosed?: boolean;
  onClickToggleButton?: () => void;
  className?: string;
};

const DetailSectionHeader = (props: Props) => (
  <div className={classNames(ROOT, props.className)}>
    {props.isExpandable ? (
      <div className={`${ROOT}__toggle-button`}>
        <IconButton
          src={props.isClosed ? btnClose : btnOpen}
          onClick={props.onClickToggleButton}
        />
      </div>
    ) : null}
    <div className={`${ROOT}__title`}>{props.children}</div>
  </div>
);

DetailSectionHeader.defaultProps = {
  isExpandable: false,
  isClosed: false,
  onClickToggleButton: () => {},
  className: null,
};

export default DetailSectionHeader;
