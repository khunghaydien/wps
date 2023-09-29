import React from 'react';
import './index.scss';
import msg from '@apps/commons/languages';

const RejectedTag = () => {
  const ROOT = 'ts-psa__resource__Rejected-Tag';
  return (
    <div className={ROOT}>
      <span>{msg().Psa_Lbl_Reject_Before}</span>
    </div>
  );
};
export default RejectedTag;
