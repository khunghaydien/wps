import React from 'react';

import classNames from 'classnames';

import ImgIconAttention from '@commons/images/icons/attention.svg';
import CheckActive from '@commons/images/icons/check-active.svg';

import './OCRMessage.scss';

const ROOT = 'mobile-app-pages-approval-page-expense-record-ocr-message';

type Props = {
  check?: boolean;
  message?: string;
};
const OCRMessage = (props: Props) => {
  const { check = false, message = '' } = props;
  const Icon = check ? CheckActive : ImgIconAttention;
  return (
    <div className={classNames(ROOT, check && ROOT + '__ok')}>
      <Icon
        className={classNames(
          ROOT + '__appear',
          check && ROOT + '__appear__ok'
        )}
      />
      <div className={`${ROOT}__message`}>{message}</div>
    </div>
  );
};

export default OCRMessage;
