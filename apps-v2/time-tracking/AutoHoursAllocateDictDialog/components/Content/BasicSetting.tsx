import React, { useCallback, useMemo } from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import { Dropdown, Option, Text } from '@apps/core';

import {
  AutoHoursAllocationDictItem,
  BasicSetting as BasicSettingType,
  // EXCEED_ACT_WORK_HOURS_TYPE,
  ExceededActWorkHours,
  OVER_LAPPING_TYPE,
  OverlappingEvent,
} from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';
import { Job, JobPickList } from '@apps/domain/models/time-tracking/Job';

import WorkCategoryDropdown from '@apps/time-tracking/common/components/WorkCategoryDropdown';

import JobSelect from '@apps/time-tracking/common/JobSelect';
import { useJobSelectDialog } from '@apps/time-tracking/JobSelectDialog';

const Wrapper = styled.div`
  margin: 0 10px;
`;

const Row = styled.div`
  position: sticky;
  z-index: 1;
  display: flex;
  align-items: center;
  min-height: 44px;
`;

const SettingTitleText = styled.div`
  width: 180px;
`;

const SettingText = styled(Text)`
  color: #999999;
`;

const SettingDropdown = styled.div`
  width: 350px;
  margin-left: 15px;
`;

const $overlappingEventOptions = () => [
  {
    label: msg().Time_Lbl_AllocationMethodForOverlappingSchedulesNone,
    value: OVER_LAPPING_TYPE.NONE,
  },
  {
    label: msg().Time_Lbl_AllocationMethodForOverlappingSchedulesToAll,
    value: OVER_LAPPING_TYPE.TO_ALL,
  },
  {
    label: msg().Time_Lbl_AllocationMethodForOverlappingSchedulesToLongest,
    value: OVER_LAPPING_TYPE.TO_LONGEST,
  },
  {
    label: msg().Time_Lbl_AllocationMethodForOverlappingSchedulesToShortest,
    value: OVER_LAPPING_TYPE.TO_SHORTEST,
  },
];

// const $exceedActWorkHourOptions = () => [
//   {
//     label: msg().Time_Lbl_AllocationMethodForExceededActualWorkingHoursNone,
//     value: EXCEED_ACT_WORK_HOURS_TYPE.NONE,
//   },
//   {
//     label:
//       msg().Time_Lbl_AllocationMethodForExceededActualWorkingHoursReduceEvenly,
//     value: EXCEED_ACT_WORK_HOURS_TYPE.REDUCE_EVENLY,
//   },
//   {
//     label:
//       msg().Time_Lbl_AllocationMethodForExceededActualWorkingHoursReduceLonger,
//     value: EXCEED_ACT_WORK_HOURS_TYPE.REDUCE_LONGER,
//   },
//   {
//     label:
//       msg().Time_Lbl_AllocationMethodForExceededActualWorkingHoursReduceLater,
//     value: EXCEED_ACT_WORK_HOURS_TYPE.REDUCE_LATER,
//   },
// ];

export type ValueProps = {
  empId: string;
  targetDate: string;
  jobList: JobPickList;
  basicSetting: BasicSettingType;
};

export type HandlerProps = {
  selectBasicJob: (job: AutoHoursAllocationDictItem['job']) => void;
  editBasicWorkCategory: (
    work: AutoHoursAllocationDictItem['workCategory']
  ) => void;
  editOverlappingEvent: (overlappingEvent: OverlappingEvent) => void;
  editExceedActWorkHour: (exceedActWorkHour: ExceededActWorkHours) => void;
  onOkForBasicJobSelectDialog: (job: Job) => void;
  onErrorForJobSelectDialog: (error: Error) => void;
};

export type Props = ValueProps & HandlerProps;

const BasicSetting: React.FC<Props> = ({
  empId,
  targetDate,
  jobList,
  basicSetting,
  selectBasicJob,
  editBasicWorkCategory,
  editOverlappingEvent,
  // editExceedActWorkHour,
  onOkForBasicJobSelectDialog,
  onErrorForJobSelectDialog,
}) => {
  const overlappingEventOptions = useMemo($overlappingEventOptions, []);
  // const exceedActWorkHourOptions = useMemo($exceedActWorkHourOptions, []);

  const jobPickList = jobList.allIds.map((id) => jobList.byId[id]);
  const hasWorkCategory = useMemo(() => {
    return (
      basicSetting.surplusTimeRegistrationJob?.hasJobType ||
      !!basicSetting.surplusTimeRegistrationWorkCategory?.workCategoryId
    );
  }, [
    basicSetting.surplusTimeRegistrationJob,
    basicSetting.surplusTimeRegistrationWorkCategory,
  ]);

  const [onClickOpenJobSelectDialog] = useJobSelectDialog<Job>({
    targetDate,
    onOk: (job) => onOkForBasicJobSelectDialog(job),
    onError: onErrorForJobSelectDialog,
    empId: empId || null,
  });

  const onSelectJob = useCallback(
    (option: Option) => {
      if (option.value) {
        const { jobId, jobCode, jobName, hasJobType } =
          jobList.byId[option.value];
        selectBasicJob({ id: jobId, code: jobCode, name: jobName, hasJobType });
      } else {
        selectBasicJob(null);
      }
    },
    [jobPickList]
  );

  return (
    <Wrapper>
      <Row>
        <SettingTitleText>
          <SettingText size="large">
            {msg().Time_Lbl_SurplusTimeRegistrationJob}
          </SettingText>
        </SettingTitleText>
        <SettingDropdown>
          <JobSelect
            data-testid="edit-event-popup__job-select"
            useTwoLinesFormat
            value={{ id: basicSetting.surplusTimeRegistrationJob?.id }}
            options={jobPickList}
            onSelect={onSelectJob}
            onClickSearch={onClickOpenJobSelectDialog}
          />
        </SettingDropdown>
        <SettingDropdown>
          {hasWorkCategory && (
            <WorkCategoryDropdown
              jobId={basicSetting.surplusTimeRegistrationJob?.id}
              targetDate={targetDate}
              onSelect={({ id, code, name }) =>
                editBasicWorkCategory({
                  workCategoryId: id,
                  workCategoryCode: code,
                  workCategoryName: name,
                })
              }
              onError={(e) => {
                console.log(e);
              }}
              selected={{
                workCategoryId:
                  basicSetting.surplusTimeRegistrationWorkCategory
                    ?.workCategoryId || null,
                workCategoryCode:
                  basicSetting.surplusTimeRegistrationWorkCategory
                    ?.workCategoryCode || null,
                workCategoryName:
                  basicSetting.surplusTimeRegistrationWorkCategory
                    ?.workCategoryName || null,
              }}
            />
          )}
        </SettingDropdown>
      </Row>
      <Row>
        <SettingTitleText>
          <SettingText size="large">
            {msg().Time_Lbl_AllocationMethodForOverlappingSchedules}
          </SettingText>
        </SettingTitleText>
        <SettingDropdown>
          <Dropdown
            options={overlappingEventOptions}
            value={basicSetting?.allocateMethodForOverlappingEvent}
            onSelect={(e) => {
              editOverlappingEvent(e.value);
            }}
          />
        </SettingDropdown>
      </Row>
      {/* NOTE 一時的実労働時間超過を画面上から非表示 */}
      {/* <Row>
        <SettingTitleText>
          <SettingText size="large">
            {msg().Time_Lbl_AllocationMethodForExceededActualWorkingHours}
          </SettingText>
        </SettingTitleText>
        <SettingDropdown>
          <Dropdown
            options={exceedActWorkHourOptions}
            value={basicSetting?.allocateMethodForExceedActWorkHour}
            onSelect={(e) => {
              editExceedActWorkHour(e.value);
            }}
          />
        </SettingDropdown>
      </Row> */}
    </Wrapper>
  );
};

export default BasicSetting;
