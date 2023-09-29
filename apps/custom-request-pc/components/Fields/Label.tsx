import React from 'react';

import styled from 'styled-components';

type Props = {
  text: string;
  required?: boolean;
};

const StyledLabel = styled.div`
  margin-top: 4px;
  color: #666;
  .is-required {
    margin-right: 4px;
    color: #c23934;
  }
`;

const Component = (props: Props) => (
  <StyledLabel>
    {props.required && <span className="is-required">*</span>}
    {props.text}
  </StyledLabel>
);

export default Component;
