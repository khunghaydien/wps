import React from 'react';

import DetailPaneContainer from '../../containers/LegalAgreementContainer/DetailPaneContainer';
import LimitEventDialogContainer from '../../containers/LegalAgreementContainer/LimitEventDialogContainer';
import ListPaneContainer from '../../containers/LegalAgreementContainer/ListPaneContainer';
import SpecialEventDialogContainer from '../../containers/LegalAgreementContainer/SpecialEventDialogContainer';

import MainContentFrame from '../../components/Common/MainContentFrame';

export type Props = {
  title: string;
  useFunction: boolean;
  isShowDetail: boolean;
};

const LegalAgreement: React.FC<Props> = ({
  title,
  useFunction,
  isShowDetail,
}) => {
  return (
    // @ts-ignore
    <MainContentFrame
      ListPane={<ListPaneContainer title={title} />}
      DetailPane={<DetailPaneContainer useFunction={useFunction} />}
      Dialogs={[<LimitEventDialogContainer />, <SpecialEventDialogContainer />]}
      isDetailVisible={isShowDetail}
    />
  );
};

export default LegalAgreement;
