import React from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';

import './GridDetailModalPortal.scss';

const ROOT =
  'ts-expenses__form-records__bulk-edit__grid-area-cell-detail-modal';

type Props = {
  children: React.ReactElement | Array<React.ReactElement>;
  containerClass?: string;
  containerId: string;
  show: boolean;
};
const GridDetailModalPortal = (props: Props): React.ReactElement | null => {
  const { containerId, show, children, containerClass } = props;

  const elementDom = document.getElementById(containerId);
  if (!show || !elementDom) return null;

  return ReactDOM.createPortal(
    <div className={classNames(ROOT, containerClass)}>{children}</div>,
    elementDom
  );
};

export default GridDetailModalPortal;
