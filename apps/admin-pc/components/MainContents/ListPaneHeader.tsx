import * as React from 'react';

import Button from '../../../commons/components/buttons/Button';
import msg from '../../../commons/languages';

import './ListPaneHeader.scss';

const ROOT = 'admin-pc-contents-list-pane-header';

export type Props = {
  title: string;
  historyArea?: React.ReactElement<any>;
  onClickCreateNewButton: () => void;
  hideNewButton?: boolean;
};

export default ({
  title,
  historyArea,
  onClickCreateNewButton,
  hideNewButton,
}: Props) => {
  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__header`}>
        <div className={`${ROOT}__header-content slds-align-middle`}>
          <div className={`${ROOT}__header-content__title slds-align-middle`}>
            {title}
          </div>
        </div>
      </div>
      {!hideNewButton && (
        <div className={`${ROOT}__header-area`}>
          <Button
            className={`${ROOT}__new-button`}
            type="secondary"
            onClick={onClickCreateNewButton}
          >
            {msg().Com_Btn_New}
          </Button>
          {historyArea || null}
        </div>
      )}
    </div>
  );
};
