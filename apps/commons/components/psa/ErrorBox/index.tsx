import React from 'react';

import msg from '@apps/commons/languages';

import Exclamation from '@apps/psa-pc/images/icons/exclamation.svg';

import './index.scss';

const ROOT = `ts_psa__commons-error-message-box`;

type Props = {
  errorLabelObject: any;
  errors: any;
};

const ErrorBox = (props: Props) => {
  const { errors, errorLabelObject } = props;
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
      <div className={`${ROOT}__errors-list`}>
        {Object.keys(errors).map((error) => {
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
        })}
      </div>
    </div>
  );
};

export default ErrorBox;
