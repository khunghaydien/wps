import React from 'react';

import styled from 'styled-components';

const dateFormat = /(\d{4}-\d{2}-\d{2},?)/;

const NoWrap = styled.span`
  white-space: nowrap;
`;

type Props = Readonly<{ children: string }>;

export const PreventDateFormatDisplayCorruption: React.FC<Props> = ({
  children,
}) => (
  <>
    {children
      .split(dateFormat)
      .map((chank) =>
        chank.match(dateFormat) ? <NoWrap>{chank}</NoWrap> : chank
      )}
  </>
);
