import React from 'react';

import styled from 'styled-components';

import Button from '@apps/commons/components/buttons/Button';
import ButtonGroups from '@apps/commons/components/buttons/ButtonGroups';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import LabelWithHint from '@apps/commons/components/fields/LabelWithHint';
import msg from '@apps/commons/languages';
import colors from '@apps/commons/styles/exp/variables/_colors.scss';

import { Delegator } from '@apps/domain/models/exp/DelegateApplicant';
import {
  Vendor,
  VendorItem,
  VendorItemList,
  VendorList,
  VendorType,
  vendorTypes,
} from '@apps/domain/models/exp/Vendor';

import CompanyList from './CompanyList';
import PersonalList from './PersonalList';

import '../ExtendedItem/index.scss';

const ROOT = 'ts-expenses-modal-vendor-dialog';

const S = {
  Dialog: styled(DialogFrame)`
    width: 800px;
    height: 600px;
  `,
  Inner: styled.div`
    font-size: 13px;
  `,
  Buttons: styled(ButtonGroups)`
    margin-bottom: 10px;
    .ts-button--default {
      border: solid 1px ${colors.buttonPrimary};
      color: ${colors.buttonPrimary};
    }
  `,
};

export type Props = {
  hintMsg?: string;
  isFinanceApproval: boolean;
  isInvalidDisplay: boolean;
  isLoading: boolean;
  personalList: VendorList;
  selectedDelegator: Delegator;
  tabs: string[];
  type?: VendorType;
  useJctRegistrationNumber: boolean;
  vendorRecentlyUsed: VendorItemList;
  getPersonalList: () => void;
  getPersonalVendorDetail: (id: string) => void;
  onClickDeleteVendorItem: (vendorInfo: Vendor) => void;
  onClickHideDialogButton: () => void;
  onClickNewVendor: () => void;
  onClickVendorItem: (item: VendorItem) => void;
  onSelectPersonalVendor: (id: string) => Promise<void>;
  onVendorSearch: (query: string) => Promise<VendorItemList>;
  searchCurrencyCode: () => void;
  setType: (type: VendorType) => void;
  toggleActive: (isChecked: boolean) => void;
};

export default class VendorDialog extends React.Component<Props> {
  renderMainContent(type: VendorType) {
    switch (type) {
      case vendorTypes.PERSONAL:
        return (
          <PersonalList
            isFinanceApproval={this.props.isFinanceApproval}
            isInvalidDisplay={this.props.isInvalidDisplay}
            isLoading={this.props.isLoading}
            personalList={this.props.personalList}
            getVendorList={this.props.getPersonalList}
            getCurrencyList={this.props.searchCurrencyCode}
            onClickDeleteVendorItem={this.props.onClickDeleteVendorItem}
            onClickNewVendor={this.props.onClickNewVendor}
            onClickViewVendor={this.props.getPersonalVendorDetail}
            onSelectVendor={this.props.onSelectPersonalVendor}
            handleToggleActive={this.props.toggleActive}
            useJctRegistrationNumber={this.props.useJctRegistrationNumber}
          />
        );
      case vendorTypes.COMPANY:
      default:
        return (
          <CompanyList
            className={ROOT}
            isFinanceApproval={this.props.isFinanceApproval}
            isLoading={this.props.isLoading}
            selectedDelegator={this.props.selectedDelegator}
            vendorRecentlyUsed={this.props.vendorRecentlyUsed}
            onClickVendorItem={this.props.onClickVendorItem}
            onVendorSearch={this.props.onVendorSearch}
            useJctRegistrationNumber={this.props.useJctRegistrationNumber}
          />
        );
    }
  }

  renderButtonGroup = (tabs: string[], type: VendorType) => {
    if (tabs.length === 1) {
      return;
    }
    const getButtonType = (tabType: string) => {
      const isActive = tabType === type;
      return isActive ? 'primary' : 'default';
    };

    const onChange = (activeType: VendorType) => {
      this.props.setType(activeType);
    };

    const btns = tabs.map((tab) => {
      let label;
      switch (tab) {
        case vendorTypes.COMPANY:
          label = msg().Exp_Lbl_CompanyVendor;
          break;
        case vendorTypes.PERSONAL:
          label = msg().Exp_Lbl_PersonalVendor;
          break;
        default:
          return '';
      }
      return (
        <Button
          key={tab}
          type={getButtonType(tab)}
          onClick={() => onChange(tab)}
        >
          {label}
        </Button>
      );
    });

    return <S.Buttons>{btns}</S.Buttons>;
  };

  render() {
    const { hintMsg, type, tabs } = this.props;

    return (
      <S.Dialog
        className={ROOT}
        title={msg().Exp_Clbl_Vendor}
        hide={this.props.onClickHideDialogButton}
        footer={
          <DialogFrame.Footer
            sub={
              <LabelWithHint
                text={(hintMsg && msg().Exp_Lbl_Hint) || ''}
                hintMsg={hintMsg}
                infoAlign="left"
              />
            }
          >
            <Button type="default" onClick={this.props.onClickHideDialogButton}>
              {msg().Com_Btn_Cancel}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <S.Inner>
          {this.renderButtonGroup(tabs, type)}
          {this.renderMainContent(type)}
        </S.Inner>
      </S.Dialog>
    );
  }
}
