import * as React from 'react';

import styled from 'styled-components';

type Props = Readonly<{
  'data-testid'?: string;
  children: React.ReactNode;
  className?: string;
  onClick: (e: React.SyntheticEvent) => void;
}>;

const DailySummaryTriggerButton: React.ComponentType<Props> = styled.div`
  width: 100%;
  height: 100%;
  outline: none;
  appearance: none;
  border: none;
  background: transparent;
`;

export default DailySummaryTriggerButton;
