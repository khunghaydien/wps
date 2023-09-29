import React from 'react';

import { Text } from '@apps/core';

import { useSourceTask } from '../../hooks/useSourceTask';
import S from './TaskStyle';
import WorkCategoryDropdown from '@apps/time-tracking/WorkCategoryDropdown';

const SourceTask: React.FC = () => {
  const [srcTask] = useSourceTask();

  const workCategory = React.useMemo(
    () => ({
      workCategoryId: srcTask.workCategoryId,
      workCategoryCode: srcTask.workCategoryCode,
      workCategoryName: srcTask.workCategoryName,
    }),
    [srcTask]
  );

  return (
    <S.Task>
      <S.Job>
        <S.JobCode>
          <Text size="small">{srcTask.jobCode}</Text>
        </S.JobCode>
        <S.JobName>
          <Text size="large">{srcTask.jobName}</Text>
        </S.JobName>
      </S.Job>
      <S.WorkCategory>
        <WorkCategoryDropdown
          readOnly
          selected={workCategory}
          // these are unused props, this dropdown is readonly.
          jobId=""
          targetDate=""
          onSelect={() => {}}
          onError={() => {}}
        />
      </S.WorkCategory>
    </S.Task>
  );
};

export default SourceTask;
