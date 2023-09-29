import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { FunctionTypeList } from '../../constants/functionType';

import { State } from '../../reducers';

import AttPattern from '../../presentational-components/AttPattern';

import DetailPaneContainer from './DetailPaneContainer';
import ListPaneContainer from './ListPaneContainer';

type Props = {
  title: string;
  useFunction: FunctionTypeList;
};

const AttPatternContainer: React.FC<Props> = ({ title, useFunction }) => {
  const isShowDetail = useSelector(
    (state: State) => state.base.detailPane.ui.isShowDetail,
    shallowEqual
  );
  return (
    <AttPattern
      title={title}
      useFunction={useFunction}
      isShowDetail={isShowDetail}
      DetailPaneContainer={DetailPaneContainer}
      ListPaneContainer={ListPaneContainer}
    />
  );
};

export default AttPatternContainer;
