import React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';

const S = {
  Columns: styled.div`
    position: sticky;
    top: 56px;
    z-index: 1;
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 600px;
    height: 40px;
    background: #f8f8f8;
    border-bottom: 1px solid #d9d9d9;
    font-weight: 700;
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
};

const ListHeader: React.FC = () => {
  return (
    <S.Columns>
      <S.MatchField>{msg().Time_Lbl_DecisionField}</S.MatchField>
      <S.MatchType>{msg().Time_Lbl_DecisionType}</S.MatchType>
      <S.MatchText>{msg().Time_Lbl_RelevantText}</S.MatchText>
      <S.Job>{msg().Trac_Lbl_Job}</S.Job>
      <S.WorkCategory>{msg().Trac_Lbl_WorkCategory}</S.WorkCategory>
      <S.ReferenceScopeType>
        {msg().Time_Lbl_ReferenceScope}
      </S.ReferenceScopeType>
      <S.Priority>{msg().Time_Lbl_Priority}</S.Priority>
    </S.Columns>
  );
};
export default ListHeader;
