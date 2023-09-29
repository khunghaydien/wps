import { configure } from '@storybook/react';

const req = require.context('../', true, /\.story\.js$|\.story\.tsx$/);

configure(req, module);
