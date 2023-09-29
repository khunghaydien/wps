/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import ActionIconButton from '../elements/ActionIconButton';
import { Theme } from '../elements/Button';
import { Close } from '../elements/Icons';

const colors = ['default', 'primary', 'secondary', 'danger'];

const S = {
  Section: styled.section`
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    justify-content: space-between;
    height: 500px;
  `,
  Container: styled.div`
    width: 100px;
    height: 80px;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: space-between;
  `,
};

export default {
  title: 'core/ActionIconButton',
};

export const AllTypes = () => (
  <S.Section>
    {colors.map((color: Theme) => (
      <React.Fragment key={color}>
        <S.Container>
          <ActionIconButton
            icon={Close}
            color={color}
            onClick={action('onClick')}
          />
          <ActionIconButton
            icon={Close}
            color={color}
            onClick={action('onClick')}
            disabled
          />
        </S.Container>
      </React.Fragment>
    ))}
  </S.Section>
);

AllTypes.storyName = 'all types';
