/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import styled from 'styled-components';

import { TextSize } from '../elements/Text';
import { Text } from '../index';

const sizes = ['xxxl', 'xxl', 'xl', 'large', 'medium', 'small'];
const px = {
  xxxl: '24',
  xxl: '20',
  xl: '16',
  large: '13',
  medium: '12',
  small: '10',
};

const S = {
  Section: styled.div`
    display: flex;
    flex-flow: column nowrap;
    margin: 0 0 10px 0;
  `,
};

export default {
  title: 'core/Text',
};

export const AllTypes = () => (
  <>
    {sizes.map((size: TextSize) => (
      <S.Section>
        <Text size={size}>
          {size}: {px[size]}px
        </Text>
        <Text size={size} bold>
          {size}: {px[size]}px
        </Text>
      </S.Section>
    ))}
  </>
);

AllTypes.storyName = 'all types';
