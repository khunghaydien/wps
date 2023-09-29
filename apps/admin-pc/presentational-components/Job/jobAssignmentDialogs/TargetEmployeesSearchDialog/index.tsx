import * as React from 'react';

import Close from '../../../../../../node_modules/@salesforce-ux/design-system/assets/icons/utility/close.svg';

import Button from '../../../../../commons/components/buttons/Button';
import DialogFrame from '../../../../../commons/components/dialogs/DialogFrame';
import msg from '../../../../../commons/languages';
import TextUtil from '../../../../../commons/utils/TextUtil';

import { Employee, LIMIT_NUMBER } from '../../../../modules/job/ui/assignment';

import DataGrid from '../../../../components/DataGrid';
import getValueBoundNestedKey from '../../../../components/DataGrid/formatters/getValueBoundNestedKey';

import EmployeeSelectionSearchForm, {
  Props as SearchFormProps,
} from './EmployeeSearchForm';

import './index.scss';

const ROOT =
  'admin-pc-job-job-assignment-dialogs-target-employees-selection-dialog';

type Props = Readonly<
  SearchFormProps & {
    foundEmployees: Employee[];
    candidates: Employee[];
    isExceededLimit: boolean;
    cancel: () => void;
    selectCandidates: () => void;
    deleteACandidate: (arg0: Employee | null | undefined) => void;
    decideCandidates: () => void;
    toggleSelection: (arg0: Employee) => void;
  }
>;

export default class TargetEmployeeSelection extends React.Component<Props> {
  constructor() {
    // @ts-ignore
    super();

    this.renderDeleteButton = this.renderDeleteButton.bind(this);
  }

  renderDeleteButton(args: { value: string }) {
    const candidate = this.props.candidates.find((c) => c.id === args.value);
    return (
      <Button
        className={`${ROOT}__button`}
        onClick={() => this.props.deleteACandidate(candidate)}
      >
        <Close
          aria-hidden="true"
          className="slds-button__icon slds-button__icon--large"
        />
      </Button>
    );
  }

  render() {
    return (
      <DialogFrame
        className={`${ROOT}`}
        title={msg().Admin_Lbl_SelectEmployee}
        hide={this.props.cancel}
        footer={
          <DialogFrame.Footer>
            <Button type="default" onClick={this.props.cancel}>
              {msg().Com_Btn_Cancel}
            </Button>
            <Button type="primary" onClick={this.props.decideCandidates}>
              {msg().Com_Btn_Decide}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__body`}>
          <div className={`${ROOT}__list--found-employees`}>
            <div className={`${ROOT}__heading`}>
              {msg().Admin_Lbl_CandidateSearch}
            </div>
            <div className={`${ROOT}__search-form`}>
              <EmployeeSelectionSearchForm search={this.props.search} />
            </div>
            <div>
              <DataGrid
                numberOfRowsVisibleWithoutScrolling={5}
                columns={[
                  {
                    key: 'name',
                    name: msg().Com_Lbl_EmployeeName,
                  },
                  {
                    key: 'code',
                    name: msg().Com_Lbl_EmployeeCode,
                  },
                  {
                    key: 'department',
                    formatter: getValueBoundNestedKey('name'),
                    name: msg().Com_Lbl_DepartmentName,
                  },
                  {
                    key: 'department',
                    formatter: getValueBoundNestedKey('code'),
                    name: msg().Com_Lbl_DepartmentCode,
                  },
                  {
                    key: 'title',
                    name: msg().Com_Lbl_Title,
                  },
                ]}
                showCheckbox
                rows={this.props.foundEmployees}
                onRowClick={(_idx, row) => this.props.toggleSelection(row)}
                onRowsSelected={(rows) =>
                  rows.forEach(({ _idx, row }) =>
                    this.props.toggleSelection(row)
                  )
                }
                onRowsDeselected={(rows) =>
                  rows.forEach(({ _idx, row }) =>
                    this.props.toggleSelection(row)
                  )
                }
              />
            </div>
          </div>
          {this.props.isExceededLimit && (
            <div className={`${ROOT}__too-many-results`}>
              {TextUtil.template(
                msg().Com_Lbl_SearchResultsExceededLimit,
                LIMIT_NUMBER
              )}
            </div>
          )}
          <div className={`${ROOT}__selection-button`}>
            <Button onClick={this.props.selectCandidates}>
              {msg().Com_Btn_Select}
            </Button>
          </div>
          <div className={`${ROOT}__list--candidates`}>
            <div className={`${ROOT}__heading`}>
              {msg().Admin_Lbl_TargetEmployee}
            </div>
            <div>
              <DataGrid
                numberOfRowsVisibleWithoutScrolling={5}
                columns={[
                  {
                    key: 'name',
                    name: msg().Com_Lbl_EmployeeName,
                  },
                  {
                    key: 'code',
                    name: msg().Com_Lbl_EmployeeCode,
                  },
                  {
                    key: 'department',
                    formatter: getValueBoundNestedKey('name'),
                    name: msg().Com_Lbl_DepartmentName,
                  },
                  {
                    key: 'department',
                    formatter: getValueBoundNestedKey('code'),
                    name: msg().Com_Lbl_DepartmentCode,
                  },
                  {
                    key: 'title',
                    name: msg().Com_Lbl_Title,
                  },
                  {
                    key: 'id',
                    name: '',
                    formatter: this.renderDeleteButton,
                    width: 70,
                  },
                ]}
                // @ts-ignore
                rows={this.props.candidates}
              />
            </div>
          </div>
        </div>
      </DialogFrame>
    );
  }
}
