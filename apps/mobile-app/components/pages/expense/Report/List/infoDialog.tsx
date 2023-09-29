import React from 'react';

import msg from '../../../../../../commons/languages';
import TextUtil from '../../../../../../commons/utils/TextUtil';
import Dialog from '../../../../molecules/commons/Dialog';

const ROOT = 'mobile-app-pages-expense-page-report-list';

type Props = { isShowInfo: boolean; setShowInfo: (arg0: boolean) => void };

const InfoDialog = (props: Props) => {
  const unSupportedList = [msg().Exp_Clbl_Vendor];
  return (
    props.isShowInfo && (
      <Dialog
        title={msg().Com_Lbl_Information}
        content={
          <div className={`${ROOT}__contents`}>
            {TextUtil.nl2br(
              TextUtil.template(
                msg().Exp_Lbl_MobileNotSupportedInfo,
                unSupportedList.join('\n- ')
              )
            )}
          </div>
        }
        onClickCloseButton={() => props.setShowInfo(false)}
      />
    )
  );
};

export default InfoDialog;
