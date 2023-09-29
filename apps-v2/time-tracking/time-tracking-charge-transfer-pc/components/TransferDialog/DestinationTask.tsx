import React from 'react';

import styled from 'styled-components';

import { Text } from '@apps/core';

import EditJobButton from '@apps/time-tracking/time-tracking-charge-transfer-pc/components/TransferDialog/EditJobButton';

import { useDestinationTask } from '../../hooks/useDestinationTask';
import { useToast } from '../../hooks/useToast';
import { useWorkCategoryPeriod } from '../../hooks/useWorkCategoryPeriod';
import S from './TaskStyle';
import WorkCategoryDropdown from '@apps/time-tracking/common/components/WorkCategoryDropdownDeprecated';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const IconBlock = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const SourceTask: React.FC = () => {
  const [task, selectTask] = useDestinationTask();
  const [startDate, endDate] = useWorkCategoryPeriod();
  const [showError] = useToast('error');

  const showErrorMessage = React.useCallback(
    (error: Error) => {
      showError(error.message);
    },
    [showError]
  );

  const workCategory = React.useMemo(
    () => ({
      workCategoryId: task.workCategoryId,
      workCategoryCode: task.workCategoryCode,
      workCategoryName: task.workCategoryName,
    }),
    [task]
  );

  const onSelect: React.ComponentProps<
    typeof WorkCategoryDropdown
  >['onSelect'] = React.useCallback(
    (workCategory) => {
      selectTask({
        workCategoryId: workCategory.id,
        workCategoryCode: workCategory.code,
        workCategoryName: workCategory.name,
      });
    },
    [selectTask]
  );

  return (
    <Wrapper>
      <S.Task>
        <S.Job>
          <S.JobCode>
            <Text size="small">{task.jobCode}</Text>
          </S.JobCode>
          <S.JobName>
            <Text size="large">{task.jobName}</Text>
          </S.JobName>
        </S.Job>
        <S.WorkCategory>
          <WorkCategoryDropdown
            selected={workCategory}
            jobId={task.jobId}
            startDate={startDate}
            endDate={endDate}
            onSelect={onSelect}
            onError={showErrorMessage}
          />
        </S.WorkCategory>
      </S.Task>
      <IconBlock>
        <EditJobButton />
      </IconBlock>
    </Wrapper>
  );
};

export default SourceTask;
