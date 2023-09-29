import React from 'react';

import isEmpty from 'lodash/isEmpty';

import GlobalContainer from '../../commons/containers/GlobalContainer';
import msg from '../../commons/languages';

import { sObjList } from '../models/ObjectList';

import ObjectPageContainer from '../containers/ObjectPageContainer';
import RecordDetailPageContainer from '../containers/RecordDetailPageContainer';

import './App.scss';

const ROOT = 'db-tool-app';

type Props = {
  objList: sObjList;
  isDetailRecordPage: boolean;
  isAccessible: boolean;
};

export default class App extends React.Component<Props> {
  render() {
    const { objList, isDetailRecordPage, isAccessible } = this.props;
    const content = (
      <>
        {isDetailRecordPage && <RecordDetailPageContainer />}
        {!isDetailRecordPage && !isEmpty(objList) && <ObjectPageContainer />}
      </>
    );
    return (
      <div className={ROOT}>
        <GlobalContainer>
          {isAccessible ? (
            content
          ) : (
            <div className="block-page">{msg().Com_Err_NoAccessPermission}</div>
          )}
        </GlobalContainer>
      </div>
    );
  }
}
