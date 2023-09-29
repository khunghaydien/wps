import React from 'react';

import styled from 'styled-components';

import { AutoHoursAllocationResult } from '@apps/domain/models/time-tracking/AutoHoursAllocationResult';
import { Job, JobPickList } from '@apps/domain/models/time-tracking/Job';

import ListHeader from './ListHeader';
import ListRow from './ListRow';

const ContentsWrapper = styled.div`
  position: relative;
  width: 100%;
  height: calc(90vh - 200px);
  min-height: 200px;
  z-index: 0;
`;

const Table = styled.div`
  position: relative;
  left: 0%;
  top: 0px;
  width: 100%;
  min-width: 785px;
  background-color: #fff;
  height: 100%;
`;

const TableBodyWrapper = styled.div`
  padding: 0;
  inset: 35px 0 0;
  position: absolute;
  height: calc(100% - 35px) !important;
  border-top: 1px solid #ddd;
  overflow-x: hidden;
  overflow-y: auto;
`;

export type ValueProps = {
  empId: string | undefined;
  targetDate: string;
  checkAll: boolean;
  jobList: JobPickList;
  resultList: Array<AutoHoursAllocationResult>;
};

export type HandlerProps = {
  toggleCheckAll: (checkAllFlg: boolean) => void;
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

type Props = ValueProps & HandlerProps;

const Content: React.FC<Props> = ({
  checkAll,
  resultList,
  toggleCheckAll,
  ...tableProps
}) => {
  return (
    <ContentsWrapper>
      <Table>
        <ListHeader checkAll={checkAll} toggleCheckAll={toggleCheckAll} />
        <TableBodyWrapper>
          {resultList?.length > 0 &&
            resultList.map((item) => (
              <ListRow key={item.eventId} rowData={item} {...tableProps} />
            ))}
        </TableBodyWrapper>
      </Table>
    </ContentsWrapper>
  );
};

export default Content;
