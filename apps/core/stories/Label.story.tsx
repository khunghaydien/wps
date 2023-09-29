import React from 'react';

/* eslint-enable import/no-extraneous-dependencies */
import { Label } from '../index';

export default {
  title: 'core/Label',
};

export const Default = () => (
  <>
    <Label backgroundColor="notRequested">NotRequested</Label>
    <Label backgroundColor="pending">Pending</Label>
    <Label backgroundColor="removed">Removed</Label>
    <Label backgroundColor="rejected">Rejected</Label>
    <Label backgroundColor="approved">Approved</Label>
    <Label backgroundColor="canceled" color="primary">
      Canceled
    </Label>
  </>
);

Default.storyName = 'default';
