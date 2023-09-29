import React from 'react';

import classNames from 'classnames';

import VendorDetailWrapper from '../../../../commons/components/exp/VendorDetail/DetailWrapper';
import Spinner from '../../../../commons/components/Spinner';
import msg from '../../../../commons/languages';

import { status } from '../../../../domain/models/exp/Report';
import { ExpRequest } from '../../../../domain/models/exp/request/Report';
import { ExpenseTaxTypeList } from '../../../../domain/models/exp/TaxType';
import { VendorItemList } from '../../../../domain/models/exp/Vendor';
import { FileMetadata } from '@apps/domain/models/exp/Receipt';
import { UserSetting } from '@apps/domain/models/UserSetting';

import { getStatusText } from '../../../../domain/modules/exp/report';
import { SideFile } from '../../../modules/ui/expenses/detail/sideFilePreview';

import ApproveFooter from '../../DetailParts/ApprovalFooterBar';
import CommentHeader from '../../DetailParts/CommentHeader';
import HeaderBar from '../../DetailParts/HeaderBar';
import HistoryTable from '../../DetailParts/HistoryTable';
import RecordsArea from './RecordsArea';
import SideFilePreview from './SideFilePreview';
import Summary from './Summary';

import './index.scss';

type Props = {
  showLoading?: boolean;
  isApexView?: boolean;
  userSetting: UserSetting;
  // ui states
  baseCurrencyCode: string;
  baseCurrencySymbol: string;
  baseCurrencyDecimal: number;
  useImageQualityCheck: boolean;
  comment: string;
  expRequest: ExpRequest;
  fileMetadata: FileMetadata[];
  expTaxTypeList: ExpenseTaxTypeList;
  userPhotoUrl: string;
  RecordItemsDialog: React.FC;
  // event handlers
  onChangeComment: (arg0: string) => void;
  onClickApproveButton: () => void;
  onClickRejectButton: () => void;
  onClickAllOpenRecordButton: () => void;
  onClickAllCloseRecordButton: () => void;
  onClickRecordOpenButton: (arg0: string) => void;
  openNowList: {
    [key: string]: boolean;
  };
  openNowListInitialize: (arg0: { [key: string]: boolean }) => void;
  openRecordItemsConfirmDialog: () => void;
  setSelectedRecord: (arg0: number) => void;
  searchVendorDetail: (vendorId?: string) => Promise<VendorItemList>;
  setSideFile: (file: SideFile) => void;
  hideSideFile: () => void;
  isShowSidePanel: boolean;
  jctInvoiceManagement: boolean;
};

type State = {
  isVendorDetailOpen: boolean;
};

const ROOT = 'approvals-pc-expenses-pre-approval-pane-detail';

export default class Detail extends React.Component<Props, State> {
  scrollable: HTMLDivElement | null | undefined;

  state = {
    isVendorDetailOpen: false,
  };

  UNSAFE_componentWillUpdate(nextProps: Props) {
    if (nextProps.expRequest.requestId !== this.props.expRequest.requestId) {
      const openNowList = nextProps.expRequest.records.reduce((ret, record) => {
        ret[record.recordId] = false;
        return ret;
      }, {});
      this.props.openNowListInitialize(openNowList);
      this.toggleVendorDetail(false);
      this.props.hideSideFile();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.scrollable &&
      prevProps.expRequest.requestId !== this.props.expRequest.requestId
    ) {
      this.scrollable.scrollTop = 0;
    }
  }

  componentWillUnmount() {
    this.props.hideSideFile();
  }

  toggleVendorDetail = (toOpen: boolean) => {
    this.setState({ isVendorDetailOpen: toOpen });
  };

  renderStatus() {
    let message;
    switch (this.props.expRequest.status) {
      case status.PENDING:
        message = msg().Com_Lbl_Pending;
        break;
      case status.REJECTED:
        message = msg().Com_Lbl_Rejected;
        break;
      case status.APPROVED:
        message = msg().Com_Lbl_Approved;
        break;
      default:
        message = '';
    }
    return message;
  }

  render() {
    const { expRequest, isApexView, RecordItemsDialog, isShowSidePanel } =
      this.props;

    const rootClass = classNames(ROOT, {
      [`${ROOT}__apex-page`]: isApexView,
      'with-side-panel': isShowSidePanel,
    });
    const contentClass = classNames(`${ROOT}__content`, {
      'with-side-panel': isShowSidePanel,
    });

    const spinnerForApexDetailView = () =>
      isApexView && <Spinner loading={this.props.showLoading} />;

    // If no approval item were selected
    if (!isApexView && expRequest.requestId === '') {
      return (
        <div className={rootClass}>
          <div className={`${ROOT}__header`}>
            <HeaderBar title={msg().Appr_Lbl_Detail} />
          </div>
        </div>
      );
    }

    return (
      <div className={`${rootClass}`}>
        <div className={contentClass}>
          {isApexView && (
            <div className={`${ROOT}__header`}>
              <HeaderBar
                title={msg().Appr_Lbl_Detail}
                meta={[
                  {
                    label: msg().Appr_Lbl_Status,
                    value: getStatusText(expRequest.status),
                  },
                ]}
              />
            </div>
          )}
          <div
            className={`${ROOT}__scrollable`}
            ref={(scrollable) => {
              this.scrollable = scrollable;
            }}
          >
            <CommentHeader
              value={expRequest.comment}
              employeePhotoUrl={expRequest.employeePhotoUrl}
              employeeName={this.props.expRequest.employeeName}
            />

            <Summary
              expRequest={this.props.expRequest}
              baseCurrencySymbol={this.props.baseCurrencySymbol}
              baseCurrencyDecimal={this.props.baseCurrencyDecimal}
              openVendorDetail={() => this.toggleVendorDetail(true)}
              setSideFile={this.props.setSideFile}
              hideSideFile={this.props.hideSideFile}
              isApexView={isApexView}
              useJctRegistrationNumber={this.props.jctInvoiceManagement}
              expDisplayTaxDetailsSetting={
                this.props.userSetting.expDisplayTaxDetailsSetting
              }
            />

            <RecordsArea
              expRequest={expRequest}
              fileMetadata={this.props.fileMetadata}
              useImageQualityCheck={this.props.useImageQualityCheck}
              baseCurrencyCode={this.props.baseCurrencyCode}
              baseCurrencySymbol={this.props.baseCurrencySymbol}
              baseCurrencyDecimal={this.props.baseCurrencyDecimal}
              openNowList={this.props.openNowList}
              onClickRecordOpenButton={this.props.onClickRecordOpenButton}
              onClickAllOpenRecordButton={this.props.onClickAllOpenRecordButton}
              onClickAllCloseRecordButton={
                this.props.onClickAllCloseRecordButton
              }
              expTaxTypeList={this.props.expTaxTypeList}
              setSelectedRecord={this.props.setSelectedRecord}
              openRecordItemsConfirmDialog={
                this.props.openRecordItemsConfirmDialog
              }
              setSideFile={this.props.setSideFile}
              hideSideFile={this.props.hideSideFile}
              isApexView={isApexView}
              useJctRegistrationNumber={this.props.jctInvoiceManagement}
            />

            <HistoryTable
              historyList={this.props.expRequest.historyList}
              isExp
            />
          </div>
          {this.props.expRequest.status === status.PENDING && (
            <ApproveFooter
              comment={this.props.comment}
              onChangeApproveComment={this.props.onChangeComment}
              onClickRejectButton={this.props.onClickRejectButton}
              onClickApproveButton={this.props.onClickApproveButton}
              userPhotoUrl={this.props.userPhotoUrl}
            />
          )}
        </div>

        <SideFilePreview hideSideFile={this.props.hideSideFile} />

        {this.state.isVendorDetailOpen && (
          <VendorDetailWrapper
            vendorId={expRequest.vendorId}
            searchVendorDetail={this.props.searchVendorDetail}
            closePanel={() => this.toggleVendorDetail(false)}
            isApproval
            useJctRegistrationNumber={this.props.jctInvoiceManagement}
          />
        )}
        <RecordItemsDialog />
        {spinnerForApexDetailView()}
      </div>
    );
  }
}
