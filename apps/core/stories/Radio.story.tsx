/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import { Radio } from '../index';

const Layout = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

export default {
  title: 'core/Radio',
};

export const Off = () => <Radio value={1} onChange={action('onChange')} />;

Off.storyName = 'off';

export const On = () => (
  <Radio checked value={2} onChange={action('onChange')} />
);

On.storyName = 'on';

export const Disabled = () => (
  <>
    <Radio disabled value={1} onChange={action('onChange')} />
    <Radio disabled value={2} checked onChange={action('onChange')} />
  </>
);

Disabled.storyName = 'disabled';

export const ReadOnly = () => (
  <>
    <Radio readOnly value={1} onChange={action('onChange')} />
    <Radio readOnly value={2} checked onChange={action('onChange')} />
  </>
);

ReadOnly.storyName = 'read only';

export const WithLabel = () => (
  <Layout>
    <Radio
      name="with-label"
      label="LABEL"
      value={1}
      onChange={action('onChange')}
    />
    <Radio
      name="with-label"
      checked
      label="SELECTED"
      value={1}
      onChange={action('onChange')}
    />
    <Radio
      name="with-label"
      label="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,"
      value={1}
      onChange={action('onChange')}
    />
  </Layout>
);

WithLabel.storyName = 'with label';
