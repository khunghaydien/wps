import React from 'react';

import styled from 'styled-components';

import {
  HandlerProps as BasicSettingHandlerProps,
  ValueProps as BasicSettingValueProps,
} from './BasicSetting';
import BasicSettingCard from './BasicSettingCard';
import Table, {
  HandlerProps as TableHandlerProps,
  ValueProps as TableValueProps,
} from './Table';

const ContentsWrapper = styled.div`
  width: 100%;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export type ValueProps = BasicSettingValueProps &
  Omit<TableValueProps, 'isOpen'>;

export type HandlerProps = BasicSettingHandlerProps & TableHandlerProps;

export type Props = ValueProps & HandlerProps;

const Content: React.FC<Props> = ({
  empId,
  targetDate,
  jobList,
  basicSetting,
  selectBasicJob,
  editBasicWorkCategory,
  editOverlappingEvent,
  editExceedActWorkHour,
  onOkForBasicJobSelectDialog,
  onErrorForJobSelectDialog,
  ...tableProps
}) => (
  <ContentsWrapper>
    <Table
      key="dictItems"
      empId={empId}
      targetDate={targetDate}
      jobList={jobList}
      onErrorForJobSelectDialog={onErrorForJobSelectDialog}
      {...tableProps}
    />
    <BasicSettingCard
      key="basicSetting"
      empId={empId}
      targetDate={targetDate}
      jobList={jobList}
      basicSetting={basicSetting}
      selectBasicJob={selectBasicJob}
      editBasicWorkCategory={editBasicWorkCategory}
      editOverlappingEvent={editOverlappingEvent}
      editExceedActWorkHour={editExceedActWorkHour}
      onOkForBasicJobSelectDialog={onOkForBasicJobSelectDialog}
      onErrorForJobSelectDialog={onErrorForJobSelectDialog}
    />
  </ContentsWrapper>
);

export default Content;
