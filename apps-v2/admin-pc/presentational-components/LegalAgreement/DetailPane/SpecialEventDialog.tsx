import React, { useEffect } from 'react';

import styled from 'styled-components';

import configList from '../../../constants/configList/legalAgreementSpecialRecord';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import msg from '@apps/commons/languages';

import { SpecialEvent } from '../../../models/legal-agreement/LegalAgreementEvent';

const OvertimeWorkList = React.lazy(() => import('./OvertimeWork'));

export type Props = {
  isShow: boolean;
  isLoading: boolean;
  event: SpecialEvent;
  detailEvent: SpecialEvent;
  workSystem: string;
  setEvent: (event: SpecialEvent) => void;
  onClickEditButton: (key: string, value: number) => void;
  onCancel: (flag: boolean) => void;
  onSubmit: (event: SpecialEvent) => void;
  setLoading: (flag: boolean) => void;
};

const Dialog = styled(DialogFrame)`
  width: 550px;
`;

const DialogBody = styled.div`
  padding: 20px 10px;
`;

const DialogItemList = styled.ul`
  &textarea: max-width: 100%;
`;

const TitleDiv = styled.div`
  max-width: 500px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SpecialEventDialog: React.FC<Props> = ({
  isShow,
  isLoading,
  event,
  detailEvent,
  workSystem,
  setEvent,
  onClickEditButton,
  onCancel,
  onSubmit,
  setLoading,
}) => {
  useEffect(() => {
    if (isShow) {
      setEvent(detailEvent);
      setLoading(true);
    }
  }, [detailEvent, isShow]);

  const $onSubmit = () => {
    onSubmit(event);
    onCancel(false);
  };

  const renderFooter = () => {
    return (
      <DialogFrame.Footer>
        <Button key="cancel" onClick={(_e) => onCancel(false)}>
          {msg().Com_Btn_Cancel}
        </Button>
        <Button key="submit" type="primary" onClick={$onSubmit}>
          {msg().Com_Btn_Save}
        </Button>
      </DialogFrame.Footer>
    );
  };

  const renderTitle = () => {
    if (workSystem === 'Manager') {
      return msg().Admin_Lbl_OvertimeWorkInExcessOfLimitManager;
    } else {
      return (
        <TitleDiv title={msg().Admin_Lbl_OvertimeWorkInExcessOfLimit}>
          {msg().Admin_Lbl_OvertimeWorkInExcessOfLimit}
        </TitleDiv>
      );
    }
  };

  if (!isShow) {
    return null;
  }

  return (
    <Dialog
      title={renderTitle()}
      footer={renderFooter()}
      hide={() => onCancel(false)}
    >
      <DialogBody>
        <DialogItemList>
          <React.Suspense fallback={<div>{msg().Com_Lbl_Loading}</div>}>
            {isLoading &&
              configList.base.map((config) =>
                config.key ? (
                  <OvertimeWorkList
                    key={config.key}
                    config={config}
                    tmpEditRecord={event}
                    onChangeDetailItem={onClickEditButton}
                    workSystem={workSystem}
                  />
                ) : null
              )}
          </React.Suspense>
        </DialogItemList>
      </DialogBody>
    </Dialog>
  );
};

export default SpecialEventDialog;
