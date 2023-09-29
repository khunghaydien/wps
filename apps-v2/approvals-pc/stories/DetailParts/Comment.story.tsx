import React from 'react';

import Comment from '../../components/DetailParts/Comment';

export default {
  title: 'approvals-pc/DetailParts',
};

export const _Comment = () => (
  <Comment
    employeePhotoUrl=""
    comment="サンプルコメント　サンプルコメント　サンプルコメント　サンプルコメント　サンプルコメント　サンプルコメント"
  />
);

_Comment.parameters = {
  info: { propTables: [Comment], inline: true, source: true },
};
