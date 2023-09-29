import React from 'react';

import AttendanceGraphNarrow from '../AttendanceGraphNarrow';

export default {
  title: 'timesheet-pc/graph',
};

export const _AttendanceGraphNarrow = () => <AttendanceGraphNarrow />;

_AttendanceGraphNarrow.storyName = 'AttendanceGraphNarrow';

_AttendanceGraphNarrow.parameters = {
  info: { propTables: [AttendanceGraphNarrow], inline: true, source: true },
};
