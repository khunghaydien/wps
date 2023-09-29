import React from 'react';

import DetailContainer from '../../containers/CustomRequest/DetailContainer';
import ListContainer from '../../containers/CustomRequest/ListContainer';

import PaneWrapper from '../PaneWrapper';

type Props = {
  isShowSidePanel: boolean;
};

const CustomRequestListPane = ({ isShowSidePanel }: Props) => (
  <PaneWrapper
    list={<ListContainer />}
    detail={<DetailContainer />}
    isShowSidePanel={isShowSidePanel}
  />
);

export default CustomRequestListPane;
