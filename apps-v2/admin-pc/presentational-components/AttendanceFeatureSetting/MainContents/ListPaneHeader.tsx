import * as React from 'react';

import './ListPaneHeader.scss';

const ROOT = 'admin-pc-attendance-feature-setting-header';

export type Props = {
  title: string;
};

export default ({ title }: Props) => {
  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__header`}>
        <div className={`${ROOT}__header-content slds-align-middle`}>
          <div className={`${ROOT}__header-content__title slds-align-middle`}>
            {title}
          </div>
        </div>
      </div>
    </div>
  );
};
