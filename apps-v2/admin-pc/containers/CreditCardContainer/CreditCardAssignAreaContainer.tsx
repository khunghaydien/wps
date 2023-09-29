import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { FunctionTypeList } from '@apps/admin-pc/constants/functionType';

import * as creditCard from '@apps/admin-pc/actions/creditCard';
import * as creditCardAssign from '@apps/admin-pc/actions/creditCardAssign';
import * as employee from '@apps/admin-pc/actions/employee';

import CreditCardAssignArea from '@apps/admin-pc/presentational-components/CreditCard/CreditCardAssignArea/index';

const mapStateToProps = (state) => ({
  searchCreditCardAssign: state.searchCreditCardAssign,
  searchEmployee: state.searchEmployee,
  tmpEditRecord: state.tmpEditRecord,
});

const CreditCardAssignAreaContainer = ({
  useFunction,
}: {
  useFunction: FunctionTypeList;
}) => {
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          search: creditCardAssign.searchCreditCardAssign,
          create: creditCardAssign.createCreditCardAssign,
          update: creditCardAssign.updateCreditCardAssign,
          delete: creditCardAssign.deleteCreditCardAssign,
          searchEmployee: employee.searchEmployee,
          searchList: creditCard.searchCreditCard,
        },
        dispatch
      ),
    [dispatch]
  );

  useEffect(() => {
    const param = {
      creditCardInformationId: props.tmpEditRecord.id,
    };
    Actions.search(param);
  }, [props.tmpEditRecord.id]);

  const onClickSearchCreditCardAssignments = async (
    code: string,
    name: string,
    departmentCode: string,
    departmentName: string,
    title: string
  ) => {
    const param = {
      code: code,
      name: name,
      departmentCode: departmentCode,
      departmentName: departmentName,
      title: title,
      companyId: props.tmpEditRecord.companyId,
    };
    return await Actions.searchEmployee(param);
  };

  const linkCreditCardAssignments = async (list) => {
    const ids = list.map((item) => item.id);
    const param = {
      employeeBaseIds: ids,
      creditCardInformationId: props.tmpEditRecord.id,
    };
    const result = await Actions.create(param);
    if (result) {
      Actions.search(param);
    }
  };

  const unlinkCreditCardAssignments = async (ids) => {
    const param = {
      ids: ids,
    };
    await Actions.delete(param);
    Actions.search({ creditCardInformationId: props.tmpEditRecord.id });
  };

  const changeCardholder = async (ids: string[]) => {
    await Actions.update({
      creditCardInformationId: props.tmpEditRecord.id,
      id: ids[0],
    });
    Actions.search({ creditCardInformationId: props.tmpEditRecord.id });
    Actions.searchList({ companyId: props.tmpEditRecord.companyId });
  };

  const MAX_NUM = 100;
  return (
    <CreditCardAssignArea
      {...props}
      useFunction={useFunction}
      // @ts-ignore
      // FIXME dispatch type not match
      onClickSearchCreditCardAssignments={onClickSearchCreditCardAssignments}
      linkCreditCardAssignments={linkCreditCardAssignments}
      unlinkCreditCardAssignments={unlinkCreditCardAssignments}
      changeCardholder={changeCardholder}
      maxNum={MAX_NUM}
    />
  );
};

export default CreditCardAssignAreaContainer;
