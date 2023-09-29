import * as React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import { Button, Dropdown, Option, Text } from '@apps/core';

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
  useTwoLinesFormat?: boolean;
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
    display: flex;
    margin-right: 12px;
    width: calc(100% - 92px);
  `,
  JobSelectButton: styled(Button)`
    width: 80px;
  `,
  TwoLinesFormat: {
    Container: styled.div`
      display: flex;
      flex-direction: column;
      justify-content: center;
    `,
    Code: styled(Text)`
      line-height: 1;
    `,
    Name: styled(Text)`
      line-height: 1.2;
    `,
  },
};

const TwoLinesFormat: React.FC<{ job: Props['options'][number] }> = ({
  job,
}) => (
  <S.TwoLinesFormat.Container>
    <S.TwoLinesFormat.Code size="medium" color="secondary">
      {job.jobCode}
    </S.TwoLinesFormat.Code>
    <S.TwoLinesFormat.Name size="large" color="primary">
      {job.jobName}
    </S.TwoLinesFormat.Name>
  </S.TwoLinesFormat.Container>
);

const JobSelect: React.FC<Props> = ({
  value,
  options = [],
  onSelect,
  onClickSearch,
  useTwoLinesFormat = false,
  ...props
}: Props) => {
  const labelFormatter = useTwoLinesFormat
    ? (job) => <TwoLinesFormat job={job} />
    : (job) => `${job.jobCode} ${job.jobName}`;

  const buildJobListOptions = (): {
    id: string;
    value: string;
    label: React.ReactNode;
  }[] => {
    return options.map((job) => {
      return {
        id: job.jobId,
        value: job.jobId,
        label: labelFormatter(job),
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
