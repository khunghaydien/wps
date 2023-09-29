import React from 'react';

import CommentNarrowField from '../../components/fields/CommentNarrowField';

// ダミーアイコン
import ImgSamplePhoto001 from '../../images/Sample_photo001.png';

export default {
  title: 'commons/fields',
};

export const _CommentNarrowField = () => (
  <CommentNarrowField icon={ImgSamplePhoto001} />
);

_CommentNarrowField.storyName = 'CommentNarrowField';

_CommentNarrowField.parameters = {
  info: { propTables: [CommentNarrowField], inline: true, source: true },
};
