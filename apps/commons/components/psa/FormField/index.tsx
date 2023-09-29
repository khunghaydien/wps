import React from 'react';

import TextUtil from '../../../utils/TextUtil';

import InfoIcon from '../../../images/icons/info.svg';
import msg from '../../../languages';
import Tooltip from '../../Tooltip';

import './index.scss';

const ROOT = 'ts-psa__form-field';

type Props = {
  children: React.ReactNode;
  className?: string;
  error?: string;
  isRequired?: boolean;
  isTouched?: boolean;
  testId?: string;
  title: string;
  tooltip?: string;
  tooltipPosition?: string;
};

const PSAFormField = (props: Props) => {
  const {
    className = '',
    isRequired = false,
    title,
    children,
    error,
    isTouched,
    tooltip,
    tooltipPosition,
  } = props;

  const hasErrors = error && isTouched;
  const hasErrorClass = hasErrors ? 'has-error' : '';

  return (
    <div
      className={`${ROOT} ${className} ${hasErrorClass}`}
      data-testid={props.testId}
    >
      <div className={`${ROOT}__label`}>
        {isRequired && <span className="is-required">*</span>} {title}
        {tooltip && (
          <Tooltip
            id={`${ROOT}__tooltip`}
            align={tooltipPosition || 'top'}
            content={tooltip}
          >
            <InfoIcon />
          </Tooltip>
        )}
      </div>
      {children}
      {error && isTouched && (
        <p className={`${ROOT}__error`}>{TextUtil.nl2br(msg()[error])}</p>
      )}
    </div>
  );
};

export default PSAFormField;
