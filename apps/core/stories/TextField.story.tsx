import React from 'react';

import styled from 'styled-components';

import { TextField } from '../index';

const Decorator = styled.div`
  width: 200px;
`;

export default {
  title: 'core/TextField',
  decorators: [(story: Function) => <Decorator>{story()}</Decorator>],
};

export const Default = () => <TextField placeholder="Placeholder" />;

Default.storyName = 'default';

export const Readonly = () => (
  <TextField readOnly value="Text,Text,Text,Text,Text,Text,Text,Text,Text" />
);

Readonly.storyName = 'readonly';

export const Disabled = () => (
  <TextField value="Text,Text,Text,Text,Text,Text,Text,Text,Text" disabled />
);

Disabled.storyName = 'disabled';

export const Placeholder = () => <TextField placeholder="Placeholder" />;

Placeholder.storyName = 'placeholder';

export const Min3Max10 = () => <TextField maxRows={10} minRows={3} />;

Min3Max10.storyName = 'min 3 max 10';

export const ResizeBoth = () => <TextField resize="both" />;

ResizeBoth.storyName = 'resize - both';

export const ResizeVertical = () => <TextField resize="vertical" />;

ResizeVertical.storyName = 'resize - vertical';

export const ResizeHorizontal = () => <TextField resize="horizontal" />;

ResizeHorizontal.storyName = 'resize - horizontal';
