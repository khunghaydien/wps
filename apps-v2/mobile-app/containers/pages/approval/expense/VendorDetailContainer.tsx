import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouterProps } from 'react-router';
import { match as Match } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import get from 'lodash/get';

import { goBack } from '@mobile/concerns/routingHistory';

import msg from '../../../../../commons/languages';

import { State } from '../../../../modules';

import { getVendorDetail } from '../../../../action-dispatchers/approval/Vendor';

import VendorDetail from '../../../../components/pages/approval/expense/Report/VendorDetail';

type OwnProps = {
  match: Match;
  history: RouterProps['history'];
  id: string;
};

const VendorDetailDialogContainer = (ownProps: OwnProps) => {
  const vendorItem = useSelector(
    (state: State) => state.approval.entities.expense.vendor
  );
  const useJctRegistrationNumber = useSelector(
    (state: State) => state.userSetting.jctInvoiceManagement
  );
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;
  const onClickBack = () => goBack(ownProps.history);

  useEffect(() => {
    if (ownProps.id !== get(vendorItem, 'id')) {
      dispatch(getVendorDetail(ownProps.id));
    }
  }, []);

  return (
    <VendorDetail
      vendorItem={vendorItem}
      onClickBack={onClickBack}
      title={msg().Exp_Lbl_VendorDetail}
      useJctRegistrationNumber={useJctRegistrationNumber}
    />
  );
};

export default VendorDetailDialogContainer;
