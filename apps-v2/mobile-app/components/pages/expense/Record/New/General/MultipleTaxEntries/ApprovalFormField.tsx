import React, { FC, ReactNode } from 'react';

import styled from 'styled-components';

import LabelWithHint from '@apps/mobile-app/components/atoms/LabelWithHint';

interface IApprovalFormFieldProps {
  label: string;
  value: string | ReactNode;
}

const ApprovalFormField: FC<IApprovalFormFieldProps> = (props) => {
  const { label, value } = props;

  return (
    <>
      <LabelWithHint text={label} />
      <FormValue>{value}</FormValue>
    </>
  );
};

export default ApprovalFormField;

const FormValue = styled.div`
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid #d9d9d9;
  font-size: 15px;
`;
