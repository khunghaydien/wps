import * as React from 'react';
import ReactDataGrid from 'react-data-grid';

import Button from '../../../../../commons/components/buttons/Button';
import DialogFrame from '../../../../../commons/components/dialogs/DialogFrame';
import msg from '../../../../../commons/languages';
import TextUtil from '../../../../../commons/utils/TextUtil';

import { EmployeeShowObj } from '../../../../models/DelegatedApprover';

import { LIMIT_NUMBER } from '../../../../modules/delegateApprover/ui/assignment';

import EmployeeSelectionSearchForm, {
  Props as SearchFormProps,
} from './EmployeeSearchForm';

import './index.scss';

const ROOT = 'admin-pc-employee-delegate-approval';

type Props = Readonly<
  SearchFormProps & {
    foundEmployees: EmployeeShowObj[];
    singleSelection?: boolean;
    cancel: () => void;
    select: (arg0: EmployeeShowObj[]) => void;
    reset: () => void;
  }
>;

type State = {
  selectedIndexes: Array<string>;
};
export default class EmployeeSelection extends React.Component<Props, State> {
  state = {
    selectedIndexes: [],
  };

  componentDidMount() {
    if (this.props.reset) {
      this.props.reset();
    }
  }

  onRowsSelected = (rows: Array<{ row: EmployeeShowObj }>) => {
    if (this.props.singleSelection) {
      const selectedIndexes = rows.map((r) => r.row.id);
      this.setState({ selectedIndexes });
      return;
    }

    this.setState((prevState) => {
      const selectedIndexes = prevState.selectedIndexes.concat(
        rows.map((r) => r.row.id)
      );
      return { selectedIndexes };
    });
  };

  onRowsDeselected = (rows: Array<{ row: EmployeeShowObj }>) => {
    if (this.props.singleSelection) {
      this.setState({ selectedIndexes: [] });
      return;
    }

    this.setState((prevState) => {
      const rowIndexes = rows.map((r) => r.row.id);
      const selectedIndexes = prevState.selectedIndexes.filter(
        (i) => rowIndexes.indexOf(i) === -1
      );
      return { selectedIndexes };
    });
  };

  select = () => {
    const employees = this.props.foundEmployees.filter(
      (x) => this.state.selectedIndexes.indexOf(x.id) > -1
    );
    this.props.select(employees);
  };

  render() {
    const rows = this.props.foundEmployees.slice(0, LIMIT_NUMBER).map((x) => {
      return {
        id: x.id,
        name: (
          <div className={`${ROOT}__name`}>
            <img className={`${ROOT}__icon`} src={x.photoUrl} alt="" />
            <div className={`${ROOT}__info`}>
              <span className={`${ROOT}__code`}>{x.code}</span>
              <span>{x.name}</span>
            </div>
          </div>
        ),
        depCode: x.depCode,
        depName: x.depName,
        photoUrl: x.photoUrl,
        title: x.title,
      };
    });
    const isSaveDiabled = this.state.selectedIndexes.length < 1;
    const tableClass = this.props.singleSelection ? 'single-selection' : '';
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
            <Button
              className={
                !isSaveDiabled
                  ? `${ROOT}__add-btn`
                  : `${ROOT}__add-btn-disabled`
              }
              disabled={isSaveDiabled}
              onClick={this.select}
            >
              {msg().Com_Btn_Add}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__body`}>
          <div className={`${ROOT}__list--found-employees`}>
            <div className={`${ROOT}__search-form`}>
              <EmployeeSelectionSearchForm
                search={this.props.search}
                targetDate={this.props.targetDate}
              />
            </div>
            <div className={`${ROOT}__grid ${tableClass}`}>
              <ReactDataGrid
                rowHeight={45}
                numberOfRowsVisibleWithoutScrolling={8}
                columns={[
                  { key: 'name', name: msg().Com_Lbl_EmployeeName },
                  { key: 'depCode', name: msg().Com_Lbl_DepartmentCode },
                  { key: 'depName', name: msg().Com_Lbl_DepartmentName },
                  { key: 'title', name: msg().Com_Lbl_Title },
                ]}
                // @ts-ignore
                rowGetter={(i) => rows[i]}
                rowsCount={rows.length}
                rowSelection={{
                  showCheckbox: true,
                  onRowsSelected: this.onRowsSelected,
                  onRowsDeselected: this.onRowsDeselected,
                  selectBy: {
                    keys: { rowKey: 'id', values: this.state.selectedIndexes },
                  },
                }}
              />
            </div>
            {this.props.foundEmployees.length > LIMIT_NUMBER && (
              <div className={`${ROOT}__too-many-results`}>
                {TextUtil.template(
                  msg().Com_Lbl_SearchResultsExceededLimit,
                  LIMIT_NUMBER
                )}
              </div>
            )}
          </div>
        </div>
      </DialogFrame>
    );
  }
}
