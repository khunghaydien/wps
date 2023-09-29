import React from 'react';

import BreadcrumbContainer from '@apps/commons/containers/psa/BreadcrumbContainer';

import './index.scss';

const ROOT = 'ts-psa__common-header';

type Props = {
  children?: React.ReactNode;
  isOmitFields?: boolean;
  title: string;
};
const PSACommonHeader = (props: Props) => {
  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}-left`}>
        {!props.isOmitFields && <BreadcrumbContainer />}
        <span className={`${ROOT}-title`}>{props.title}</span>
      </div>

      <div className={`${ROOT}__btn-area`}>{props.children}</div>
    </div>
  );
};

export default PSACommonHeader;
