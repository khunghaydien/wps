import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import usePortal from 'react-useportal';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import msg from '@apps/commons/languages';
import { CloseButton } from '@apps/core';

import IconAdd from '@psa/images/icons/add.svg';

import './index.scss';

type Props = {
  name: string;
  title: string;
  headerList: Array<string>;
  resultGridSize: Array<number>;
  listData: Array<any>;
  selectLimit: number;
  defaultParam?: any;
  selectedList: Array<any>;
  searchBar: any;
  isResetted: boolean;
  onSelect: (itemList: Set<any>) => void;
  onRemove?: () => void;
  searchFunction: (arg0: any) => void;
  listDisplayHelper: Array<string>;
  hrefLink?: string;
  initializeSearchObject?: (arg0: any) => void;
  disabled?: boolean;
};

const ROOT = 'ts-selection-dialog';
const SelectionDialog = (props: Props) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [wrapperClass, setWrapperClass] = useState('disable');
  const [selectedRow, setSelectedRow] = useState(undefined);
  const [isSelectionDisabled, setSelectionDisabled] = useState(true);
  const [selection, setSelection] = useState(new Set());
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const initSelectedGroup = () => {
    if (props.selectedList) {
      const { length } = props.selectedList;
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
  const onClickRow = (row: any) => {
    setSelectedRow(row);
  };
  const onRemoveGroup = (id) =>
    setSelection(() => {
      const newSet = new Set(
        Array.from(selection).filter((selected: any) => selected.id !== id)
      );
      checkWrapper(newSet);
      props.onSelect(newSet);
      return newSet;
    });
  const checkWrapper = (s) => {
    setWrapperClass(s.size < props.selectLimit ? 'action' : 'disable');
  };

  const toggleOpen = () => {
    const originalSet = new Set(props.selectedList);
    setDialogOpen(!isDialogOpen);
    checkWrapper(originalSet);
    setSelectedRow(undefined);
  };
  const selectionButton = (
    <div className={`${ROOT}__selection-button ${wrapperClass}`}>
      <IconAdd
        className={`${ROOT}__selection-button__icon ${
          props.disabled && `${ROOT}__grey_out`
        }`}
      />
      <div onClick={props.disabled ? null : toggleOpen}>
        <span
          className={`${ROOT}__selection-button__name ${
            props.disabled && `${ROOT}__grey_out`
          }`}
        >
          {props.name}
        </span>
      </div>
    </div>
  );
  const contentHeader = () => {
    return (
      <div className={`${ROOT}__content-header-container`}>
        <MultiColumnsGrid
          sizeList={props.resultGridSize}
          alignments={Array(props.resultGridSize.length).fill('middle')}
        >
          {props.headerList.map((headerItem) => {
            return (
              <div className={`${ROOT}__content-header-item`}>{headerItem}</div>
            );
          })}
        </MultiColumnsGrid>
      </div>
    );
  };
  const renderContentList = () => {
    return (
      <div className={`${ROOT}__content-list-container`}>
        {props.listData.map((data) => {
          return (
            <MultiColumnsGrid
              sizeList={props.resultGridSize}
              onClick={() => {
                onClickRow(data);
              }}
              className={
                selectedRow && data.id === selectedRow.id
                  ? `${ROOT}__content-list-row selected`
                  : `${ROOT}__content-list-row`
              }
            >
              {props.listDisplayHelper.map((item) => {
                return (
                  <div className={`${ROOT}__content-list-item`}>
                    {data[item]}
                  </div>
                );
              })}
            </MultiColumnsGrid>
          );
        })}
      </div>
    );
  };
  const modalContent = () => {
    return (
      <div className={`${ROOT}__modal-content`}>
        {props.searchBar()}
        {props.headerList && contentHeader()}
        {props.listData && renderContentList()}
      </div>
    );
  };
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
      {modalContent()}
    </DialogFrame>
  );
  const { Portal } = usePortal({
    isOpen: true,
  });
  const selectionList = (
    <div className={`${ROOT}__selection-list`}>
      {Array.from(selection).map((data: any) => {
        let displayText = data.name;
        if (props.title === msg().Psa_Lbl_ClientInfoSelectOpportunity) {
          displayText = `${data.name} ${
            data.accountName ? `(${data.accountName})` : ''
          }`;
        }
        return (
          <div key={data.id} className={`${ROOT}__selection-list__item`}>
            <span className={`${ROOT}__selection-list__item__label`}>
              <a
                style={{ display: 'table-cell' }}
                href={props.hrefLink && `${props.hrefLink}/${data.id}/view`}
                target="_blank"
                rel="noopener noreferrer"
              >{`${displayText}`}</a>
            </span>
            <CloseButton
              className={`${ROOT}__selection-list__item__close-button`}
              onClick={() => {
                onRemoveGroup(data.id);
                props.onRemove && props.onRemove();
              }}
            />
          </div>
        );
      })}
    </div>
  );

  useEffect(() => {
    if (isDialogOpen && props.defaultParam && props.searchFunction) {
      props.initializeSearchObject(props.defaultParam);
      (dispatch as (arg0: unknown) => void)(
        props.searchFunction(props.defaultParam)
      );
    }
  }, [isDialogOpen]);

  useEffect(
    () => setSelectionDisabled(selectedRow === undefined),
    [selectedRow]
  );

  useEffect(() => {
    if (props.listData) {
      initSelectedGroup();
    }
  }, [props.listData, props.selectedList]);

  useEffect(() => {
    if (props.selectedList && !isDialogOpen) {
      const { length } = props.selectedList;
      if (length >= 0) {
        setSelection(
          new Set(
            props.listData.filter((group: any) =>
              props.selectedList.map((g) => g.id).includes(group.id)
            )
          )
        );
      }
    }
  }, [props.selectedList]);

  useEffect(() => {
    if (props.isResetted) {
      const originalSet = new Set(props.selectedList);
      checkWrapper(originalSet);
      props.onSelect(originalSet);
      setSelection(originalSet);
    }
  }, [props.isResetted]);

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

export default SelectionDialog;
