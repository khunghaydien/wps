import React from 'react';

import styled from 'styled-components';

import Button from '@apps/commons/components/buttons/Button';
import DateField from '@apps/commons/components/fields/DateField';
import msg from '@apps/commons/languages';

const HeaderHistory = styled.div`
  display: inline-block;
  margin-left: 20px;
`;

const HeaderHistoryInline = styled.div`
  display: inline-block;
`;

const SearchButton = styled(Button)`
  width: 86px;
  margin-left: 5px;
`;

export type Props = {
  historyTargetDate: string;
  onChangeHistoryTargetDate: (arg0: string) => void;
  onClickSearchButton: () => void;
};

const HistoryArea: React.FC<Props> = ({
  historyTargetDate,
  onChangeHistoryTargetDate,
  onClickSearchButton,
}) => {
  return (
    <HeaderHistory>
      <HeaderHistoryInline>{msg().Admin_Lbl_TargetDate}：</HeaderHistoryInline>
      <HeaderHistoryInline>
        <DateField
          onChange={(value: string) => {
            onChangeHistoryTargetDate(value);
          }}
          value={historyTargetDate}
        />
      </HeaderHistoryInline>
      <SearchButton onClick={onClickSearchButton}>
        {msg().Exp_Btn_Search}
      </SearchButton>
    </HeaderHistory>
  );
};

export default HistoryArea;
