import React from 'react';

import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import Toast from '../components/Toast';

export default {
  title: 'commons/Toast',
  decorators: [withKnobs],
};

export const Success = () => {
  return (
    <Toast
      message={text('message', '個人設定を保存しました。')}
      isShow={boolean('isShow', true)}
      onClick={action('ボタンクリック')}
      onExit={action('onExit')}
    />
  );
};

Success.parameters = {
  info: `
    # Description

    申請完了や、保存完了時に表示するトーストです
  `,
};

export const Warning = () => {
  return (
    <Toast
      variant="warning"
      message={text('message', '個人設定を保存しました。')}
      isShow={boolean('isShow', true)}
      onClick={action('ボタンクリック')}
      onExit={action('onExit')}
    />
  );
};

export const Error = () => {
  return (
    <Toast
      variant="error"
      message={text('message', '個人設定を保存しました。')}
      isShow={boolean('isShow', true)}
      onClick={action('ボタンクリック')}
      onExit={action('onExit')}
    />
  );
};

export const LongMessage = () => {
  return (
    <Toast
      variant="success"
      message={text(
        'message',
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,'
      )}
      isShow={boolean('isShow', true)}
      onClick={action('ボタンクリック')}
      onExit={action('onExit')}
    />
  );
};

LongMessage.storyName = 'Long message';
