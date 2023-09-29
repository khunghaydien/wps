import React, { useEffect, useMemo, useState } from 'react';

import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import Button from '../../commons/components/buttons/Button';
import DialogFrame from '../../commons/components/dialogs/DialogFrame';
import SearchableDropdown from '../../commons/components/fields/SearchableDropdown';
import TextField from '../../commons/components/fields/TextField';
import MultiColumnsGrid from '../../commons/components/MultiColumnsGrid';
import msg from '../../commons/languages';

import { QueryTemplate as QueryTemplateType } from '../models/Query';

import { State as QueryTemplateUiType } from '../modules/ui/query';

import './QueryTemplate.scss';

const ROOT = 'db-tool-query-template';

type Props = {
  selectedObjKey: string;
  queryTemplateList: Array<QueryTemplateType>;
  queryTemplate: QueryTemplateUiType;
  setSaveDialog: (arg0: boolean) => void;
  setDeleteDialog: (arg0: boolean) => void;
  onClickSaveQuery: (arg0: string | null, arg1: string) => void;
  onClickDeleteQuery: (arg0: string) => void;
  onChangeTemplate: (arg0: Record<string, any>) => void;
};

const getOptions = (list: Array<QueryTemplateType>) => {
  const options = [{ value: '', label: '' }];
  list.forEach((item) => {
    options.push({ value: item.id, label: item.sObjName });
  });
  return options;
};

type DialogProps = {
  className: string;
  inputName: string;
  title: string;
  isSave: boolean;
  selectedName: string;
  onChangeName: (arg0: string) => void;
  onClickHideDialogButton: () => void;
  onClickActionButton: (arg0: boolean) => void;
};

const QueryDialog = (props: DialogProps) => {
  const { className, inputName, isSave, onClickHideDialogButton } = props;
  const isNewName = inputName !== props.selectedName;
  const isError = isEmpty(inputName);
  let actionButton = '';
  if (isSave) {
    actionButton = isNewName
      ? msg().Com_Btn_Save_New
      : msg().Com_Btn_Save_Overwrite;
  } else {
    actionButton = msg().Com_Btn_Delete;
  }
  return (
    <DialogFrame
      title={props.title}
      hide={onClickHideDialogButton}
      className={`${className}__dialog-frame`}
      footer={
        <DialogFrame.Footer>
          <Button type="default" onClick={onClickHideDialogButton}>
            {msg().Com_Btn_Cancel}
          </Button>
          <Button
            type={isSave ? 'primary' : 'destructive'}
            className={`${className}__action-button`}
            onClick={() => props.onClickActionButton(isNewName)}
            disabled={isError}
          >
            {actionButton}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${className}__inner`}>
        <div className={`${className}__inner_label`}>
          {msg().Dbt_Lbl_QueryTemplateName}
        </div>
        <TextField
          onChange={(e) => props.onChangeName(e.target.value)}
          value={inputName}
          disabled={!isSave}
        />
        {isError && (
          <div className={`${className}__error`}>{msg().Com_Lbl_Required}</div>
        )}
      </div>
    </DialogFrame>
  );
};

const QueryTemplate = (props: Props) => {
  const {
    selectedObjKey,
    queryTemplateList,
    queryTemplate: { isSaveDialogOpen, isDeleteDialogOpen },
    onChangeTemplate,
  } = props;
  const isDisabled = isEmpty(selectedObjKey);
  const selectedId = props.queryTemplate.selectedId;
  const selectedQuery = find(queryTemplateList, ['id', selectedId]);
  const selectedName = get(selectedQuery, 'sObjName');
  const [queryName, setQueryName] = useState('');

  useEffect(() => {
    setQueryName(selectedName);
  }, [selectedId]);

  return (
    <>
      <div className={ROOT}>
        <MultiColumnsGrid sizeList={[3, 3]}>
          {useMemo(
            () => (
              <SearchableDropdown
                options={getOptions(queryTemplateList)}
                isSearchable
                placeholder={msg().Com_Lbl_Search}
                value={selectedId}
                disabled={isDisabled}
                onChange={onChangeTemplate}
              />
            ),
            [queryTemplateList, selectedId]
          )}
          <>
            <Button
              className={`${ROOT}-save-query`}
              onClick={() => props.setSaveDialog(true)}
              disabled={isDisabled}
            >
              {msg().Com_Btn_Save}
            </Button>
            <Button
              className={`${ROOT}-delete-query`}
              onClick={() => props.setDeleteDialog(true)}
              disabled={isDisabled}
            >
              {msg().Com_Btn_Delete}
            </Button>
          </>
        </MultiColumnsGrid>
      </div>
      {isSaveDialogOpen && (
        <QueryDialog
          className={`${ROOT}-dialog`}
          inputName={queryName}
          isSave
          title={msg().Dbt_Lbl_SaveQueryTemplate}
          onChangeName={setQueryName}
          onClickHideDialogButton={() => props.setSaveDialog(false)}
          onClickActionButton={(isNew) => {
            props.onClickSaveQuery(
              isNew || isEmpty(selectedId) ? null : selectedId,
              queryName
            );
          }}
          selectedName={selectedName}
        />
      )}
      {isDeleteDialogOpen && (
        <QueryDialog
          className={`${ROOT}-dialog`}
          inputName={queryName}
          isSave={false}
          title={msg().Dbt_Lbl_DeleteQueryTemplate}
          onChangeName={setQueryName}
          onClickHideDialogButton={() => props.setDeleteDialog(false)}
          onClickActionButton={() => props.onClickDeleteQuery(selectedId)}
          selectedName={selectedName}
        />
      )}
    </>
  );
};

export default QueryTemplate;
