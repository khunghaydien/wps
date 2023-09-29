import React, { useEffect, useState } from 'react';

import isEmpty from 'lodash/isEmpty';

import styled from 'styled-components';

import Button from '@apps/commons/components/buttons/Button';
import Skeleton from '@apps/commons/components/Skeleton';
import backGroundImg from '@apps/commons/images/iconbackGround.png';
import IconDelete from '@apps/commons/images/icons/close.svg';
import msg from '@apps/commons/languages';
import colors from '@apps/commons/styles/exp/variables/_colors.scss';
import TextUtil from '@apps/commons/utils/TextUtil';
import { Color, Font } from '@apps/core/styles';

import {
  getJctRegistrationNumber,
  Vendor,
  VendorList,
} from '@apps/domain/models/exp/Vendor';

import DataGrid from '../../../DatatGrid';
import FilterableHeaderCell from '../../../DatatGrid/FilterableHeaderCell';

import './personalList.scss';

export type Props = {
  isFinanceApproval: boolean;
  isInvalidDisplay: boolean;
  isLoading: boolean;
  personalList: VendorList | null;
  useJctRegistrationNumber: boolean;
  getCurrencyList: () => void;
  getVendorList: () => void;
  handleToggleActive: (isChecked: boolean) => void;
  onClickDeleteVendorItem: (row: Vendor) => void;
  onClickNewVendor: () => void;
  onClickViewVendor: (id: string) => void;
  onSelectVendor: (id: string) => Promise<void>;
};

const ROOT = 'personal-vendor-list';

const S = {
  Delete: styled(IconDelete)`
    cursor: pointer;
    margin: 0 auto;
    transform: scale(0.8);
    width: 45px;
    & > path {
      fill: ${colors.buttonPrimary};
    }
  `,
  ViewDetail: styled.span`
    width: 95px;
    cursor: pointer;
    text-align: center;
    color: ${colors.buttonPrimary};
  `,
  ActiveTag: styled.span`
    background-color: #7d7d7d;
    color: ${Color.base};
    font-size: ${Font.size.M};
    padding: 0 5px;
    font-weight: 100;
    margin-right: 10px;
  `,
  LabelSection: styled.div`
    margin: 10px 0;
    display: flex;
    align-items: center;
  `,
  Labels: styled.div`
    display: flex;
    align-items: center;
  `,
  ActiveCheck: styled.input`
    margin-left: 15px;
    margin-right: 5px;
  `,
  AddBtn: styled(Button)`
    margin-left: auto;
  `,
  EmptyList: styled.div<{ backgroundImg: string }>`
    padding-top: 300px;
    background: ${({ backgroundImg }) => `url(${backgroundImg}) no-repeat`};
    background-position: 50% 20px;
    color: ${colors.textModest};
    font-size: 15px;
    text-align: center;
  `,
};

const PersonalVendorList = (props: Props) => {
  const { isInvalidDisplay } = props;
  const [list, setList] = useState(null);

  useEffect(() => {
    if (props.personalList === null) {
      return;
    }
    const filterList = isInvalidDisplay
      ? props.personalList
      : props.personalList.filter((o) => o.active);
    setList(filterList);
  }, [props.personalList, isInvalidDisplay]);

  useEffect(() => {
    props.getVendorList();
    props.getCurrencyList();
  }, []);

  const getCellActions = (column, row) => {
    const deleteAction = {
      icon: <S.Delete aria-hidden="true" />,
      callback: () => {
        props.onClickDeleteVendorItem(row);
      },
    };
    const veiwAction = {
      icon: <S.ViewDetail>{msg().Exp_Btn_VendorDetail}</S.ViewDetail>,
      callback: () => {
        props.onClickViewVendor(row.id);
      },
    };
    const activeTag = {
      icon: (
        <S.ActiveTag>
          {(!row.active && msg().Exp_Lbl_Invalid) || ''}
        </S.ActiveTag>
      ),
      callback: () => {},
    };
    const cellActions = {
      actions: props.isFinanceApproval
        ? [veiwAction, activeTag]
        : [deleteAction, veiwAction, activeTag],
    };
    return cellActions[column.key];
  };

  const columnJctRN = [
    {
      key: 'jctRegistrationNumber',
      name: msg().Exp_Clbl_JctRegistrationNumber,
      filterable: true,
      events: {
        onClick: (_rowIdx, selectedRow) => {
          props.onSelectVendor(selectedRow.rowId);
        },
      },
      formatter: (props) => {
        const { value, row } = props;
        const jctRN = getJctRegistrationNumber(
          value,
          row.isJctQualifiedInvoiceIssuer
        );
        return <>{jctRN}</>;
      },
      filterRenderer: FilterableHeaderCell,
    },
  ];

  const columnsCofig = [
    {
      key: 'code',
      name: msg().Exp_Lbl_Code,
      filterable: true,
      events: {
        onClick: (_rowIdx, selectedRow) => {
          props.onSelectVendor(selectedRow.rowId);
        },
      },
      filterRenderer: FilterableHeaderCell,
    },
    {
      key: 'name',
      name: msg().Exp_Lbl_Name,
      filterable: true,
      events: {
        onClick: (_rowIdx, selectedRow) => {
          props.onSelectVendor(selectedRow.rowId);
        },
      },
      filterRenderer: FilterableHeaderCell,
    },
    ...(props.useJctRegistrationNumber ? columnJctRN : []),
    {
      key: 'actions',
      name: '',
    },
  ];

  const renderList = (list) => {
    // when list not fetched yet, display empty area during loading than empty list background
    if (list === null) {
      return;
    }
    return isEmpty(list) ? (
      <S.EmptyList backgroundImg={backGroundImg}>
        {TextUtil.template(
          msg().Exp_Msg_CreateNewVendor,
          msg().Exp_Clbl_Vendor.toLowerCase()
        )}
      </S.EmptyList>
    ) : (
      <DataGrid
        rowHeight={40}
        columns={columnsCofig}
        data={list}
        getCellActions={getCellActions}
        visibleRowNum={7}
      />
    );
  };

  return (
    <>
      <S.LabelSection>
        <S.Labels>
          <span>{msg().Exp_Lbl_PersonalVendorList}</span>
          <S.ActiveCheck
            type="checkbox"
            checked={isInvalidDisplay}
            onClick={(_e) => props.handleToggleActive(!isInvalidDisplay)}
          />
          <label>{msg().Exp_Lbl_DisplayInactiveVendor}</label>
        </S.Labels>
        {!props.isFinanceApproval && (
          <S.AddBtn type="secondary" onClick={props.onClickNewVendor}>
            {msg().Exp_Lbl_NewVendor}
          </S.AddBtn>
        )}
      </S.LabelSection>
      {props.isLoading ? (
        <Skeleton
          noOfRow={7}
          colWidth="100%"
          className={`${ROOT}__skeleton`}
          rowHeight="25px"
          margin="30px"
        />
      ) : (
        <div className={ROOT}>{renderList(list)}</div>
      )}
    </>
  );
};

export default PersonalVendorList;
