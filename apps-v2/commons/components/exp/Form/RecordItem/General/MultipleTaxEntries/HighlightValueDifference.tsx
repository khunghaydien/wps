import React, { FC } from 'react';

import styled from 'styled-components';

import Highlight from '@apps/commons/components/exp/Highlight';
import { Color } from '@apps/core/styles';

interface IHighlightValueDifferenceProps {
  currentValue: string | number;
  previousValue: boolean | string | number;
  showHighlight: boolean;
}

const HighlightValueDifference: FC<IHighlightValueDifferenceProps> = (
  props
) => {
  const { currentValue, previousValue, showHighlight } = props;

  if (showHighlight && currentValue !== previousValue) {
    return (
      <Row className="highlight-value-difference-wrapper">
        <Highlight highlight>{currentValue}</Highlight>
        <Highlight highlight highlightColor={Color.bgDisabled}>
          {`(${previousValue})`}
        </Highlight>
      </Row>
    );
  }

  return <Row>{currentValue}</Row>;
};

export default HighlightValueDifference;

const Row = styled.div`
  display: grid;
  grid-gap: 5px;
`;
