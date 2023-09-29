import React from 'react';

import TextUtil from '../../../utils/TextUtil';

import './index.scss';

const ROOT = 'ts-psa__empty-screen';

type Props = {
  bodyMessage?: string;
  headerMessage: string;
  showEmptyScreen: boolean;
};

const EmptyScreenPlaceholder = (props: Props) => {
  const emptyScreen = props.showEmptyScreen && (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__header`}>
        {props.headerMessage ? TextUtil.nl2br(props.headerMessage) : ''}
      </div>
      <div className={`${ROOT}__body`}>
        {props.bodyMessage ? TextUtil.nl2br(props.bodyMessage) : ''}
      </div>
    </div>
  );

  return emptyScreen;
};

export default EmptyScreenPlaceholder;
