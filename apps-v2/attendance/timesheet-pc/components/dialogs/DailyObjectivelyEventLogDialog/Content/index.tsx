import * as React from 'react';

import styled from 'styled-components';

import IconButton from '@apps/commons/components/buttons/IconButton';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import TimeUtil from '@apps/commons/utils/TimeUtil';
import CheckBox from '@apps/core/elements/CheckBox';

import { ObjectivelyEventLog } from '@attendance/domain/models/ObjectivelyEventLog';
import { ObjectivelyEventLogSetting } from '@attendance/domain/models/ObjectivelyEventLogSetting';

import ImgBtnMinusField from '../../../../images/btnMinusField.png';
import Footer from './Footer';
import Header from './Header';
import {
  EventTypeCell,
  LinkedTimeCell,
  RemoveCell,
  Row,
  SourceCell,
  StampTimeCell,
  SyncCell,
} from './Table';
import objectivelyEventLogEventType, {
  EventType as ObjectivelyEventLogEventType,
} from '@attendance/ui/helpers/objectivelyEventLog/eventType';

const RecordContainer = styled.div<{
  allowedEditLogs: boolean;
}>`
  max-height: calc(80vh - 60px - 60px - 32px - 20px);
  min-height: 350px;
  overflow-y: auto;
`;

const SyncCheckBoxContainer = styled.div`
  display: inline-block;
`;

// FIXME: https://github.com/microsoft/TypeScript/issues/37597
// @ts-ignore
const ContentItemContainer = styled(Row)`
  height: 47px;
  margin: 0px 10px;
  border-bottom: 1px solid #d8dde6;
  :last-child {
    margin-bottom: 47px;
  }
`;

const ContentItem: React.FC<{
  'data-testid'?: string;
  readOnly: boolean;
  loading: boolean;
  allowedEditLogs: boolean;
  allowedSetToApplied: boolean;
  record: ObjectivelyEventLog;
  onCheck: () => void;
  onClickRemove: () => void;
}> = ({
  'data-testid': testid,
  loading,
  readOnly,
  allowedEditLogs,
  record,
  allowedSetToApplied,
  onCheck: $onCheck,
  onClickRemove,
}) => {
  const onCheck = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        $onCheck();
      }
    },
    [$onCheck]
  );

  return (
    <ContentItemContainer>
      <SourceCell
        data-testid={testid ? `${testid}-source` : ''}
        title={record.setting.name}
      >
        {record.setting.name}
      </SourceCell>
      <EventTypeCell data-testid={testid ? `${testid}-event-type` : ''}>
        {objectivelyEventLogEventType(record.eventType)}
      </EventTypeCell>
      <StampTimeCell data-testid={testid ? `${testid}-stamp-time` : ''}>
        {TimeUtil.toHHmm(record.time)}
      </StampTimeCell>
      <SyncCell data-testid={testid ? `${testid}-sync-cell` : ''}>
        <SyncCheckBoxContainer>
          <CheckBox
            data-testid={testid ? `${testid}-sync-cell-checkbox` : ''}
            onChange={onCheck}
            checked={record.isApplied}
            readOnly={readOnly || !allowedSetToApplied}
            disabled={loading}
          />
        </SyncCheckBoxContainer>
      </SyncCell>
      <LinkedTimeCell data-testid={testid ? `${testid}-linked-time` : ''}>
        {DateUtil.formatYMDhhmm(record.linked)}
      </LinkedTimeCell>
      {allowedEditLogs && !readOnly ? (
        <RemoveCell data-testid={testid ? `${testid}-remove-cell` : ''}>
          <IconButton
            data-testid={testid ? `${testid}-remove-cell-icon-button` : ''}
            src={ImgBtnMinusField}
            alt={msg().Att_Btn_RemoveItem}
            onClick={onClickRemove}
            key="icon-remove"
          />
        </RemoveCell>
      ) : null}
    </ContentItemContainer>
  );
};

ContentItem.defaultProps = {
  'data-testid': '',
};

const Content: React.FC<{
  'data-testid'?: string;
  readOnly: boolean;
  loading: boolean;
  sources: ObjectivelyEventLogSetting[];
  records: ObjectivelyEventLog[];
  allowedEditLogs: boolean;
  allowedSetToApplied: boolean;
  onCheckRecord: (id: string) => void;
  onClickAdd: (params: {
    settingCode: string;
    eventType: ObjectivelyEventLogEventType;
    time: number;
  }) => void;
  onClickRemove: (id: string) => void;
}> = (props) => {
  const {
    'data-testid': testid,
    records,
    sources,
    allowedSetToApplied,
    onCheckRecord,
    onClickAdd,
    onClickRemove,
    ...options
  } = props;

  return (
    <>
      <Header data-testid={testid ? `${testid}-header` : ''} {...options} />
      <RecordContainer allowedEditLogs={options.allowedEditLogs}>
        {records.map((record, idx) => (
          <ContentItem
            data-testid={
              testid
                ? `${testid}-content-item__${record.id ? record.id : idx}`
                : ''
            }
            key={record.id}
            record={record}
            allowedSetToApplied={allowedSetToApplied}
            onCheck={() => onCheckRecord(record.id)}
            onClickRemove={() => onClickRemove(record.id)}
            {...options}
          />
        ))}
        {options.allowedEditLogs && !options.readOnly ? (
          <Footer
            data-testid={testid ? `${testid}-footer` : ''}
            submit={onClickAdd}
            sources={sources}
            {...options}
          />
        ) : null}
      </RecordContainer>
    </>
  );
};

Content.defaultProps = {
  'data-testid': '',
};

export default Content;
