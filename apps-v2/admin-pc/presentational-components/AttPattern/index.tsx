import React from 'react';

import { OwnProps as DetailProps } from '../../containers/AttPatternContainer/DetailPaneContainer';
import { OwnProps as ListProps } from '../../containers/AttPatternContainer/ListPaneContainer';

import MainContentFrame from '../../components/Common/MainContentFrame';

export type Props = {
  title: string;
  useFunction: boolean;
  isShowDetail: boolean;
  ListPaneContainer: React.FC<ListProps>;
  DetailPaneContainer: React.FC<DetailProps>;
};

const AttPattern: React.FC<Props> = ({
  title,
  useFunction,
  isShowDetail,
  ListPaneContainer,
  DetailPaneContainer,
}) => {
  return (
    <MainContentFrame
      ListPane={<ListPaneContainer title={title} />}
      DetailPane={<DetailPaneContainer useFunction={useFunction} />}
      Dialogs={[]}
      isDetailVisible={isShowDetail}
    />
  );
};

export default AttPattern;
