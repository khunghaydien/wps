import * as React from 'react';

import { ThemeProvider } from 'styled-components';

import Theme from '../styles/Theme';
import DialogProvider from './DialogProvider';

const CoreProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={Theme}>
    <DialogProvider>{children}</DialogProvider>
  </ThemeProvider>
);

export { ThemeContext } from 'styled-components';
export default CoreProvider;
