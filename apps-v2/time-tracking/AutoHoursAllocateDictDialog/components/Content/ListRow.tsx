import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import styled from 'styled-components';

import { STANDARD_MAX_LENGTH_OF_INPUT_TEXT } from '@apps/time-tracking/common/constants/FIELD_ATTRIBUTES';

import TextField from '@apps/commons/components/fields/TextField';
import msg from '@apps/commons/languages';
import { Dropdown, IconButton, Icons, Option } from '@apps/core';

import {
  AutoHoursAllocationDictItem,
  FIELD_TYPE,
  OPERATOR_TYPE,
  REFERENCE_SCOPE_TYPE,
} from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';
import { Job, JobPickList } from '@apps/domain/models/time-tracking/Job';

import WorkCategoryDropdown from '@apps/time-tracking/common/components/WorkCategoryDropdown';

import ValidationError from '@apps/time-tracking/AutoHoursAllocateDictDialog/validators/ValidationError';
import JobSelect from '@apps/time-tracking/common/JobSelect';
import { useJobSelectDialog } from '@apps/time-tracking/JobSelectDialog';

const S = {
  Columns: styled.div<{ hasError?: boolean; isFromResult?: boolean }>`
    position: sticky;
    z-index: 1;
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 600px;
    min-height: 44px;
    background-color: ${({ hasError, isFromResult }) =>
      hasError ? 'rgba(194,57,52, 0.2)' : isFromResult ? '#d8edff' : '#ffffff'};
    border-bottom: 1px solid #d9d9d9;
  `,
  MatchField: styled.div`
    width: 12%;
    max-width: 100px;
    margin-left: 15px;
  `,
  MatchType: styled.div`
    width: 12%;
    max-width: 100px;
    margin-left: 15px;
  `,
  MatchText: styled.div`
    width: 10%;
    max-width: 200px;
    margin-left: 15px;
  `,
  Job: styled.div`
    width: 35%;
    max-width: 350px;
    margin-left: 15px;
  `,
  WorkCategory: styled.div`
    width: 15%;
    max-width: 250px;
    margin-left: 15px;
  `,
  ReferenceScopeType: styled.div`
    width: 10%;
    max-width: 120px;
    margin-left: 15px;
  `,
  Priority: styled.div`
    width: 6%;
    max-width: 100px;
    margin-left: 15px;
  `,
  DeleteButton: styled.div`
    margin: 0 20px 0 20px;
  `,
  IconButton: styled(IconButton)`
    width: 16px;
    height: 16px;
  `,
  PriorityField: styled(TextField)`
    text-align: right;

    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
      margin: 0 -16px 0 16px;
    }
  `,
};

const $fieldTypeOptions = () => [
  {
    label: msg().Time_Lbl_DecisionFieldTitle,
    value: FIELD_TYPE.TITLE,
  },
  {
    label: msg().Time_Lbl_DecisionFieldDescription,
    value: FIELD_TYPE.DESCRIPTION,
  },
];

const $operatorTypeOptions = () => [
  {
    label: msg().Time_Lbl_DecisionTypeStartWith,
    value: OPERATOR_TYPE.START_WITH,
  },
  {
    label: msg().Time_Lbl_DecisionTypeContains,
    value: OPERATOR_TYPE.CONTAINS,
  },
  {
    label: msg().Time_Lbl_DecisionTypeEquals,
    value: OPERATOR_TYPE.EQUALS,
  },
  {
    label: msg().Time_Lbl_DecisionTypeEndWith,
    value: OPERATOR_TYPE.END_WITH,
  },
];

const $scopeTypeOptions = () => [
  {
    label: msg().Time_Lbl_ReferenceScopeTypePersonal,
    value: REFERENCE_SCOPE_TYPE.INDIVIDUAL,
  },
  {
    label: msg().Time_Lbl_ReferenceScopeTypeDepartment,
    value: REFERENCE_SCOPE_TYPE.DEPARTMENT,
  },
  {
    label: msg().Time_Lbl_ReferenceScopeTypeOverall,
    value: REFERENCE_SCOPE_TYPE.OVERALL,
  },
];

export type ValueProps = {
  empId: string;
  targetDate: string;
  jobList: JobPickList;
  dictionary: AutoHoursAllocationDictItem;
  errors: ValidationError[];
};

type DictItemKeys = keyof AutoHoursAllocationDictItem;

export type HandlerProps = {
  selectJob: (id: string, job: AutoHoursAllocationDictItem['job']) => void;
  selectWorkCategory: (
    id: string,
    work: AutoHoursAllocationDictItem['workCategory']
  ) => void;
  editPriority: (id: string, priority: number) => void;
  editItemField: <T extends DictItemKeys = DictItemKeys>(
    id: string,
    key: T,
    value: AutoHoursAllocationDictItem[T]
  ) => void;
  deleteItem: (id: string) => void;
  onOkForJobSelectDialog: (id: string, job: Job) => void;
  onErrorForJobSelectDialog: (error: Error) => void;
};

type Props = ValueProps & HandlerProps;

const ListRow: React.FC<Props> = ({
  empId,
  targetDate,
  jobList,
  dictionary,
  errors,
  selectJob,
  selectWorkCategory,
  editPriority,
  editItemField,
  deleteItem,
  onOkForJobSelectDialog,
  onErrorForJobSelectDialog,
}) => {
  const hasError = useMemo(
    () => errors.some((err) => err.record === dictionary.key),
    [dictionary.key, errors]
  );
  const rowRef = useRef(null);
  useEffect(() => {
    if (rowRef?.current && errors[0]?.record === dictionary.key) {
      rowRef.current.scrollIntoView();
    }
  }, [dictionary.key, errors]);

  const fieldTypeOptions = useMemo($fieldTypeOptions, []);
  const operatorTypeOptions = useMemo($operatorTypeOptions, []);
  const scopeTypeOptions = useMemo($scopeTypeOptions, []);

  const jobPickList = jobList.allIds.map((id) => jobList.byId[id]);

  const hasWorkCategory = useMemo(() => {
    return (
      dictionary.job?.hasJobType || !!dictionary.workCategory?.workCategoryId
    );
  }, [dictionary.job, dictionary.workCategory]);

  const [onClickOpenJobSelectDialog] = useJobSelectDialog<Job>({
    targetDate,
    onOk: (job) => onOkForJobSelectDialog(dictionary.key, job),
    onError: onErrorForJobSelectDialog,
    empId: empId || null,
  });

  const onSelectJob = useCallback(
    (option: Option) => {
      if (option.value) {
        const { jobId, jobCode, jobName, hasJobType } =
          jobList.byId[option.value];
        selectJob(dictionary.key, {
          id: jobId,
          code: jobCode,
          name: jobName,
          hasJobType,
        });
      } else {
        selectJob(dictionary.key, null);
      }
    },
    [jobPickList]
  );

  const [priority, setPriority] = useState<string>();
  useEffect(() => {
    setPriority(dictionary.priority.toString(10));
  }, [dictionary]);
  const onChangePriority = useCallback(
    (_, value: string) => setPriority(value),
    [setPriority]
  );
  const onBlurPriority = useCallback(
    (_, value: string) => {
      const next = Number.parseInt(value);
      const prev = dictionary.priority;

      if (!isNaN(next) && next > 0 && next < 1000) {
        editPriority(dictionary.key, next);
      } else {
        // 値が不正な場合は、元の値に戻す
        setPriority(prev.toString(10));
      }
    },
    [dictionary, editItemField]
  );

  const {
    key,
    isFromResult,
    fieldType,
    operatorType,
    valueText,
    job,
    workCategory,
    referenceScopeType,
  } = dictionary;
  return (
    <S.Columns ref={rowRef} hasError={hasError} isFromResult={isFromResult}>
      <S.MatchField>
        <Dropdown
          readOnly={true}
          options={fieldTypeOptions}
          value={fieldType}
          onSelect={(e) => {
            editItemField(key, 'fieldType', e.value);
          }}
        />
      </S.MatchField>
      <S.MatchType>
        <Dropdown
          options={operatorTypeOptions}
          value={operatorType}
          autoFocus={isFromResult === true}
          onSelect={(e) => {
            editItemField(key, 'operatorType', e.value);
          }}
        />
      </S.MatchType>
      <S.MatchText>
        <TextField
          id={`matching-text_${key}`}
          maxLength={STANDARD_MAX_LENGTH_OF_INPUT_TEXT}
          value={valueText}
          onChange={(e) => {
            editItemField(key, 'valueText', e.target.value);
          }}
        />
      </S.MatchText>
      <S.Job>
        <JobSelect
          data-testid="time-track-dic__job-select"
          useTwoLinesFormat
          value={job}
          options={jobPickList}
          onSelect={onSelectJob}
          onClickSearch={onClickOpenJobSelectDialog}
        />
      </S.Job>
      <S.WorkCategory>
        {hasWorkCategory && (
          <WorkCategoryDropdown
            jobId={job?.id}
            targetDate={targetDate}
            onSelect={({ id, code, name }) =>
              selectWorkCategory(key, {
                workCategoryId: id,
                workCategoryCode: code,
                workCategoryName: name,
              })
            }
            onError={(e) => {
              console.log(e);
            }}
            selected={{
              workCategoryId: workCategory?.workCategoryId || null,
              workCategoryCode: workCategory?.workCategoryCode || null,
              workCategoryName: workCategory?.workCategoryName || null,
            }}
          />
        )}
      </S.WorkCategory>
      <S.ReferenceScopeType>
        <Dropdown
          readOnly={true}
          options={scopeTypeOptions}
          value={referenceScopeType}
          onSelect={(e) => {
            editItemField(key, 'referenceScopeType', e.value);
          }}
        />
      </S.ReferenceScopeType>
      <S.Priority>
        <S.PriorityField
          id={`priority_${key}`}
          type="number"
          value={priority}
          min={1}
          step={1}
          max={999}
          onChange={onChangePriority}
          onBlur={onBlurPriority}
        />
      </S.Priority>
      <S.DeleteButton onClick={() => deleteItem(key)}>
        <S.IconButton icon={Icons.Delete} />
      </S.DeleteButton>
    </S.Columns>
  );
};

export default ListRow;
