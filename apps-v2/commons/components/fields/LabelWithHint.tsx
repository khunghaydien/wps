import React from 'react';

import InfoIcon from '../../images/icons/info.svg';
import Tooltip from '../Tooltip';

import './LabelWithHint.scss';

/**
 * LabelWithHint
 * This component is used to display field labels with hint
 */
type Props = {
  text: string;
  className?: string;
  infoAlign?: 'left' | 'right';
  isRequired?: boolean;
  hintMsg?: string;
  hintAlign?: string;
};

const ROOT = 'ts-label-with-hint';

const LabelWithHint = (props: Props) => {
  const {
    text,
    hintMsg,
    hintAlign,
    isRequired,
    className = '',
    infoAlign,
  } = props;
  const isInfoLeftAligned = infoAlign === 'left';

  const infoArea = hintMsg && (
    <Tooltip
      id={ROOT}
      align={hintAlign}
      content={<div className={`${ROOT}__hintMsg`}>{hintMsg}</div>}
      hasStaticAlignment={false}
    >
      <InfoIcon className={`${ROOT}__info`} />
    </Tooltip>
  );

  const textClass = isInfoLeftAligned
    ? `${ROOT}__left-info`
    : `${ROOT}__right-info`;

  const textArea = (
    <p className={`key ${textClass}`}>
      {isRequired && <span className="is-required">*&nbsp;</span>}
      {text}
    </p>
  );

  const renderLabelWithHint = isInfoLeftAligned ? (
    <>
      {infoArea} {textArea}
    </>
  ) : (
    <>
      {textArea} {infoArea}
    </>
  );

  return <div className={`${ROOT} ${className}`}>{renderLabelWithHint}</div>;
};

LabelWithHint.defaultProps = {
  hintMsg: '',
  hintAlign: 'top left',
  isRequired: false,
  className: '',
  infoAlign: 'right',
};

export default LabelWithHint;
