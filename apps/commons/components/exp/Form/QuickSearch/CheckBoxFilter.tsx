import React, { useContext } from 'react';

import styled from 'styled-components';

import QuickSearchContext from './QuickSearchContext';

const S = {
  OuterDiv: styled.div`
    position: absolute;
    right: 8px;
    padding: 6px 10px;
  `,
  InnerDiv: styled.div`
    display: contents;
  `,
  Checkbox: styled.input`
    width: auto !important;
    margin-left: 10px;
  `,
  Label: styled.label`
    line-height: 1;
    margin-left: 4px;
    svg {
      zoom: 0.6;
      margin-bottom: 10px;
    }
  `,
};

const CheckBoxFilter = () => {
  const { filters, types, handleCheckBox } = useContext(QuickSearchContext);

  return (
    <S.OuterDiv>
      {filters.map(({ value, label, icon }) => (
        <S.InnerDiv>
          <S.Checkbox
            type="checkbox"
            id={value}
            name={value}
            value={value}
            onChange={handleCheckBox}
            checked={types.includes(value)}
          />
          <S.Label htmlFor={value}>
            {label} {icon}
          </S.Label>
        </S.InnerDiv>
      ))}
    </S.OuterDiv>
  );
};

export default CheckBoxFilter;
