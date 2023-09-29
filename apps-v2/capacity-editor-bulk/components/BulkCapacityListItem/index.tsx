import React from 'react';
import { useSelector } from 'react-redux';

import SelectField from '@apps/commons/components/fields/SelectField';
import TextField from '@apps/commons/components/fields/TextField';
import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import PsaDateField from '@apps/commons/components/psa/Fields/DateField';
import msg from '@apps/commons/languages';
import IconTrash from '@commons/images/icons/iconTrash.svg';

import { State } from '../../modules/index';

import EmployeeMemberSearchContainer from '@apps/capacity-editor-bulk/containers/EmployeeMemberSearchContainer';

import './index.scss';

type employeeObject = {
  employeeId: string;
  employeeName: string;
};

type valueErrorObject = {
  hasError: boolean;
  errorMessage: string;
};

export type rowItem = {
  rowId: number;
  key: number;
  employee: employeeObject;
  startDate: string;
  endDate: string;
  action: string;
  optionSelected: string;
  value: string;
  removeRow: (rowId: number) => void;
  addEmployees: (employeeArray: Array<any>, rowId: number) => void;
  updateDate: (dateType: string, rowId: number, value: string) => void;
  updateListOfActions: (rowId: number, value: string) => void;
  updateOptions: (rowId: number, value: string) => void;
  updateValue: (rowId: number, value: string) => void;
  status: Array<any>;
  valueError: valueErrorObject;
};

const renderEmployeeField = (employee, addEmployees, rowId) => {
  if (employee.employeeId === '') {
    return (
      <div className={`${ROOT}__selection-button`}>
        <EmployeeMemberSearchContainer
          addEmployees={addEmployees}
          rowId={rowId}
          isSingleSelection={false}
        />
      </div>
    );
  } else {
    return employee.employeeName;
  }
};
const ROOT = 'ts-capacity_editor_list_item';
const BulkCapacityListItem = (props: rowItem) => {
  const minDate = useSelector(
    (state: State) => state.ui.capacityEditorActions.startDate
  );
  const maxDate = useSelector(
    (state: State) => state.ui.capacityEditorActions.endDate
  );

  const actions = useSelector(
    (state: State) => state.ui.capacityEditorActions.actionList
  );

  const actionList = useSelector(
    (state: State) =>
      state.ui.capacityEditorActions.actionList &&
      state.ui.capacityEditorActions.actionList.map((actions) => {
        return {
          disabled: null,
          text: actions.action,
          value: actions.action,
        };
      })
  );

  const workSchemeList = useSelector(
    (state: State) =>
      state.ui.capacityEditorWorkSchemes.workSchemes &&
      state.ui.capacityEditorWorkSchemes.workSchemes.map((workScheme) => {
        return { disabled: null, text: workScheme.name, value: workScheme.id };
      })
  );

  const workArrangementList = useSelector(
    (state: State) =>
      state.ui.capacityEditorWorkArrangements.workArrangements &&
      state.ui.capacityEditorWorkArrangements.workArrangements.map(
        (workArrangement) => {
          return {
            disabled: false,
            text: workArrangement.name,
            value: workArrangement.id,
          };
        }
      )
  );

  const renderError = () => {
    return props.valueError && props.valueError.hasError === true ? (
      <span className={`${ROOT}__TextFieldValidation`}>
        {props.valueError.errorMessage}
      </span>
    ) : null;
  };

  return (
    <div className={`${ROOT}_top`} key={props.key}>
      <MultiColumnsGrid
        sizeList={[2, 2, 2, 2, 2, 1, 1]}
        alignments={[
          'middle',
          'middle',
          'middle',
          'middle',
          'middle',
          'middle',
          'middle',
        ]}
      >
        {/* <span className={`${ROOT}__rowId`}>{props.rowId}</span> */}

        <span className={`${ROOT}__Employees`}>
          {renderEmployeeField(props.employee, props.addEmployees, props.rowId)}
        </span>

        <span className={`${ROOT}__dateField`}>
          {' '}
          <PsaDateField
            disabled={props.employee.employeeId === ''}
            placeholder={msg().Psa_Lbl_StartDate}
            value={props.startDate}
            onChange={(e) => {
              props.updateDate('startDate', props.rowId, e);
            }}
            dataTestId={`${ROOT}__start-date`}
            minDate={minDate}
            maxDate={maxDate}
            enableValidation={true}
            disableManualEnter={false}
          />
        </span>

        <span className={`${ROOT}__dateField`}>
          <PsaDateField
            disabled={props.employee.employeeId === ''}
            placeholder={msg().Psa_Lbl_EndDate}
            value={props.endDate}
            onChange={(e) => {
              props.updateDate('endDate', props.rowId, e);
            }}
            dataTestId={`${ROOT}__start-date`}
            minDate={minDate}
            maxDate={maxDate}
            enableValidation={true}
            disableManualEnter={false}
          />
        </span>

        <span className={`${ROOT}__selectField`}>
          {' '}
          <SelectField
            disabled={props.employee.employeeId === ''}
            className={`${ROOT}__ei-select`}
            options={actionList}
            onChange={(e) => {
              props.updateListOfActions(props.rowId, e.target.value);
            }}
            value={props.action}
          />
        </span>

        <span className={`${ROOT}__selectField`}>
          <SelectField
            disabled={
              props.employee.employeeId === '' ||
              (actions.find((action) => action.action === props.action) &&
                actions.find((action) => action.action === props.action)
                  .option === null)
            }
            className={`${ROOT}__ei-select`}
            options={
              actions.find((action) => action.action === props.action) &&
              actions.find((action) => action.action === props.action)
                .option === 'showWorkScheme'
                ? workSchemeList
                : actions.find((action) => action.action === props.action) &&
                  actions.find((action) => action.action === props.action)
                    .option === 'showWorkArrangement'
                ? workArrangementList
                : actions.find((action) => action.action === props.action) &&
                  actions.find((action) => action.action === props.action)
                    .option === 'showStatus'
                ? props.status
                : [{ text: 'Not Applicable', value: null, disabled: false }]
            }
            onChange={(e) => props.updateOptions(props.rowId, e.target.value)}
            value={props.optionSelected}
          />
        </span>

        <span className={`${ROOT}__TextField`}>
          <TextField
            className={
              props.valueError.hasError === true
                ? `${ROOT}__TextFieldError`
                : `${ROOT}__TextFieldNoError`
            }
            disabled={
              props.employee.employeeId === '' ||
              (actions.find((action) => action.action === props.action) &&
                actions.find((action) => action.action === props.action)
                  .option === 'showStatus')
            }
            value={props.value}
            onChange={(e) => props.updateValue(props.rowId, e.target.value)}
          />
          {renderError()}
        </span>

        <span className={`${ROOT}__action`}>
          <IconTrash
            className={`${ROOT}__selection-button-icon-remove`}
            onClick={() => props.removeRow(props.rowId)}
          />
        </span>
      </MultiColumnsGrid>
    </div>
  );
};

export default BulkCapacityListItem;
