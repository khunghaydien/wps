import React, { memo } from 'react';

import ImgIconAttention from '@commons/images/icons/attention.svg';
import msg from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';

type Props = {
  labelKey: string;
  wholeMsg?: string | React.ReactNode;
};

const PARENT_CLASS = 'ts-expenses-modal-ocr-receipt-detail';

const Warning = ({ labelKey, wholeMsg }: Props) => {
  return (
    <div className={`${PARENT_CLASS}__feedback`}>
      <ImgIconAttention className={`${PARENT_CLASS}__feedback-svg`} />
      <span className={`${PARENT_CLASS}__feedback-msg`}>
        {wholeMsg ||
          TextUtil.template(msg().Exp_Msg_ManuallyEntered, msg()[labelKey])}
      </span>
    </div>
  );
};

export default memo(Warning);
