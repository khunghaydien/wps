import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import usePortal from 'react-useportal';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import Button from '@apps/commons/components/buttons/Button';
import IconButton from '@apps/commons/components/buttons/IconButton';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import TextField from '@apps/commons/components/fields/TextField';
import FormField from '@apps/commons/components/psa/FormField';
import btnSearch from '@apps/commons/images/btnSearchVia.png';
import msg from '@apps/commons/languages';
import { CloseButton } from '@apps/core';

import { Client, ClientList } from 'apps/domain/models/psa/Client';

import { getClientList } from '@psa/action-dispatchers/Client';

import IconAdd from '@psa/images/icons/add.svg';

import './index.scss';

type Props = {
  name: string;
  selectLimit: number;
  title: string;
  onSelect: (itemList: Set<any>) => void;
  onRemove?: () => void;
  selectedClient: ClientList;
  clientList: ClientList;
};
const ROOT = 'ts-client-selection-dialog';

const ClientSelectionDialog = (props: Props) => {
  const [selection, setSelection] = useState(new Set());
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSelectionDisabled, setSelectionDisabled] = useState(true);
  const [selectedRow, setSelectedRow] = useState(undefined);
  const [clientName, setClientName] = useState('');
  const [wrapperClass, setWrapperClass] = useState('action');
  const [clientList, setClientList] = useState(null);
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const { Portal } = usePortal({
    isOpen: true,
  });

  const initSelectedGroup = () => {
    if (props.selectedClient) {
      const { length } = props.selectedClient;
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
    // dispatch to fetch the list
    if (isDialogOpen) {
      dispatch(getClientList({ name: '' }));
      setClientName('');
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if (props.clientList) {
      setClientList(props.clientList);
      initSelectedGroup();
    }
  }, [props.clientList]);

  useEffect(() => {
    if (props.selectedClient && !isDialogOpen) {
      const { length } = props.selectedClient;
      if (length >= 0) {
        setSelection(
          new Set(
            props.clientList.filter((group: Client) =>
              props.selectedClient.map((g) => g.id).includes(group.id)
            )
          )
        );
      }
    }
  }, [props.selectedClient]);

  useEffect(
    () => setSelectionDisabled(selectedRow === undefined),
    [selectedRow]
  );
  useEffect(() => {
    if (props.selectedClient) {
      const originalSet = new Set(props.selectedClient);
      checkWrapper(originalSet);
    }
  }, [props.selectedClient]);

  const toggleOpen = () => {
    const originalSet = new Set(props.selectedClient);
    checkWrapper(originalSet);
    setDialogOpen(!isDialogOpen);
    setClientList(props.clientList);
    setSelectedRow(undefined);
  };
  const checkWrapper = (s) => {
    setWrapperClass(s.size < props.selectLimit ? 'action' : 'disable');
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
  const onRemoveGroup = (id) => {
    setSelection(() => {
      const newSet = new Set(
        Array.from(selection).filter((selected: Client) => selected.id !== id)
      );
      checkWrapper(newSet);
      props.onSelect(newSet);
      return newSet;
    });
  };
  const onClickRow = (row: Client) => {
    setSelectedRow(row);
  };
  const onClickSearch = () => {
    const name = clientName;
    dispatch(
      getClientList({
        name: name,
      })
    );
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
        <FormField title={`Client`}>
          <TextField
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </FormField>
        <FormField
          title={''}
          testId={`${ROOT}__search-button`}
          className={`${ROOT}__search-button-container`}
        >
          <IconButton
            src={btnSearch}
            className={`${ROOT}__search-button`}
            onClick={onClickSearch}
          />
        </FormField>
      </div>
      <div className={`${ROOT}__list-item-container`}>
        <div className={`${ROOT}__list-item-header`}>
          <span>{`Client`}</span>
        </div>
        <div className={`${ROOT}__list-item-content`}>
          {clientList && clientList.length
            ? clientList.map((client: Client) => (
                <div
                  className={
                    selectedRow && client.id === selectedRow.id
                      ? `${ROOT}__list-item selected`
                      : `${ROOT}__list-item`
                  }
                  onClick={() => onClickRow(client)}
                >
                  <span>{client.name}</span>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );

  const modalFooter = (
    <DialogFrame.Footer>
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
  //
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
      {Array.from(selection).map((client: Client) => (
        <div key={client.id} className={`${ROOT}__selection-list__item`}>
          <span className={`${ROOT}__selection-list__item__label`}>
            <a
              style={{ display: 'table-cell' }}
              href={`${window.origin}/lightning/r/Account/${client.id}/view`}
              target="_blank"
              rel="noopener noreferrer"
            >{`${client.name}`}</a>
          </span>
          <CloseButton
            className={`${ROOT}__selection-list__item__close-button`}
            onClick={() => {
              onRemoveGroup(client.id);
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

export default ClientSelectionDialog;
