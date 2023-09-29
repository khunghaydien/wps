import React from 'react';

import configList from '@admin-pc-v2/constants/configList/recordAccessGrant';

import msg from '@commons/languages';

import MainContents from '@admin-pc/components/MainContents';

const RecordAccessGrant = (props) => {
  return (
    <MainContents
      componentKey="RecordAccessGrant"
      configList={configList}
      isSinglePane
      detailTitle={msg().Admin_Lbl_GrantRecordAccess}
      {...props}
      modeBase={true /* Hack to hide edit button */}
    />
  );
};

export default RecordAccessGrant;
