import React, { useState } from 'react';

import Button from '@apps/commons/components/buttons/Button';
import msg from '@apps/commons/languages';

import Exclamation from '@apps/psa-pc/images/icons/exclamation.svg';

import './index.scss';

const ROOT = `ts_psa__commons-error-message-box`;

type Props = {
  errorLabelObject: any;
  errors: any;
};

const ErrorBox = (props: Props) => {
  const [dropDown, setDropDown] = useState(false);
  const { errors, errorLabelObject } = props;

  const triggerDropDown = () => {
    setDropDown((dropDown) => !dropDown);
  };

  const renderErrorMessages = () => {
    return Object.keys(errors).map((error, index) => {
      if (index > 4 && !dropDown) {
        return null;
      } else {
        const errorMessageKey = errors[error];
        return (
          <div className={`${ROOT}__error-text-container`}>
            <div className={`${ROOT}__error-bullet`}></div>
            <div>
              {errorLabelObject[error] &&
                `${errorLabelObject[error]}: ${msg()[errorMessageKey]}`}
            </div>
          </div>
        );
      }
    });
  };

  const renderDropDownButton = () => {
    if (Object.keys(errors).length > 5) {
      return dropDown ? (
        <Button
          className={`${ROOT}__err-btn`}
          type="destructive"
          onClick={() => triggerDropDown()}
        >
          {msg().Psa_Btn_Hide}
        </Button>
      ) : (
        <Button
          className={`${ROOT}__err-btn`}
          type="destructive"
          onClick={() => triggerDropDown()}
        >
          {msg().Psa_Btn_ShowMore}
        </Button>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__header`}>
        <div className={`${ROOT}__exclamation-icon`}>
          <Exclamation />
        </div>
        <div className={`${ROOT}__header-text`}>
          {msg().PSA_Lbl_ErrorBoxHeader}
        </div>
      </div>
      <div className={`${ROOT}__errors-list`}>{renderErrorMessages()}</div>
      {renderDropDownButton()}
    </div>
  );
};

export default ErrorBox;
