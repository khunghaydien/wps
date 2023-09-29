import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePortal from 'react-useportal';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import Button from '@apps/commons/components/buttons/Button';
import IconButton from '@apps/commons/components/buttons/IconButton';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import TextField from '@apps/commons/components/fields/TextField';
import PsaDateRangeField from '@apps/commons/components/psa/Fields/DateRangeField';
import FormField from '@apps/commons/components/psa/FormField';
import btnSearch from '@apps/commons/images/btnSearchVia.png';
import msg from '@apps/commons/languages';
import { CloseButton } from '@apps/core';
import DateUtil from '@commons/utils/DateUtil';

import {
  Opportunity,
  OpportunityDefaultParam,
  OpportunityList,
  OpportunitySearchQuery,
} from '@apps/domain/models/psa/Opportunity';

import { State as projectState } from '@psa/modules';

import { getOpportunityList } from '@apps/psa-pc/action-dispatchers/Opportunity';

import IconAdd from '@psa/images/icons/add.svg';

import './index.scss';

const ROOT = 'ts-opportunity-selection-dialog';

type Props = {
  opportunityList: OpportunityList;
  selectedOpportunity: OpportunityList;
  isResetted: boolean;
  name: string;
  onSelect: (itemList: Set<any>) => void;
  selectLimit: number;
  title: string;
  onRemove?: () => void;
};

/**
 * This component will return the set of objects at onSelect method
 * Dynamic logic need to be added at the parent component
 * @param props
 * @returns
 */
const OpportunitySelectionDialog = (props: Props) => {
  const [selection, setSelection] = useState(new Set());
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(undefined);
  const [isSelectionDisabled, setSelectionDisabled] = useState(true);
  const [wrapperClass, setWrapperClass] = useState('disable');
  const [opportunityName, setOpportunityName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [opportunityList, setOpportunityList] = useState(props.opportunityList);

  const [createdStartDate, setCreatedStartDate] = useState();
  const [createdEndDate, setCreatedEndDate] = useState();

  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  useEffect(() => {
    // dispatch to fetch the list
    if (isDialogOpen) {
      dispatch(getOpportunityList(OpportunityDefaultParam));
    }
  }, [isDialogOpen]);

  const { Portal } = usePortal({
    isOpen: true,
  });

  useEffect(
    () => setSelectionDisabled(selectedRow === undefined),
    [selectedRow]
  );

  // Customization logic need to be added here if necessary
  const exceedLimit = useSelector(
    (state: projectState) => state.entities.clientInfo.opportunity.exceedLimit
  );

  const initSelectedGroup = () => {
    if (props.selectedOpportunity) {
      const { length } = props.selectedOpportunity;
      if (length < props.selectLimit) {
        setWrapperClass('action');
      } else {
        setWrapperClass('disable');
      }
    } else {
      setWrapperClass('action');
      setSelection(new Set());
    }
  };

  useEffect(() => {
    if (props.opportunityList) {
      setOpportunityList(props.opportunityList);
      initSelectedGroup();
    }
  }, [props.opportunityList]);

  useEffect(() => {
    if (props.selectedOpportunity && !isDialogOpen) {
      const { length } = props.selectedOpportunity;
      if (length >= 0) {
        setSelection(
          new Set(
            props.opportunityList.filter((group: Opportunity) =>
              props.selectedOpportunity.map((g) => g.id).includes(group.id)
            )
          )
        );
      }
    }
  }, [props.selectedOpportunity]);

  const checkWrapper = (s) =>
    setWrapperClass(s.size < props.selectLimit ? 'action' : 'disable');

  useEffect(() => {
    if (props.isResetted) {
      const originalSet = new Set(props.selectedOpportunity);
      checkWrapper(originalSet);
      props.onSelect(originalSet);
      setSelection(originalSet);
    }
  }, [props.isResetted]);

  useEffect(() => {
    if (props.selectedOpportunity) {
      const originalSet = new Set(props.selectedOpportunity);
      checkWrapper(originalSet);
    }
  }, [props.selectedOpportunity]);

  const toggleOpen = () => {
    const originalSet = new Set(props.selectedOpportunity);
    checkWrapper(originalSet);
    setDialogOpen(!isDialogOpen);
    setOpportunityList(props.opportunityList);
    setSelectedRow(undefined);
  };

  const onClickSearch = () => {
    const params: OpportunitySearchQuery = {
      name: opportunityName,
      createdFrom: createdStartDate,
      createdTo: createdEndDate,
      accountName,
      limitRows: 100,
    };
    dispatch(getOpportunityList(params));
    // dispatch(props.searchOpportunity());
  };
  const onClickSelect = () => {
    setSelection(() => {
      if (selectedRow) {
        selection.add(selectedRow);
      }
      checkWrapper(selection);
      props.onSelect(selection);
      return selection;
    });
    setSelectedRow(undefined);
    setDialogOpen(!isDialogOpen);
  };

  const onRemoveGroup = (id) =>
    setSelection(() => {
      const newSet = new Set(
        Array.from(selection).filter(
          (selected: Opportunity) => selected.id !== id
        )
      );
      checkWrapper(newSet);
      props.onSelect(newSet);
      return newSet;
    });
  const onClickRow = (row: Opportunity) => {
    setSelectedRow(row);
  };
  const onPressEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onClickSearch();
    }
  };

  const modalContent = (
    <div
      className={`${ROOT}__modal-content`}
      onKeyPress={(e) => onPressEnter(e)}
    >
      <div className={`${ROOT}__form-field-container`}>
        <FormField
          title={msg().Psa_Lbl_ClientInfoOpportunityName}
          testId={`${ROOT}__opportunity-name`}
        >
          <TextField
            value={opportunityName}
            onChange={(e) => setOpportunityName(e.target.value)}
          />
        </FormField>
        <FormField
          title={msg().Psa_Lbl_ClientInfoAccountName}
          testId={`${ROOT}__account-name`}
        >
          <TextField
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
        </FormField>
        <FormField
          title={msg().Psa_Lbl_ClientInfoCreatedDate}
          testId={`${ROOT}__created-date`}
        >
          <PsaDateRangeField
            startDateFieldProps={{
              value: createdStartDate,
              onChange: (value) => setCreatedStartDate(value),
            }}
            endDateFieldProps={{
              value: createdEndDate,
              onChange: (value) => setCreatedEndDate(value),
            }}
          />
        </FormField>
        <FormField title={''} testId={`${ROOT}__search-button`}>
          <IconButton
            src={btnSearch}
            className={`${ROOT}__search-button`}
            onClick={() => onClickSearch()}
          />
        </FormField>
      </div>

      <div className={`${ROOT}__list-item-container`}>
        <div className={`${ROOT}__list-item-header`}>
          <span>{msg().Psa_Lbl_ClientInfoOpportunityName}</span>
          <span>{msg().Psa_Lbl_ClientInfoAccountName}</span>
          <span>{msg().Psa_Lbl_ClientInfoCreatedDate}</span>
        </div>
        <div className={`${ROOT}__list-item-content`}>
          {props.opportunityList
            ? opportunityList.map((opp: Opportunity) => (
                <div
                  className={
                    selectedRow && opp.id === selectedRow.id
                      ? `${ROOT}__list-item selected`
                      : `${ROOT}__list-item`
                  }
                  onClick={() => onClickRow(opp)}
                >
                  <span>{opp.name}</span>
                  <span>{opp.accountName}</span>
                  <span>{DateUtil.format(opp.createdDate)}</span>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );

  const modalFooter = (
    <DialogFrame.Footer>
      {exceedLimit && (
        <span className={`${ROOT}__footer-error`}>
          {msg().Com_Lbl_TooManySearchResults}
        </span>
      )}
      <Button type="default" onClick={toggleOpen}>
        {msg().Psa_Btn_Cancel}
      </Button>
      <Button
        disabled={isSelectionDisabled}
        type="primary"
        onClick={onClickSelect}
      >
        {msg().Com_Btn_Select}
      </Button>
    </DialogFrame.Footer>
  );

  const selectDialog = (
    <DialogFrame
      title={props.title}
      hide={toggleOpen}
      className={`${ROOT}__modal`}
      draggable
      footer={modalFooter}
    >
      {modalContent}
    </DialogFrame>
  );

  const selectionButton = (
    <div className={`${ROOT}__selection-button ${wrapperClass}`}>
      <IconAdd className={`${ROOT}__selection-button__icon`} />
      <div onClick={toggleOpen}>
        <span className={`${ROOT}__selection-button__name`}>{props.name}</span>
      </div>
    </div>
  );

  const selectionList = (
    <div className={`${ROOT}__selection-list`}>
      {Array.from(selection).map((opp: Opportunity) => (
        <div key={opp.id} className={`${ROOT}__selection-list__item`}>
          <span className={`${ROOT}__selection-list__item__label`}>
            <a
              style={{ display: 'table-cell' }}
              href={`${window.origin}/lightning/r/Opportunity/${opp.id}/view`}
              target="_blank"
              rel="noopener noreferrer"
            >{`${opp.name} ${
              opp.accountName ? `(${opp.accountName})` : ''
            }`}</a>
          </span>
          <CloseButton
            className={`${ROOT}__selection-list__item__close-button`}
            onClick={() => {
              onRemoveGroup(opp.id);
              props.onRemove && props.onRemove();
            }}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__selection`}>
        {selectionButton}
        {selectionList}
      </div>
      <Portal>
        {isDialogOpen && selection.size < props.selectLimit && selectDialog}
      </Portal>
    </div>
  );
};

export default OpportunitySelectionDialog;
