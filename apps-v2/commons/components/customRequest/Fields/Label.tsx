import React from 'react';

import styled from 'styled-components';

import InfoIcon from '../../../../commons/images/icons/info.svg';
import Tooltip from '@apps/commons/components/Tooltip';

type Props = {
  text: string;
  required?: boolean;
  helpMsg?: string;
  alignTooltip?: string;
};

const StyledLabel = styled.div`
  margin-top: 4px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .is-required {
    margin-right: 4px;
    color: #c23934;
  }
  .label__icon-help {
    width: 19px;
    height: 19px;
    margin-left: 7px;
    background-size: 19px;
  }
`;

const Component = (props: Props) => {
  const renderRequired = () => {
    if (props.required) {
      return <span className="is-required">*</span>;
    }
    return null;
  };

  const renderHelp = () => {
    if (props.helpMsg) {
      return (
        <Tooltip
          align={props.alignTooltip || 'top left'}
          content={props.helpMsg}
          className="label__icon-help"
        >
          <InfoIcon />
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <StyledLabel>
      {renderRequired()}
      {props.text}
      {renderHelp()}
    </StyledLabel>
  );
};

export default Component;
