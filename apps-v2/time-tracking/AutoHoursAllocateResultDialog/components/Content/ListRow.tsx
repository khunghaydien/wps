import React, { useCallback, useMemo } from 'react';

import styled from 'styled-components';

import Tooltip from '@apps/commons/components/Tooltip';
import msg from '@apps/commons/languages';
import TimeUtil from '@apps/commons/utils/TimeUtil';
import { Option, Text, TimePicker } from '@apps/core';

import defaultPermission from '@apps/domain/models/access-control/Permission';
import {
  AutoHoursAllocationResult,
  MATCHING_TYPE,
  MatchingType,
} from '@apps/domain/models/time-tracking/AutoHoursAllocationResult';
import { Job, JobPickList } from '@apps/domain/models/time-tracking/Job';

import WorkCategoryDropdown from '@apps/time-tracking/common/components/WorkCategoryDropdown';

import Cell from './Cell';
import { OpenAutoHoursAllocateDictDialogButton } from '@apps/time-tracking/AutoHoursAllocateDictDialog';
import JobSelect from '@apps/time-tracking/common/JobSelect';
import { useJobSelectDialog } from '@apps/time-tracking/JobSelectDialog';

const TableRow = styled.div`
  display: flex;
  text-align: left;
  height: 46px;
  line-height: 46px;
  overflow: hidden;
  background-color: #fff;

  :hover {
    background-color: #f9f9f9;
  }
`;

const EventTooltip = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 280px;
`;

const EventText = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TEXT_COLOR: { [key in MatchingType]: string } = {
  [MATCHING_TYPE.MATCHED]: '#04844B',
  [MATCHING_TYPE.UNMATCHED]: '#54698D',
};

const MatchField = styled(Text)<{ matchingType }>`
  color: ${({ matchingType }) => TEXT_COLOR[matchingType] || '#FF8A00'};
`;

type Props = {
  empId: string | undefined;
  rowData: AutoHoursAllocationResult;
  jobList: JobPickList;
  targetDate: string;
  toggleCheckbox: (id: string, checkboxFlg: boolean) => void;
  selectJob: (id: string, job: AutoHoursAllocationResult['job']) => void;
  selectWork: (
    id: string,
    work: AutoHoursAllocationResult['workCategory']
  ) => void;
  selectTaskTime: (id: string, taskTime: number) => void;
  onOkForJobSelectDialog: (id: string, job: Job) => void;
  onErrorForJobSelectDialog: (error: Error) => void;
};

const ListRow: React.FC<Props> = ({
  empId,
  rowData,
  jobList,
  targetDate,
  toggleCheckbox,
  selectJob,
  selectWork,
  selectTaskTime,
  onOkForJobSelectDialog,
  onErrorForJobSelectDialog,
}) => {
  const jobPickList = jobList.allIds.map((id) => jobList.byId[id]);

  const hasWorkCategory = useMemo(() => {
    return rowData.job?.hasJobType || !!rowData.workCategory?.id;
  }, [rowData.job, rowData.workCategory]);

  const [onClickOpenJobSelectDialog] = useJobSelectDialog<Job>({
    targetDate,
    onOk: (job) => onOkForJobSelectDialog(rowData.eventId, job),
    onError: onErrorForJobSelectDialog,
    empId: empId,
  });

  const onSelectJob = useCallback(
    (option: Option) => {
      if (option.value) {
        const { jobId, jobCode, jobName, hasJobType } =
          jobList.byId[option.value];
        selectJob(rowData.eventId, {
          id: jobId,
          code: jobCode,
          name: jobName,
          hasJobType,
        });
      } else {
        selectJob(rowData.eventId, null);
      }
    },
    [jobPickList]
  );

  return (
    <TableRow>
      <Cell left={0} width={50} isHeader={false} cellNumber={1}>
        <input
          type="checkbox"
          onChange={() => {
            toggleCheckbox(rowData.eventId, rowData.import);
          }}
          checked={rowData.import}
          readOnly
        />
      </Cell>
      <Cell left={50} width={90}>
        {rowData.isModified ? (
          <MatchField>{msg().Time_Lbl_Result_Modified}</MatchField>
        ) : rowData.allocateResult === MATCHING_TYPE.MATCHED ? (
          <MatchField matchingType={MATCHING_TYPE.MATCHED}>
            {msg().Time_Lbl_Result_Matched}
          </MatchField>
        ) : rowData.allocateResult === MATCHING_TYPE.UNMATCHED ? (
          <MatchField matchingType={MATCHING_TYPE.UNMATCHED}>
            {msg().Time_Lbl_Result_Unmatched}
          </MatchField>
        ) : null}
      </Cell>
      <Cell left={140} width={150} cellNumber={3}>
        <Tooltip
          id={`tooltip_${rowData.eventId}`}
          content={<EventTooltip>{rowData.eventTitle}</EventTooltip>}
        >
          <EventText>{rowData.eventTitle}</EventText>
        </Tooltip>
      </Cell>
      <Cell left={290} width={110}>
        {`${rowData.startTime} ~ ${rowData.endTime}`}
      </Cell>
      <Cell left={400} width={360}>
        <JobSelect
          data-testid="timeTrack__job-select"
          useTwoLinesFormat
          value={{ id: rowData.job?.id }}
          options={jobPickList}
          onSelect={onSelectJob}
          onClickSearch={onClickOpenJobSelectDialog}
        />
      </Cell>
      <Cell left={760} width={190} cellNumber={8}>
        {hasWorkCategory && (
          <WorkCategoryDropdown
            jobId={rowData.job?.id}
            targetDate={targetDate}
            onSelect={({ id, code, name }) =>
              selectWork(rowData.eventId, {
                id,
                code,
                name,
              })
            }
            onError={() => {}}
            selected={{
              workCategoryId: rowData.workCategory?.id || null,
              workCategoryCode: rowData.workCategory?.code || null,
              workCategoryName: rowData.workCategory?.name || null,
            }}
          />
        )}
      </Cell>
      <Cell left={950} width={100}>
        <TimePicker
          // key="time-picker"
          // ref={ref}
          // readOnly={props.readOnly || task.isEditLocked}
          minMinutes={30}
          maxMinutes={1441}
          maxValidMinutes={1441}
          placeholder="0"
          value={TimeUtil.toHHmm(rowData.taskTime)}
          // onKeyDown={props.onKeyDown}
          onSelect={(_value, minutes) => {
            selectTaskTime(rowData.eventId, minutes);
          }}
        />
      </Cell>
      <Cell left={1050} width={150}>
        {rowData.differFromDictionary ? (
          <OpenAutoHoursAllocateDictDialogButton
            appearance="link"
            color="primary"
            targetDate={targetDate}
            userPermission={defaultPermission}
            empId={empId}
            resultItem={rowData}
          />
        ) : (
          '-'
        )}
      </Cell>
    </TableRow>
  );
};

export default ListRow;
