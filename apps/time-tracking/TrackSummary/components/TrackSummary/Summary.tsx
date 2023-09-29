import * as React from 'react';

import range from 'lodash/range';
import numeral from 'numeral';

import styled from 'styled-components';

import msg from '../../../../commons/languages';
import variables from '../../../../commons/styles/wsp.scss';
import TimeUtil from '../../../../commons/utils/TimeUtil';
import Tooltip from '@apps/commons/components/Tooltip';
import { IconButton, Icons } from '@apps/core';

import { Status } from '@apps/domain/models/approval/request/Status';
import { canTransfer } from '@apps/domain/models/time-tracking/TimeTrackingCharge';

import Pie from '../atoms/graphs/Pie';
import DataTable from '../molecules/DataTable';
import { Data, Datum, Task } from '../TrackSummary/Props';
import WorkHours from './WorkHours';

type Row = Datum & {
  color: string | null | undefined;
  status?: Status;
  onSelect?: (e: React.SyntheticEvent, task: Task) => void;
};

type ColumnDef = {
  [header: string]: React.ComponentType<Row>;
};

type Props = Readonly<{ data: Data; column: () => ColumnDef }>;

const S = {
  PreLine: styled.span`
    white-space: pre-line;
    word-break: break-all;
  `,

  Text: styled.span`
    display: inline-block;
  `,

  Center: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  LockedIcon: styled(Icons.Locked)`
    fill: #828282;
    width: 28px; // IconButtonと同じ大きさにするため
    height: 28px;
    padding: 8px; // アイコン本体を鉛筆と同じ12pxにするため(width - padding*2 = 12px)
  `,

  TooltipContent: styled.div`
    width: 190px;
  `,
};

const JobAndWorkCategory = ({ jobName, workCategoryName }) => (
  <>
    <S.PreLine>
      <S.Text>{jobName}</S.Text>
      {workCategoryName && <S.Text> /{workCategoryName}</S.Text>}
    </S.PreLine>
  </>
);

const WorkingPercentage = (({ workTimeRatio }: Row) => (
  <>{`${numeral(workTimeRatio).format('0.0')}%`}</>
)) as React.ComponentType<Row>;

const WorkingHours = (({ workTime }: Row) => (
  <>{TimeUtil.toHHmm(workTime)}</>
)) as React.ComponentType<Row>;

const LockedIcon = ({ jobId, workCategoryId }) => (
  <Tooltip
    id={`${jobId}-${workCategoryId}`}
    align="top right"
    content={
      <S.TooltipContent>{msg().Time_Lbl_LockedJobToolTip}</S.TooltipContent>
    }
  >
    <S.LockedIcon />
  </Tooltip>
);

const Edit: React.FC<Row> = (props: Row) => {
  const { status, onSelect } = props;
  const handleSelect = React.useCallback(
    (e: React.SyntheticEvent) => {
      onSelect(e, {
        jobId: props.jobId,
        jobCode: props.jobCode,
        jobName: props.jobName,
        workCategoryId: props.workCategoryId,
        workCategoryCode: props.workCategoryCode,
        workCategoryName: props.workCategoryName,
        isEditLocked: props.isEditLocked,
      });
    },
    [
      onSelect,
      props.jobCode,
      props.jobId,
      props.jobName,
      props.workCategoryCode,
      props.workCategoryId,
      props.workCategoryName,
      props.isEditLocked,
    ]
  );
  return (
    <S.Center>
      {props.isEditLocked ? (
        <LockedIcon {...props} />
      ) : (
        <IconButton
          color="#2782ED"
          icon={Icons.Edit}
          disabled={!canTransfer(status)}
          onClick={handleSelect}
        />
      )}
    </S.Center>
  );
};

export const Column: {
  Request: () => ColumnDef;
  Approval: () => ColumnDef;
  Transfer: () => ColumnDef;
} = {
  Request: () => ({
    [msg().Time_Lbl_JobName]: JobAndWorkCategory,
    [msg().Time_Lbl_WorkingPercentage]: WorkingPercentage,
    [msg().Time_Lbl_WorkingHours]: WorkingHours,
  }),
  Approval: () => ({
    [msg().Time_Lbl_JobName]: JobAndWorkCategory,
    [msg().Time_Lbl_WorkingHours]: WorkingHours,
  }),
  Transfer: () => ({
    [msg().Trac_Lbl_JobCode]: ({ jobCode }) => <S.Text>{jobCode}</S.Text>,
    [msg().Trac_Lbl_JobName]: ({ jobName }) => <S.Text>{jobName}</S.Text>,
    [msg().Trac_Lbl_WorkCategoryCode]: ({ workCategoryCode }) => (
      <S.Text>{workCategoryCode}</S.Text>
    ),
    [msg().Trac_Lbl_WorkCategoryName]: ({ workCategoryName }) => (
      <S.Text>{workCategoryName}</S.Text>
    ),
    [msg().Time_Lbl_WorkingPercentage]: WorkingPercentage,
    [msg().Time_Lbl_WorkingHours]: WorkingHours,
    [msg().Com_Btn_Edit]: Edit,
  }),
};

const ChartBlock = styled.div`
  width: 140px;
  height: 140px;
  margin: 0 20px 0 0;
`;

const DataBlock = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  min-height: 140px;
`;

const colors = range(1, 13).map((i) => variables[`graph-color-${i}`]);

export default ({ data, column }: Props) => (
  <>
    <ChartBlock>
      <Pie
        data={data.map(
          ({ jobName, workCategoryName, workTimeRatio }, index) => ({
            id: `${index}`,
            value: workTimeRatio,
            label: workCategoryName
              ? `${jobName}/${workCategoryName}`
              : jobName,
          })
        )}
      />
    </ChartBlock>
    <DataBlock>
      <DataTable data={data} colors={colors} column={column()} />
      <WorkHours data={data} />
    </DataBlock>
  </>
);
