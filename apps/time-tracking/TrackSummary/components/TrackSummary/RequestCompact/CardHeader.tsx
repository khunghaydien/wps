import React from 'react';

import styled from 'styled-components';

import msg from '../../../../../commons/languages';
import { LinkButton } from '../../../../../core';

import Period from '../../../containers/TrackSummary/PeriodContainer';
import UnsubmittedAlert from '../../../containers/TrackSummary/RequestCompact/UnsubmittedAlertContainer';
import WorkHours from '../../../containers/TrackSummary/RequestCompact/WorkHoursContainer';
import StatusLabel from '../../../containers/TrackSummary/StatusLabelContainer';

import { Header, HeaderGroup, HeaderItem } from '../Layout';

type Props = {
  /**
   * Toggle open/closed state of card
   */
  onToggle: () => void;
  /**
   * Indicates open/closed state of card
   */
  isOpen: boolean;
  /**
   * Indicates request feature is enabled or not.
   */
  useRequest: boolean;
};

const Title = styled.h2`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  text-transform: capitalize;
`;

const StyledHeader = styled(Header)`
  height: 56px;
`;

const CardHeader = ({ onToggle, isOpen, useRequest }: Props) => {
  return (
    <StyledHeader>
      <Title>{msg().Time_Lbl_TrackSummaryTitle}</Title>
      <HeaderGroup>
        <HeaderItem>{useRequest && <StatusLabel />}</HeaderItem>
        <HeaderItem>
          <Period />
        </HeaderItem>
        <HeaderItem>
          <UnsubmittedAlert />
        </HeaderItem>
      </HeaderGroup>
      <HeaderGroup right>
        <HeaderItem>
          <WorkHours />
        </HeaderItem>
        <HeaderItem right>
          <LinkButton onClick={onToggle} size="large">
            {isOpen ? msg().Com_Btn_Close : msg().Com_Btn_Open}
          </LinkButton>
        </HeaderItem>
      </HeaderGroup>
    </StyledHeader>
  );
};

export default CardHeader;
