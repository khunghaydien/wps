import React, { ReactNode as Node } from 'react';

import Button from '../../../../commons/components/buttons/Button';
import msg from '../../../../commons/languages';

import GrantHistoryList, {
  Props as GrantHistoryListProps,
} from './GrantHistoryList';
import NewGrantForm, { Props as NewGrantFormProps } from './NewGrantForm';

import './index.scss';

type PaneHeaderProps = {
  targetEmployeeName: string | null | undefined;
  onClickCloseButton: () => void;
};

const ROOT = 'admin-pc-annual-paid-leave-management-detail-pane';

const PaneHeader = (props: PaneHeaderProps) => (
  <header
    className={`slds-grid slds-grid--vertical-align-center ${ROOT}__header`}
  >
    <h2 className={`slds-grow-none slds-shrink-none ${ROOT}__header-title`}>
      {msg().Com_Lbl_Arrangement}
    </h2>
    <p className={`slds-grow slds-shrink-none ${ROOT}__header-side-content`}>
      <span className={`${ROOT}__header-side-text`}>
        {msg().Com_Lbl_EmployeeName}:
      </span>{' '}
      <span className={`${ROOT}__header-side-text--emphasis`}>
        {props.targetEmployeeName}
      </span>
    </p>
    <p className="slds-grow-none">
      <Button
        type="default"
        className={`${ROOT}__header-close-button`}
        onClick={props.onClickCloseButton}
      >
        {msg().Com_Btn_Close}
      </Button>
    </p>
  </header>
);

const PaneContent = (props: { children: Node | null | undefined }) => (
  <div className={`${ROOT}__content`}>{props.children}</div>
);

export type Props = NewGrantFormProps &
  GrantHistoryListProps &
  PaneHeaderProps & {
    targetEmployeeName: string | null | undefined;
  };

export default class DetailPane extends React.Component<Props> {
  render() {
    return (
      <section className={ROOT}>
        <PaneHeader
          targetEmployeeName={this.props.targetEmployeeName}
          onClickCloseButton={this.props.onClickCloseButton}
        />

        <PaneContent>
          <NewGrantForm
            daysGranted={this.props.daysGranted}
            validDateFrom={this.props.validDateFrom}
            validDateTo={this.props.validDateTo}
            comment={this.props.comment}
            onChangeDaysGranted={this.props.onChangeDaysGranted}
            onChangeValidDateFrom={this.props.onChangeValidDateFrom}
            onChangeValidDateTo={this.props.onChangeValidDateTo}
            onChangeComment={this.props.onChangeComment}
            onSubmitNewGrantForm={this.props.onSubmitNewGrantForm}
          />
          <GrantHistoryList
            dispatch={this.props.dispatch}
            grantHistoryList={this.props.grantHistoryList}
            onClickUpdateButton={this.props.onClickUpdateButton}
            onClickFractionGrantButton={this.props.onClickFractionGrantButton}
          />
        </PaneContent>
      </section>
    );
  }
}
