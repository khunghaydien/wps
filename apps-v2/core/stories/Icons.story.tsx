/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import { Icons } from '../index';

export default {
  title: 'core/Icons',
};

export const Default = () => {
  return (
    <>
      <Icons.ChevronLeft color="main" />
      <Icons.ChevronRight color="accent" />
      <Icons.Attention color="attention" />
      <Icons.Calendar color="disable" />
      <Icons.Check color="error" />
      <Icons.Clock />
      <Icons.Close />
      <Icons.Percent />
      <Icons.Plus />
      <Icons.ExternalLink />
      <Icons.Locked />
    </>
  );
};

Default.storyName = 'default';
