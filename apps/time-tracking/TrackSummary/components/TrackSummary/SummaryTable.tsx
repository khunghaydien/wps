import * as React from 'react';

import range from 'lodash/range';
import numeral from 'numeral';

import styled from 'styled-components';

import msg from '../../../../commons/languages';
import variables from '../../../../commons/styles/wsp.scss';
import TimeUtil from '../../../../commons/utils/TimeUtil';

import DataTable from '../molecules/DataTable';
import { Data, Datum } from './Props';

type Row = {
  color: string | null;
} & Datum;

export type ColumnDef = {
  [K in string]: React.ComponentType<Row>;
};

type Props = {
  readonly data: Data;
  readonly column: () => ColumnDef;
};

const PreLine = styled.span`
  white-space: pre-line;
  word-break: break-all;
`;

const Text = styled.span`
  display: inline-block;
`;

const JobAndWorkCategory = ({ jobName, workCategoryName }) => (
  <>
    <PreLine>
      <Text>{jobName}</Text>
      {workCategoryName && <Text> /{workCategoryName}</Text>}
    </PreLine>
  </>
);

export const Column: {
  Request: () => ColumnDef;
  Approval: () => ColumnDef;
} = {
  Request: () => ({
    [msg().Time_Lbl_JobName]: (({ ...props }) => (
      <JobAndWorkCategory {...props} />
    )) as React.ComponentType<Row>,
    [msg().Time_Lbl_WorkingPercentage]: (({ workTimeRatio }: Row) => (
      <>{`${numeral(workTimeRatio).format('0.0')}%`}</>
    )) as React.ComponentType<Row>,
    [msg().Time_Lbl_WorkingHours]: (({ workTime }: Row) => (
      <>{TimeUtil.toHHmm(workTime)}</>
    )) as React.ComponentType<Row>,
  }),
  Approval: () => ({
    [msg().Time_Lbl_JobName]: JobAndWorkCategory,
    [msg().Time_Lbl_WorkingHours]: (({ workTime }: Row) => (
      <>{TimeUtil.toHHmm(workTime)}</>
    )) as React.ComponentType<Row>,
  }),
};

const colors = range(1, 13).map((i) => variables[`graph-color-${i}`]);

const SummaryTable = ({ data, column }: Props) => {
  return <DataTable data={data} colors={colors} column={column()} />;
};

export default SummaryTable;
