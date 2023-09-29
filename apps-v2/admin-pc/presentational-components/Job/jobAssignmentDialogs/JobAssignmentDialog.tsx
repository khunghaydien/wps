import * as React from 'react';

import Button from '../../../../commons/components/buttons/Button';
import DialogFrame from '../../../../commons/components/dialogs/DialogFrame';
import DateRangeField from '../../../../commons/components/fields/DateRangeField';
import HorizontalLayout from '../../../../commons/components/fields/layouts/HorizontalLayout';
import msg from '../../../../commons/languages';

import { Employee } from '../../../modules/job/ui/assignment';

import './JobAssignmentDialog.scss';

const ROOT = 'admin-pc-job-job-assignment-dialogs-job-assignment-dialog';

type Props = Readonly<{
  employees: Employee[];
  validDateThrough: string;
  validDateFrom: string;
  minValidDateFrom: string | null | undefined;
  canOpenEmployeeSelection: boolean;
  canAssign: boolean;
  hasEmployees: boolean;
  assign: () => void;
  open: () => void;
  cancel: () => void;
  updateValidDateThrough: (arg0: string) => void;
  updateValidDateFrom: (arg0: string) => void;
}>;

export default class JobAssignmentDialog extends React.Component<Props> {
  constructor(props: any) {
    super(props);

    this.renderEmployees = this.renderEmployees.bind(this);
  }

  renderEmployees() {
    return (
      <React.Fragment>
        {this.props.hasEmployees ? (
          <div className={`${ROOT}__list-box`}>
            <ul>
              {this.props.employees.map((e) => (
                <li key={e.id}>{e.name}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <Button
          className={`${ROOT}__button`}
          disabled={!this.props.canOpenEmployeeSelection}
          type="default"
          onClick={this.props.open}
        >
          {msg().Admin_Lbl_SelectEmployee}
        </Button>
      </React.Fragment>
    );
  }

  render() {
    return (
      <DialogFrame
        className={`${ROOT}`}
        title={msg().Admin_Lbl_JobAssignment}
        hide={this.props.cancel}
        footer={
          <DialogFrame.Footer>
            <Button type="default" onClick={this.props.cancel}>
              {msg().Com_Btn_Cancel}
            </Button>
            <Button
              type="primary"
              onClick={this.props.assign}
              disabled={!this.props.canAssign}
            >
              {msg().Com_Btn_Save}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__body`}>
          <div className={`${ROOT}__control`}>
            <HorizontalLayout>
              <HorizontalLayout.Label>
                {msg().Admin_Lbl_Period}
              </HorizontalLayout.Label>
              <HorizontalLayout.Body>
                <DateRangeField
                  startDateFieldProps={{
                    minDate: this.props.minValidDateFrom,
                    value: this.props.validDateFrom,
                    onChange: this.props.updateValidDateFrom,
                  }}
                  endDateFieldProps={{
                    value: this.props.validDateThrough,
                    onChange: this.props.updateValidDateThrough,
                  }}
                  required
                />
              </HorizontalLayout.Body>
            </HorizontalLayout>
          </div>

          <div className={`${ROOT}__control`}>
            <HorizontalLayout>
              <HorizontalLayout.Label>
                {msg().Com_Lbl_Employee}
              </HorizontalLayout.Label>
              <HorizontalLayout.Body>
                {this.renderEmployees()}
              </HorizontalLayout.Body>
            </HorizontalLayout>
          </div>
        </div>
      </DialogFrame>
    );
  }
}
