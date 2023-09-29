import React, { useEffect } from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import MessageClose from '@commons/images/icons/messageClose.svg';
import MessageSuccess from '@commons/images/icons/messageSuccess.svg';

type Props = {
  isShowSuccessMessage: boolean;
  setShowSuccessMessage: (flag: boolean) => void;
  flushGrantHistList: () => void;
};

const Z_INDEX_DEFAULT = 5100000;
const Dialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 150vw;
  margin-top: 250px;
`;

const GrantSuccessMessage: React.FC<Props> = ({
  isShowSuccessMessage,
  setShowSuccessMessage,
  flushGrantHistList,
}) => {
  useEffect(() => {
    if (isShowSuccessMessage) {
      setTimeout(() => {
        setShowSuccessMessage(false);
        flushGrantHistList();
      }, 1000);
    }
  });
  return (
    isShowSuccessMessage && (
      <Dialog style={{ zIndex: Z_INDEX_DEFAULT }}>
        <div className="slds-notify_container slds-is-relative">
          <div
            className="slds-notify slds-notify_toast slds-theme_success"
            role="status"
          >
            <span
              className="slds-icon_container slds-icon-utility-success slds-m-right_small slds-no-flex slds-align-top"
              title="Description of icon when needed"
            >
              <MessageSuccess
                className="slds-icon slds-icon_small"
                aria-hidden="true"
              />
            </span>
            <div className="slds-notify__content">
              <h2 className="slds-text-heading_small ">
                {msg().Admin_Lbl_DaysAdjusted}
              </h2>
            </div>
            <div className="slds-notify__close">
              <button
                className="slds-button slds-button_icon slds-button_icon-inverse"
                title="Close"
                type="button"
                onClick={() => {
                  setShowSuccessMessage(false);
                  flushGrantHistList();
                }}
              >
                <MessageClose
                  className="slds-button__icon slds-button__icon_large"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    )
  );
};

export default GrantSuccessMessage;
