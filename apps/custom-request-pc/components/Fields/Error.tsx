import React from 'react';

import styled from 'styled-components';

type Props = {
  text: string;
};

const StyledError = styled.div`
  font-size: 12px;
  color: #c23934;
`;

const Component = (props: Props) => <StyledError>{props.text}</StyledError>;

export default Component;
