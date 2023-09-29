/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import GlobalContainer from '@apps/commons/containers/GlobalContainer';
import ToastContainer from '@apps/commons/containers/ToastContainer';
import msg from '@apps/commons/languages';
import { actions as toast } from '@apps/commons/modules/toast';
import TextUtil from '@commons/utils/TextUtil';

import { State } from '../modules/index';

import { saveRows } from '../action-dispatchers/App';

import BulkCapacityHeader from './BulkCapacityHeader';
import BulkCapacityList from './BulkCapacityList';
import { rowItem } from './BulkCapacityListItem';

import './index.scss';

const ROOT = 'ts-bulk_Capacity_Editor_Root_Container';
const App = () => {
  type rows = Array<rowItem>;
  const defaultRowActionOption = useSelector(
    (state: State) =>
      state.ui.capacityEditorActions.actionList &&
      state.ui.capacityEditorActions.actionList[0].action
  );

  const defaultRowActionOptionSelected = useSelector(
    (state: State) =>
      state.ui.capacityEditorActions.actionList &&
      state.ui.capacityEditorActions.actionList[0].option
  );
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;
  const actions = useSelector(
    (state: State) => state.ui.capacityEditorActions.actionList
  );

  const minDate = useSelector(
    (state: State) => state.ui.capacityEditorActions.startDate
  );
  const maxDate = useSelector(
    (state: State) => state.ui.capacityEditorActions.endDate
  );

  const workArrangement = useSelector(
    (state: State) => state.ui.capacityEditorWorkArrangements.workArrangements
  );
  const workSchemes = useSelector(
    (state: State) => state.ui.capacityEditorWorkSchemes.workSchemes
  );

  const status = [
    { disabled: null, text: 'Active', value: 'Active' },
    { disabled: null, text: 'Inactive', value: 'Inactive' },
    { disabled: null, text: 'Absence', value: 'Absence' },
  ];

  useEffect(() => {
    if (actions && workArrangement && workSchemes && minDate && maxDate) {
      addRow();
    }
  }, [actions, workArrangement, workSchemes, minDate, maxDate]);

  const updateValue = (rowId: number, value: string): void => {
    const validationSchema = [
      {
        id: 'showWorkScheme',
        min: 0,
        max: 720,
        type: 'number',
        required: false,
        errorMessage: TextUtil.template(
          msg().Psa_Lbl_CapacityEditorBulkValueError,
          'Value',
          0,
          720
        ),
      },
      {
        id: 'showWorkArrangement',
        min: -720,
        max: 720,
        type: 'number',
        required: false,
        errorMessage: TextUtil.template(
          msg().Psa_Lbl_CapacityEditorBulkValueError,
          'Value',
          -720,
          720
        ),
      },
      {
        id: 'NonProjectBookingTimeRM',
        min: -720,
        max: 720,
        type: 'number',
        required: false,
        errorMessage: TextUtil.template(
          msg().Psa_Lbl_CapacityEditorBulkValueError,
          'Value',
          -720,
          720
        ),
      },
      {
        id: 'NonProjectBookingTime',
        min: -720,
        max: 720,
        type: 'number',
        required: false,
        errorMessage: TextUtil.template(
          msg().Psa_Lbl_CapacityEditorBulkValueError,
          'Value',
          -720,
          720
        ),
      },
    ];
    const rowToCheck = rows.find((row) => row.rowId === rowId);
    const rowToCheckOption = actions.find(
      (action) => action.action === rowToCheck.action
    ).option;
    const rowToCheckAction = actions.find(
      (action) => action.action === rowToCheck.action
    ).action;
    const validationSchemaToCheckAgainst = validationSchema.find(
      (schema) =>
        schema.id === rowToCheckAction || schema.id === rowToCheckOption
    );

    if (validationSchemaToCheckAgainst !== undefined) {
      switch (validationSchemaToCheckAgainst.type) {
        case 'number':
          if (value !== '' && !isNaN(Number(value))) {
            const convertedValue = Number(value);
            if (
              !(
                convertedValue >= validationSchemaToCheckAgainst.min &&
                convertedValue <= validationSchemaToCheckAgainst.max
              )
            ) {
              const updatedRows = rows.map((row) =>
                row.rowId === rowId
                  ? {
                      ...row,
                      valueError: {
                        hasError: true,
                        errorMessage:
                          validationSchemaToCheckAgainst.errorMessage,
                      },
                      value,
                    }
                  : row
              );
              setRows(updatedRows);
            } else {
              const updatedRows = rows.map((row) =>
                row.rowId === rowId
                  ? {
                      ...row,
                      valueError: {
                        hasError: false,
                        errorMessage: '',
                      },
                      value,
                    }
                  : row
              );
              setRows(updatedRows);
            }
          } else if (value !== '' && isNaN(Number(value))) {
            const updatedRows = rows.map((row) =>
              row.rowId === rowId
                ? {
                    ...row,
                    valueError: {
                      hasError: true,
                      errorMessage: validationSchemaToCheckAgainst.errorMessage,
                    },
                    value,
                  }
                : row
            );
            setRows(updatedRows);
          } else {
            const updatedRows = rows.map((row) =>
              row.rowId === rowId
                ? {
                    ...row,
                    valueError: { hasError: false, errorMessage: '' },
                    value,
                  }
                : row
            );
            setRows(updatedRows);
          }
          break;
        default:
          break;
      }
    } else {
      const updatedRows = rows.map((row) =>
        row.rowId === rowId
          ? {
              ...row,
              valueError: { hasError: false, errorMessage: '' },
              value,
            }
          : row
      );
      setRows(updatedRows);
    }
  };

  const updateDate = (dateType: string, rowId: number, value: any): void => {
    let updatedRows;
    if (dateType === 'startDate') {
      updatedRows = rows.map((row) =>
        row.rowId === rowId ? { ...row, startDate: value } : row
      );
    } else {
      updatedRows = rows.map((row) =>
        row.rowId === rowId ? { ...row, endDate: value } : row
      );
    }
    setRows(updatedRows);
  };

  const handleSubmit = async () => {
    const verifiedRows = [];
    // eslint-disable-next-line array-callback-return
    const verifiedMapOfEmployeeAndActions = new Map();
    const checkBeforeSubmit = () => {
      for (let i = 0; i < rows.length; i++) {
        const employeeActionPair = `${rows[i].employee.employeeId}, ${rows[i].action}`;
        if (
          verifiedMapOfEmployeeAndActions.get(employeeActionPair) === undefined
        ) {
          verifiedMapOfEmployeeAndActions.set(employeeActionPair, true);
        } else {
          return false;
        }
      }
      return true;
    };
    if (checkBeforeSubmit()) {
      rows.forEach((row) => {
        if (row.employee.employeeId.length > 0) {
          const cleanedRow = {
            employeeId: row.employee.employeeId,
            startDate: row.startDate,
            endDate: row.endDate,
            action: row.action,
            optionSelected: row.optionSelected,
            value: row.value,
          };
          verifiedRows.push(cleanedRow);
        }
      });
      if (verifiedRows.length > 0) {
        const verfiedRowsObject = { bulkRequests: verifiedRows };
        await dispatch(saveRows(verfiedRowsObject));
        setRows([]);
      } else {
        dispatch(toast.show(msg().Psa_Lbl_FillEmptyRows, 'error'));
      }
    } else {
      dispatch(toast.show(msg().Psa_Lbl_BulkActionValidation, 'error'));
    }
  };

  const resetRows = () => {
    setRows([]);
  };

  const updateListOfActions = (rowId: number, value: string): void => {
    let optionValue;
    const newDefaultOption = actions.find(
      (action) => action.action === value
    ).option;
    let updatedValue;
    if (newDefaultOption === 'showWorkArrangement') {
      optionValue = workArrangement[0].id;
      updatedValue = String(workArrangement[0].workTime);
    } else if (newDefaultOption === 'showWorkScheme') {
      optionValue = workSchemes[0].id;
      updatedValue = String(workSchemes[0].workTimePerDay);
    } else if (newDefaultOption === 'showStatus') {
      optionValue = status[0].value;
    } else {
      optionValue = null;
      updatedValue = '';
    }

    const updatedRows = rows.map((row) =>
      row.rowId === rowId
        ? {
            ...row,
            action: value,
            optionSelected: optionValue,
            value: updatedValue,
          }
        : row
    );
    setRows(updatedRows);
  };

  const updateOptions = (rowId: number, value: string): void => {
    const arrangement = workArrangement.find(
      (arrangement) => arrangement.id === value
    );
    let updatedValue;
    const scheme = workSchemes.find((scheme) => scheme.id === value);

    if (arrangement) {
      updatedValue = String(arrangement.workTime);
    } else if (scheme) {
      updatedValue = String(scheme.workTimePerDay);
    } else {
      updatedValue = '';
    }

    const updatedRows = rows.map((row) =>
      row.rowId === rowId
        ? { ...row, optionSelected: value, value: updatedValue }
        : row
    );
    setRows(updatedRows);
  };

  const addEmployees = (employeeArray: Array<any>, rowId: number): void => {
    if (employeeArray.length === 1) {
      const newRows = rows.map((row) =>
        row.rowId === rowId
          ? {
              ...row,
              employee: {
                employeeId: employeeArray[0].employeeId,
                employeeName: employeeArray[0].employeeName,
              },
            }
          : row
      );
      setRows(newRows);
    } else {
      const cleanedRows = rows.map((row) =>
        row.rowId === rowId
          ? {
              ...row,
              employee: {
                employeeId: employeeArray[0].employeeId,
                employeeName: employeeArray[0].employeeName,
              },
            }
          : row
      );
      employeeArray.splice(0, 1);
      const additionalRows = employeeArray.map((employee, index) => {
        return {
          rowId: rows[rows.length - 1].rowId + index + 1,
          key: rows[rows.length - 1].rowId + index + 1,
          employee: {
            employeeId: employee.employeeId,
            employeeName: employee.employeeName,
          },
          startDate: minDate,
          endDate: maxDate,
          action: defaultRowActionOption,
          optionSelected:
            defaultRowActionOptionSelected === 'showWorkScheme'
              ? workSchemes[0].id
              : defaultRowActionOptionSelected === 'showWorkArrangement'
              ? workArrangement[0].id
              : defaultRowActionOptionSelected === 'showStatus'
              ? status[0].value
              : null,
          value:
            defaultRowActionOptionSelected === 'showWorkScheme'
              ? workSchemes[0].workTimePerDay
              : defaultRowActionOptionSelected === 'showWorkArrangement'
              ? workArrangement[0].workTime
              : '',
          removeRow,
          addEmployees,
          updateDate,
          updateListOfActions,
          updateOptions,
          updateValue,
          status,
          valueError: {
            hasError: false,
            errorMessage: '',
          },
        };
      });
      setRows([...cleanedRows, ...additionalRows]);
    }
  };

  const addRow = () => {
    if (rows.length > 0 && rows[0].employee.employeeId === '') {
      dispatch(toast.show(msg().Psa_Lbl_Add_Row_Check, 'error'));
    } else if (rows.length < 30) {
      const newRowId = rows.length > 0 ? rows[rows.length - 1].rowId + 1 : 1;
      setRows([
        ...rows,
        {
          rowId: newRowId,
          key: newRowId,
          employee: {
            employeeId: '',
            employeeName: '',
          },
          startDate: minDate,
          endDate: maxDate,
          action: defaultRowActionOption,
          optionSelected:
            defaultRowActionOptionSelected === 'showWorkScheme'
              ? workSchemes[0].id
              : defaultRowActionOptionSelected === 'showWorkArrangement'
              ? workArrangement[0].id
              : defaultRowActionOptionSelected === 'showStatus'
              ? status[0].value
              : null,
          value:
            defaultRowActionOptionSelected === 'showWorkScheme'
              ? workSchemes[0].workTimePerDay
              : defaultRowActionOptionSelected === 'showWorkArrangement'
              ? workArrangement[0].workTime
              : '',
          removeRow,
          addEmployees,
          updateDate,
          updateListOfActions,
          updateOptions,
          updateValue,
          status,
          valueError: {
            hasError: false,
            errorMessage: '',
          },
        },
      ]);
    } else {
      dispatch(toast.show(msg().Psa_Lbl_MaxRowsAdded, 'error'));
    }
  };
  const removeRow = (rowId: number) => {
    setRows((rows) => rows.filter((row) => row.rowId !== rowId));
  };

  const [rows, setRows] = useState<rows>([]);

  const renderComponent = () => {
    const component = (
      <React.Fragment>
        <div className={`${ROOT}__list-container`}>
          <BulkCapacityHeader
            resetRows={resetRows}
            handleSubmit={handleSubmit}
            rows={rows}
          ></BulkCapacityHeader>
          <BulkCapacityList
            rows={rows}
            addRow={addRow}
            removeRow={removeRow}
            addEmployees={addEmployees}
            updateOptions={updateOptions}
            updateDate={updateDate}
            updateListOfActions={updateListOfActions}
            updateValue={updateValue}
            status={status}
          ></BulkCapacityList>
        </div>
      </React.Fragment>
    );
    return component;
  };

  return (
    <GlobalContainer>
      <ToastContainer />
      {renderComponent()}
    </GlobalContainer>
  );
};

export default App;
