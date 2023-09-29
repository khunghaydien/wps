import * as React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import Button from '@apps/core/elements/Button';

import {
  Dialog,
  DialogFooter as DialogFooterContainer,
  DialogHeader,
  Screen,
} from '../Dialog';
import preventDoubleFiring from '@attendance/ui/helpers/events/preventDoubleFiring';

export const WITH_REST_REASON_WIDTH = 900;
export const WITH_REQUEST_WIDTH = 720;
export const DEFAULT_WIDTH = 520;

const Wrapper = styled.div<{
  enableRequest: boolean;
  enabledRestReason: boolean;
}>`
  position: relative;
  width: ${({ enableRequest, enabledRestReason }) =>
    enabledRestReason
      ? WITH_REST_REASON_WIDTH
      : enableRequest
      ? WITH_REQUEST_WIDTH
      : DEFAULT_WIDTH}px;
  margin: auto;
  max-height: 80vh;
`;

const DialogContentWrapper = styled.div<{ enableRequest: boolean }>`
  // ヘッダー・フッター・閉じるボタンを引いた高さ
  max-height: calc(
    80vh - 60px - 60px - 32px
      ${(props) => (props.enableRequest ? '- 60px' : '')}
  );
  overflow-y: auto;
  padding: 5px 10px 18px;
`;

const DialogFooter: React.FC<{
  readOnly: boolean;
  loading: boolean;
  onSubmit: (e: unknown) => void;
  onCancel: () => void;
}> = ({ readOnly, loading, onSubmit, onCancel }) => {
  if (readOnly) {
    return (
      <DialogFooterContainer>
        <Button color="default" onClick={onCancel} key="button-cancel">
          {msg().Com_Btn_Close}
        </Button>
      </DialogFooterContainer>
    );
  } else {
    return (
      <DialogFooterContainer>
        {' '}
        <Button
          color="default"
          type="button"
          onClick={onCancel}
          key="button-cancel"
        >
          {' '}
          {msg().Com_Btn_Cancel}
        </Button>
        <Button
          color="primary"
          type="submit"
          onClick={onSubmit}
          disabled={loading}
          key="button-execute"
        >
          {msg().Com_Btn_Save}
        </Button>
      </DialogFooterContainer>
    );
  }
};

const DailyAttTimeDialog: React.FC<{
  isLoading: boolean;
  isReadOnly: boolean;
  enabledFixDailyRequest: boolean;
  enabledRestReason: boolean;
  targetDate: string;
  onSave: () => void;
  onCancel: () => void;
  Header: React.FC;
  Content: React.FC;
}> = ({
  isReadOnly,
  isLoading,
  enabledFixDailyRequest: enableRequest,
  enabledRestReason,
  targetDate,
  onSave: $onSave,
  onCancel,
  Header: DialogContentHeader,
  Content: DialogContent,
}) => {
  const $$onSave = React.useMemo(() => preventDoubleFiring($onSave), [$onSave]);
  const onSave = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      $$onSave();
    },
    [$$onSave]
  );

  return (
    <Screen>
      <Wrapper
        enableRequest={enableRequest}
        enabledRestReason={enabledRestReason}
      >
        <form onSubmit={onSave} action="/#">
          <Dialog
            isModal={true}
            onClose={onCancel}
            header={
              <DialogHeader
                title={msg().Att_Lbl_WorkTimeInput}
                targetDate={targetDate}
              />
            }
            content={
              <>
                {enableRequest ? <DialogContentHeader /> : null}
                <DialogContentWrapper enableRequest={enableRequest}>
                  <DialogContent />
                </DialogContentWrapper>
              </>
            }
            footer={
              <DialogFooter
                loading={isLoading}
                readOnly={isReadOnly}
                onSubmit={onSave}
                onCancel={onCancel}
              />
            }
          />
        </form>
      </Wrapper>
    </Screen>
  );
};

export default DailyAttTimeDialog;
