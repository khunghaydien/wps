import * as React from 'react';

import styled from 'styled-components';

import msg from '../../../commons/languages';
import { Button, Dropdown, Option } from '../../../core';

type Props = Readonly<{
  'data-testid'?: string;
  options?: {
    jobId: string;
    jobCode: string;
    jobName: string;
  }[];
  value?: {
    id: string;
  };
  onSelect: (option: Option) => void;
  onClickSearch: () => void;
}>;

const S = {
  Flex: styled.div`
    display: flex;
    align-items: center;
    width: 100%;
  `,
  Dropdown: styled(Dropdown)`
    width: 100%;
  `,
  JobSelectContainer: styled.div`
    margin-right: 12px;
    width: calc(100% - 92px);
  `,
  JobSelectButton: styled(Button)`
    width: 80px;
  `,
};

const JobSelect: React.FC<Props> = ({
  value,
  options = [],
  onSelect,
  onClickSearch,
  ...props
}: Props) => {
  const buildJobListOptions = (): {
    id: string;
    value: string;
    label: string;
  }[] => {
    return options.map((job) => {
      return {
        id: job.jobId,
        value: job.jobId,
        label: `${job.jobCode} ${job.jobName}`,
      };
    });
  };

  return (
    <S.Flex data-testid={props['data-testid']}>
      <S.JobSelectContainer>
        <S.Dropdown
          hasEmptyOption
          onSelect={onSelect}
          options={buildJobListOptions()}
          value={value ? value.id : undefined}
          placeholder={msg().Cal_Lbl_SelectJob}
        />
      </S.JobSelectContainer>
      <S.JobSelectButton onClick={onClickSearch}>
        {msg().Com_Btn_Select}
      </S.JobSelectButton>
    </S.Flex>
  );
};

export default JobSelect;
