/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import { Icons, LinkButton } from '../index';

const Center = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-evenly;
  height: 200px;
`;

export default {
  title: 'core/LinkButton',
  decorators: [(story: Function) => <Center>{story()}</Center>],
};

export const Default = () => (
  <LinkButton onClick={action('onClick')}>Tester</LinkButton>
);

Default.storyName = 'default';

export const DefaultDisabled = () => (
  <LinkButton onClick={action('onClick')} disabled>
    Disabled
  </LinkButton>
);

DefaultDisabled.storyName = 'default/disabled';

export const WithIcon = () => (
  <>
    <LinkButton onClick={action('onClick')} icon={Icons.Plus} size="large">
      IconButton with Icon
    </LinkButton>
    <LinkButton
      onClick={action('onClick')}
      disabled
      icon={Icons.Plus}
      size="large"
    >
      IconButton with Icon
    </LinkButton>
    <LinkButton
      onClick={action('onClick')}
      icon={Icons.Percent}
      size="large"
      iconPosition="right"
    >
      Icon is shown in the right side
    </LinkButton>
    <LinkButton
      onClick={action('onClick')}
      disabled
      icon={Icons.Percent}
      size="large"
      iconPosition="right"
    >
      Icon is shown in the right side
    </LinkButton>
  </>
);

WithIcon.storyName = 'with icon';

export const Xxxl = () => (
  <>
    <LinkButton onClick={action('onClick')} size="xxxl">
      Font Size: 24px
    </LinkButton>
    <LinkButton onClick={action('onClick')} size="xxxl" disabled>
      Font Size: 24px
    </LinkButton>
  </>
);

Xxxl.storyName = 'XXXL';

export const Xxl = () => (
  <>
    <LinkButton onClick={action('onClick')} size="xxl">
      Font Size: 20px
    </LinkButton>
    <LinkButton onClick={action('onClick')} size="xxl" disabled>
      Font Size: 20px
    </LinkButton>
  </>
);

Xxl.storyName = 'XXL';

export const Xl = () => (
  <>
    <LinkButton onClick={action('onClick')} size="xl">
      Font Size: 16px
    </LinkButton>
    <LinkButton onClick={action('onClick')} size="xl" disabled>
      Font Size: 16px
    </LinkButton>
  </>
);

Xl.storyName = 'XL';

export const L = () => (
  <>
    <LinkButton onClick={action('onClick')} size="large">
      Font Size: 13px
    </LinkButton>
    <LinkButton onClick={action('onClick')} size="large" disabled>
      Font Size: 13px
    </LinkButton>
  </>
);

export const M = () => (
  <>
    <LinkButton onClick={action('onClick')} size="medium">
      Font Size: 12px
    </LinkButton>
    <LinkButton onClick={action('onClick')} size="medium" disabled>
      Font Size: 12px
    </LinkButton>
  </>
);

export const S = () => (
  <>
    <LinkButton onClick={action('onClick')} size="small">
      Font Size: 10px
    </LinkButton>
    <LinkButton onClick={action('onClick')} size="small" disabled>
      Font Size: 10px
    </LinkButton>
  </>
);
