import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { State } from '../../../modules';
import { actions as recordItemActions } from '../../../modules/expense/entities/recordItem';

import RecordListItemPage from '../../../components/pages/expense/Record/List/Item';

type OwnProps = RouteComponentProps & {
  recordNo: string;
};

const RecordListItemContainer = (ownProps: OwnProps) => {
  useEffect(() => {
    recordItemActions.get(ownProps.recordNo);
  }, []);

  const recordItem = useSelector(
    (state: State) => state.expense.entities.recordItem
  );

  return <RecordListItemPage recordItem={recordItem} />;
};

export default RecordListItemContainer;
