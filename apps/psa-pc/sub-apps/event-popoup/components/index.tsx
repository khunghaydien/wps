import * as React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import { PopupFrame, Text, TextField } from '@apps/core';

import { PsaEvent } from '@apps/domain/models/psa/PsaEvent';

import { PsaEventPopupCondtions } from '@psa/sub-apps/event-popoup/modules/ui/conditions';

import Popup from '@apps/planner-pc/components/Popup';

import Footer from './Footer';
import Header from './Header';

type Props = {
  readonly psaEvent: PsaEvent;
  readonly conditions: PsaEventPopupCondtions;
  readonly onClickClose: () => void;
  readonly onClickViewScheduledDetails: () => void;
};

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const DateContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 350px;
`;

const S = {
  Container: styled.div`
    width: 526px;
  `,
  Body: styled.div`
    min-height: 146px;
    padding: 0 20px;
  `,
  // @ts-ignore
  AlignStart: styled(Flex)`
    align-items: center;
  `,
  TextField: styled(TextField)`
    width: 350px;
  `,
  TextFieldForDate: styled(TextField)`
    width: 160px;
  `,
  Separater: styled.span`
    width: 30px;
    text-align: center;
  `,
};

const Overlay = styled.div`
  position: fixed;
  z-index: 500000;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0);
`;

const StyledPopup = styled(Popup)`
  z-index: 500002;
`;

const ROOT = 'psa-event-edit-popup';

// format booked effort.
const formartBookedEffort = (bookedEffort: number) => {
  const h = Math.floor(bookedEffort / 60);
  const m = bookedEffort % 60;
  let ret = '';
  if (h > 0) {
    ret = `${h} ${msg().Psa_Lbl_Hours}`;
  }
  if (m > 0) {
    ret = `${ret}${ret ? ' ' : ''}${m} ${msg().Psa_Lbl_Minutes}`;
  }
  return ret;
};

// main
const PsaEventPopup: React.ComponentType<Props> = React.memo(
  ({
    psaEvent,
    conditions,
    onClickClose,
    onClickViewScheduledDetails,
  }: Props) => {
    if (!psaEvent || !conditions.isOpen) {
      return null;
    }
    return (
      <>
        <Overlay data-testid={`${ROOT}__overlay`} onClick={onClickClose} />
        <StyledPopup
          isOpen={conditions.isOpen}
          top={`${conditions.top}px`}
          left={`${conditions.left}px`}
        >
          <S.Container>
            <PopupFrame
              onClose={onClickClose}
              header={<Header projectName={psaEvent.projectName} />}
              footer={
                <Footer
                  onClickViewScheduledDetails={onClickViewScheduledDetails}
                />
              }
            >
              <S.Body>
                <S.AlignStart>
                  <Text>{msg().Psa_Lbl_BookedRoleDuration}</Text>
                  <DateContainer>
                    <S.TextFieldForDate
                      data-testid={`${ROOT}__start-date`}
                      value={DateUtil.formatYMD(psaEvent.startDate)}
                      readOnly
                    />
                    <S.Separater>-</S.Separater>
                    <S.TextFieldForDate
                      data-testid={`${ROOT}__end-date`}
                      value={DateUtil.formatYMD(psaEvent.endDate)}
                      readOnly
                    />
                  </DateContainer>
                </S.AlignStart>
                <S.AlignStart>
                  <Text>{msg().Psa_Lbl_TotalAssignedEffort}</Text>
                  <S.TextField
                    data-testid={`${ROOT}__booked-effort`}
                    value={formartBookedEffort(psaEvent.bookedEffort)}
                    readOnly
                  />
                </S.AlignStart>
                <S.AlignStart>
                  <Text>{msg().Psa_Lbl_ProjectRoleTitle}</Text>
                  <S.TextField
                    data-testid={`${ROOT}__role-title`}
                    value={psaEvent.roleTitle}
                    readOnly
                  />
                </S.AlignStart>
                <S.AlignStart>
                  <Text>{msg().Psa_Lbl_WorkTimePerDay}</Text>
                  <S.TextField
                    data-testid={`${ROOT}__scheduled-time-per-day`}
                    value={`${psaEvent.scheduledTimePerDay / 60} ${
                      msg().Psa_Lbl_HoursPerDayWide
                    }`}
                    readOnly
                  />
                </S.AlignStart>
                <S.AlignStart>
                  <Text>{msg().Psa_Lbl_ProjectManager}</Text>
                  <S.TextField
                    data-testid={`${ROOT}__project-manager`}
                    value={psaEvent.projectManagerName}
                    readOnly
                  />
                </S.AlignStart>
              </S.Body>
            </PopupFrame>
          </S.Container>
        </StyledPopup>
      </>
    );
  }
);

export default PsaEventPopup;
