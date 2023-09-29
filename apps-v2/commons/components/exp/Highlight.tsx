import React, { ReactElement } from 'react';

import classNames from 'classnames';

import styled from 'styled-components';

import { Color } from '@apps/core/styles';

interface Props {
  children: ReactElement | string | number;
  className?: string;
  highlight?: boolean;
  highlightColor?: string;
}

const Highlight = ({
  highlight = true,
  highlightColor = '#FFFCAF',
  children,
  className,
}: Props): ReactElement => {
  if (!highlight) {
    return <>{children}</>;
  }

  return (
    <HighlightContainer className="highlight-container">
      <HighlightArea
        background={highlight ? highlightColor : undefined}
        className={classNames(className, {
          [`highlight-diff-previous-value`]:
            highlightColor === Color.bgDisabled,
        })}
      >
        {children}
      </HighlightArea>
    </HighlightContainer>
  );
};

export default Highlight;

const HighlightContainer = styled.div`
  width: fit-content;
  max-width: 100%;
`;

const HighlightArea = styled.div<{
  background?: string;
}>`
  width: 100% !important;
  background: ${({ background }) => background};

  &.highlight-diff-previous-value {
    font-style: italic;
  }
`;
