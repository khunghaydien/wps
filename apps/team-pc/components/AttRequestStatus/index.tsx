import * as React from 'react';

import Button from '../../../commons/components/buttons/Button';
import PeriodPicker from '../../../commons/components/fields/PeriodPicker';
import msg from '../../../commons/languages';

import DepartmentSelectDialog from '../../containers/DepartmentSelectDialogContainer';

import EmployeeGrid, { Props as EmployeeGridProps } from './EmployeeGrid';

import './index.scss';

const ROOT = 'team-pc-att-request-status';

type Props = Readonly<
  EmployeeGridProps & {
    currentPeriod: string;
    periodOptions: {
      text: string;
      value: string;
    }[];
    onChangePeriod: (value: string) => void;
    onClickThisPeriod: () => void;
    onClickNextPeriod: () => void;
    onClickPrevPeriod: () => void;
    onOpenDepartmentSelectDialog: () => void;
    hasPrevPeriod: boolean;
    hasNextPeriod: boolean;
    departmentId: string;
    departmentName: string;
  }
>;

export default class Main extends React.Component<Props> {
  render() {
    const { props } = this;

    return (
      <main className={ROOT}>
        <div className={`${ROOT}__selectors`}>
          <div className={`${ROOT}__monthly-selector`}>
            <PeriodPicker
              currentButtonLabel={msg().Att_Btn_ThisMonth}
              selectValue={props.currentPeriod}
              selectOptions={props.periodOptions}
              onChangeSelect={(value) => props.onChangePeriod(value)}
              onClickPrevButton={props.onClickPrevPeriod}
              onClickCurrentButton={props.onClickThisPeriod}
              onClickNextButton={props.onClickNextPeriod}
              disabledPrevButton={!props.hasPrevPeriod}
              disabledNextButton={!props.hasNextPeriod}
            />
          </div>
          <div className={`${ROOT}__department-selector`}>
            <div className={`${ROOT}__department-name`}>
              {props.departmentId
                ? props.departmentName
                : msg().Team_Lbl_EmptyDepartment}
            </div>
            <Button
              className={`${ROOT}__depertment-select-button`}
              onClick={props.onOpenDepartmentSelectDialog}
            >
              {msg().Com_Btn_Select}
            </Button>
          </div>
        </div>
        <EmployeeGrid
          records={props.records}
          onClickOpenTimesheetWindowButton={
            props.onClickOpenTimesheetWindowButton
          }
          onUpdateFilterTerm={props.onUpdateFilterTerm}
          workingTypeNameOptions={props.workingTypeNameOptions}
          closingDateOptions={props.closingDateOptions}
          filterTerms={props.filterTerms}
        />
        <DepartmentSelectDialog />
      </main>
    );
  }
}
