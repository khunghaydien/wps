import * as React from 'react';

import { Form } from 'formik';
import { assign, cloneDeep, find, get, isEmpty, isNil, map } from 'lodash';
import moment from 'moment';

import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import FormatUtil from '@apps/commons/utils/FormatUtil';
import { updateValues } from '@apps/commons/utils/FormikUtils';
import IconButton from '@commons/components/buttons/IconButton';
import ImgEditDisabled from '@commons/images/btnEditDisabled.svg';
import ImgEditOn from '@commons/images/btnEditOn.svg';
import Alert from '@mobile/components/molecules/commons/Alert';
import AmountInputField from '@mobile/components/molecules/commons/Fields/AmountInputField';
import SearchButtonField from '@mobile/components/molecules/commons/Fields/SearchButtonField';
import SelectField from '@mobile/components/molecules/commons/Fields/SelectField';
import SFDateField from '@mobile/components/molecules/commons/Fields/SFDateField';
import TextField from '@mobile/components/molecules/commons/Fields/TextField';
import Navigation from '@mobile/components/molecules/commons/Navigation';
import ViewItem from '@mobile/components/molecules/commons/ViewItem';

import { AttachedFile } from '@apps/domain/models/common/AttachedFile';
import {
  AccountingPeriodOption,
  AccountingPeriodOptionList,
} from '@apps/domain/models/exp/AccountingPeriod';
import {
  DefaultCostCenter,
  LatestCostCenter,
} from '@apps/domain/models/exp/CostCenter';
import { CustomHint } from '@apps/domain/models/exp/CustomHint';
import {
  ExpenseReportType,
  ExpenseReportTypeList,
} from '@apps/domain/models/exp/expense-report-type/list';
import {
  ExtendItemInfo,
  getEIsOnly,
  getExtendedItemArray,
} from '@apps/domain/models/exp/ExtendedItem';
import {
  ALLOWED_MIME_TYPES,
  Base64FileList,
  FileMetadata,
  getMetadata,
  MAX_FILE_SIZE,
} from '@apps/domain/models/exp/Receipt';
import { RecordUpdateInfoList } from '@apps/domain/models/exp/Record';
import {
  ATTACHMENT_MAX_COUNT,
  calcTotalAmount,
  FILE_ATTACHMENT_TYPE,
  getDisplayOfCR,
  getDisplayOfVendorCCJob,
  initailVendorData,
  initialCustomRequestData,
  Report,
} from '@apps/domain/models/exp/Report';
import {
  getJctRegistrationNumber,
  VENDOR_PAYMENT_DUE_DATE_USAGE,
} from '@apps/domain/models/exp/Vendor';
import { UserSetting } from '@apps/domain/models/UserSetting';

import { DefaultCostCenterInfo } from '@mobile/modules/expense/entities/defaultCostCenterList';

import { AppAction } from '@apps/mobile-app/action-dispatchers/AppThunk';

import TextButton from '@mobile/components/atoms/TextButton';
import Wrapper from '@mobile/components/atoms/Wrapper';
import PreRequestArea from '@mobile/components/molecules/expense/PreRequestArea';
import InfoDialog from '@mobile/components/organisms/expense/UpdateInfoDialog';

import { renderSubtotalAmount } from '../Detail';
import Attachment from './Attachment';

import './index.scss';

const ROOT = 'mobile-app-pages-expense-page-report-edit';

export type Props = {
  accountingPeriodList: AccountingPeriodOptionList;
  userSetting: UserSetting;
  expReportTypeList: ExpenseReportTypeList;
  reportTypeListOption: ExpenseReportTypeList;
  targetExpReport: Report;
  values: {
    ui: Record<string, any>;
    report: Report;
  };
  errors: string[];
  touched: Record<string, any>;
  defaultCostCenter: Array<DefaultCostCenterInfo>;
  formValues: Record<string, any>;
  setValues: (values: Props['values']) => void;
  setTouched: (value: Record<string, any>) => void;
  saveReportFormValues: (arg0: Report) => void;
  onClickCancelButton: () => void;
  handleSubmit: () => void;
  onClickSearchCostCenter: (arg0: string) => void;
  onClickSearchVendor: () => void;
  onClickSearchJob: (arg0: string) => void;
  onClickSearchCustomRequest?: () => void;
  reportId: string;
  onClickSearchCustomEI: (
    arg0: string,
    arg1: string,
    arg2: string,
    arg3: string
  ) => void;
  getBase64files: (
    e: React.FormEvent<HTMLInputElement>
  ) => AppAction<Promise<Base64FileList>>;
  saveFileMetadata: (fileMetadata: FileMetadata) => void;
  uploadReceipts: (list: Base64FileList) => AppAction<
    Promise<
      Array<{
        contentVersionId: string;
        contentDocumentId: string;
      }>
    >
  >;
  // Custom Hint
  activeHints: Array<string>;
  customHints: CustomHint;
  onClickHint: (arg0: string) => void;
  openReceiptLibrary: (attachedFiles: string[]) => void;
  updateReportTypeList: (targetDate: string) => Promise<ExpenseReportTypeList>;
  getLatestHistoryCostCenter: (
    historyId: string,
    targetDate: string
  ) => Promise<LatestCostCenter | boolean>;
  searchDefaultCoastCenter: (
    arg0: string,
    arg1: string
  ) => AppAction<Promise<DefaultCostCenter>>;
  setFieldValue: (arg0: string, arg1: any, arg2?: boolean) => void;
  // Update Info
  recordUpdateInfo: RecordUpdateInfoList;
  clearRecordUpdateInfo: () => void;
  isRequest?: boolean;
};

type State = {
  errorMessages: string[];
  isExceedNumber: boolean;
  largeFiles: string[];
  invalidFiles: string[];
};
export default class ReportEditPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      errorMessages: [],
      isExceedNumber: false,
      largeFiles: [],
      invalidFiles: [],
    };
    this.onChangeExpReportType = this.onChangeExpReportType.bind(this);
    this.onChangeReportUnTypeSafely =
      this.onChangeReportUnTypeSafely.bind(this);
    this.onChangeReport = this.onChangeReport.bind(this);
    this.onClickDeleteCCButton = this.onClickDeleteCCButton.bind(this);
    this.onClickDeleteJobButton = this.onClickDeleteJobButton.bind(this);
  }

  componentDidMount() {
    if (this.isSelectedApInactive()) {
      this.setState(({ errorMessages }) => ({
        errorMessages: errorMessages.concat(
          msg().Exp_Err_AccountingPeriodInactiveReselect
        ),
      }));
    }
  }

  componentDidUpdate(prevProps: Props) {
    // toggle inactive accounting period error message
    const { values } = this.props;
    if (
      prevProps.values.report.accountingPeriodId !==
      values.report.accountingPeriodId
    ) {
      const inactiveErrMessage = msg().Exp_Err_AccountingPeriodInactiveReselect;
      this.setState(({ errorMessages }) => ({
        errorMessages: this.isSelectedApInactive()
          ? errorMessages.concat(inactiveErrMessage)
          : errorMessages.filter((message) => message !== inactiveErrMessage),
      }));
    }
  }

  async onChangeExpReportType(
    e: React.SyntheticEvent<HTMLSelectElement, Event>
  ) {
    const reportTypeId = e.currentTarget.value;
    const selectedReportType = find(this.props.expReportTypeList, {
      id: reportTypeId,
    }) as ExpenseReportType;
    const originalReportValues = this.props.values.report;
    // if cost center/job is unused, remove the existing value
    const {
      isCostCenterVisible,
      isCostCenterRequired,
      isJobVisible,
      isJobRequired,
      isVendorVisible,
      isVendorRequired,
    } = getDisplayOfVendorCCJob(selectedReportType);
    const { isCustomRequestVisible, isCustomRequestRequired } =
      getDisplayOfCR(selectedReportType);

    let initialJobData = {};
    if (!isJobVisible) {
      initialJobData = {
        jobId: null,
        jobCode: '',
        jobName: null,
      };
    }

    const resetVendorData = isVendorVisible ? {} : initailVendorData;

    let initialCostCenterData = {};
    if (!isCostCenterVisible) {
      initialCostCenterData = {
        costCenterName: null,
        costCenterCode: '',
        costCenterHistoryId: null,
      };
    } else {
      const dateKey = this.getDateKey();
      const reportDate = get(this.props.values, `report.${dateKey}`);
      const currentCC = get(this.props.values, 'report.costCenterCode');
      const isUpdateDefaultCC =
        !get(this.props.formValues, 'isCostCenterChangedManually') ||
        isEmpty(currentCC);
      if (reportDate && isUpdateDefaultCC) {
        const fetchedDefaultCC = find(this.props.defaultCostCenter, {
          date: reportDate,
        });
        if (!fetchedDefaultCC) {
          const updateValue = await this.props.searchDefaultCoastCenter(
            this.props.userSetting.employeeId,
            reportDate
          );
          initialCostCenterData = updateValue[0];
        } else {
          initialCostCenterData = fetchedDefaultCC.costCenter;
        }
        this.props.saveReportFormValues(
          assign(this.props.formValues, {
            ...this.props.values.report,
            expReportTypeId: reportTypeId,
            expReportTypeName: selectedReportType.name,
            isCostCenterChangedManually: false,
            ...initialCostCenterData,
          })
        );
      }
    }

    let updatedReceiptData = {
      useFileAttachment: selectedReportType.useFileAttachment,
      isFileAttachmentRequired:
        selectedReportType.fileAttachment === FILE_ATTACHMENT_TYPE.Required,
    };
    if (!selectedReportType.useFileAttachment) {
      updatedReceiptData = {
        ...updatedReceiptData,
        ...{ attachedFileList: [] },
      };
    }

    let customRequestData = {};
    if (!isCustomRequestVisible) {
      customRequestData = initialCustomRequestData;
    }

    // this.setExpenseTypeError(selectedReportType.id);
    const updatedExtendedData = getEIsOnly(
      selectedReportType,
      originalReportValues
    );
    const newReportOfValues = [...Array(10).keys()]
      .map((index) => `${index + 1}`.padStart(2, '0'))
      .reduce(
        (report: Record<string, any>) => ({
          ...report,
          expReportTypeId: reportTypeId,
          expReportTypeName: selectedReportType.name,
          ...initialJobData,
          ...resetVendorData,
          ...initialCostCenterData,
          ...updatedExtendedData,
          ...updatedReceiptData,
          ...customRequestData,
          isCostCenterRequired,
          isJobRequired,
          isCustomRequestRequired,
          isVendorRequired,
        }),
        this.props.values.report
      );
    const { touched, values } = updateValues(
      this.props.values,
      this.props.touched,
      {
        report: newReportOfValues,
      }
    );
    this.props.setValues(values);
    this.props.setTouched(touched);
  }

  onChangeReportUnTypeSafely(key: string) {
    return (e: React.SyntheticEvent<HTMLSelectElement, Event>) => {
      const { values, touched } = updateValues(
        this.props.values,
        this.props.touched,
        {
          report: {
            ...this.props.values.report,
            [key]: e.currentTarget.value,
          },
        }
      );
      this.props.setValues(values);
      this.props.setTouched(touched);
    };
  }

  onChangeReport(key: keyof Report) {
    return (e: React.SyntheticEvent<HTMLSelectElement, Event>) => {
      this.onChangeReportUnTypeSafely(key)(e);
    };
  }

  onChangeTotalAmount = (amount: number | string) => {
    this.updateReportValues({ totalAmount: Number(amount) });
  };

  onClickDeleteCCButton() {
    const { touched, values } = updateValues(
      this.props.values,
      this.props.touched,
      {
        report: {
          ...this.props.values.report,
          costCenterName: null,
          costCenterHistoryId: null,
          costCenterCode: null,
        },
      }
    );
    this.props.setValues(values);
    this.props.setTouched(touched);
  }

  onClickDeleteJobButton() {
    const { touched, values } = updateValues(
      this.props.values,
      this.props.touched,
      {
        report: {
          ...this.props.values.report,
          jobName: null,
          jobId: null,
        },
      }
    );
    this.props.setValues(values);
    this.props.setTouched(touched);
  }

  onClickDeleteVendorButton = () => {
    const { touched, values } = updateValues(
      this.props.values,
      this.props.touched,
      {
        report: {
          ...this.props.values.report,
          vendorName: null,
          vendorId: null,
          vendorCode: null,
          paymentDueDate: null,
          paymentDueDateUsage: null,
        },
      }
    );
    this.props.setValues(values);
    this.props.setTouched(touched);
  };

  onClickDeletePaymentDueDate = () => {
    const { touched, values } = updateValues(
      this.props.values,
      this.props.touched,
      {
        report: {
          ...this.props.values.report,
          paymentDueDate: null,
        },
      }
    );
    this.props.setValues(values);
    this.props.setTouched(touched);
  };

  onClickDeleteCustomEIButton(index: string) {
    const { touched, values } = updateValues(
      this.props.values,
      this.props.touched,
      {
        report: {
          ...this.props.values.report,
          [`extendedItemLookup${index}Value`]: null,
          [`extendedItemLookup${index}SelectedOptionName`]: null,
        },
      }
    );
    this.props.setValues(values);
    this.props.setTouched(touched);
  }

  onClickDeleteCustomRequestButton = (): void => {
    const { touched, values } = updateValues(
      this.props.values,
      this.props.touched,
      {
        report: {
          ...this.props.values.report,
          ...initialCustomRequestData,
        },
      }
    );
    this.props.setValues(values);
    this.props.setTouched(touched);
  };

  onOpenReceiptLibrary = () => {
    const files = this.props.values.report.attachedFileList || [];
    const attachedFiles = files.map((file) => file.attachedFileVerId);
    this.props.saveReportFormValues(this.props.values.report);
    this.props.openReceiptLibrary(attachedFiles);
  };

  getDateKey = (): string =>
    this.props.isRequest ? 'scheduledDate' : 'accountingDate';

  isSelectedApInactive = (): boolean => {
    const { values, accountingPeriodList } = this.props;
    if (!accountingPeriodList) return false;
    const currentAp = accountingPeriodList.find(
      (accountingPeriod) =>
        accountingPeriod.id === values.report.accountingPeriodId
    );
    return currentAp && !currentAp.active;
  };

  handleAccountingPeriodChange = async (
    e: React.SyntheticEvent<HTMLSelectElement, Event>,
    date?: Date | ''
  ) => {
    let recordDate;
    let selectedAPId;
    if (date) {
      recordDate = DateUtil.formatISO8601Date(date);
    } else {
      const selectedAP =
        find(this.props.accountingPeriodList, {
          value: e.currentTarget.value,
        }) || ({} as AccountingPeriodOption);
      recordDate = selectedAP.recordDate;
      selectedAPId = selectedAP.value;
    }
    if (!recordDate) {
      return;
    }
    const dateKey = this.getDateKey();
    const curAPDate = get(this.props.values, `report.${dateKey}`);
    const reportTypeId = get(this.props.values, 'report.expReportTypeId');
    const currentCC = get(this.props.values, 'report.costCenterCode');

    const updateInfo = {
      accountingPeriodId: selectedAPId,
      [dateKey]: recordDate,
    };

    if (recordDate && recordDate !== curAPDate) {
      // update report type list if accounting period change triggers employee group change
      const reportTypeList = await this.props.updateReportTypeList(recordDate);
      const isReportTypeExist = find(reportTypeList, ['id', reportTypeId]);
      const isReportTypeUseCC =
        isReportTypeExist &&
        isReportTypeExist.isCostCenterRequired !== 'UNUSED';
      const isCCManuallyChanged = get(
        this.props.formValues,
        'isCostCenterChangedManually'
      );
      const isUpdateDefaultCC = !isCCManuallyChanged || isEmpty(currentCC);

      // rest to null if report type is invalidlid case
      if (!isReportTypeExist) {
        assign(updateInfo, {
          expReportTypeId: null,
          expReportTypeName: '',
        });
      }

      let defaultCC;
      if (!isEmpty(recordDate) && isReportTypeUseCC) {
        const fetchedDefaultCC = find(this.props.defaultCostCenter, {
          date: recordDate,
        });

        const defaultCostCenter = !fetchedDefaultCC
          ? (
              await this.props.searchDefaultCoastCenter(
                this.props.userSetting.employeeId,
                recordDate
              )
            )[0]
          : fetchedDefaultCC.costCenter;

        if (
          isUpdateDefaultCC ||
          defaultCostCenter.costCenterCode === currentCC
        ) {
          defaultCC = {
            ...defaultCostCenter,
            isCostCenterChangedManually: false,
          };
        } else {
          // get latest cc if there is an existing cc selected and no default cc
          const currentHistoryId = get(
            this.props.values,
            'report.costCenterHistoryId'
          );
          const latestCostCenter =
            (await this.props.getLatestHistoryCostCenter(
              currentHistoryId,
              recordDate
            )) || {};
          const { baseCode, id, name } = latestCostCenter as LatestCostCenter;
          defaultCC = {
            costCenterCode: baseCode,
            costCenterHistoryId: id,
            costCenterName: name,
            isCostCenterChangedManually: true,
          };
        }

        assign(updateInfo, {
          ...defaultCC,
        });
        this.props.saveReportFormValues(
          assign(this.props.formValues, {
            ...this.props.values.report,
            ...updateInfo,
          })
        );
      }

      // In case it's updating the date,
      // the selected report type EI is needed to be updated again
      const selectedReportType = find(this.props.expReportTypeList, {
        id: reportTypeId,
      }) as ExpenseReportType;
      const originalReportValues = this.props.values.report;
      const updatedExtendedData = getEIsOnly(
        selectedReportType,
        originalReportValues
      );
      assign(updateInfo, {
        ...updatedExtendedData,
      });
    }
    const updateRes = updateValues(this.props.values, this.props.touched, {
      report: {
        ...this.props.values.report,
        ...updateInfo,
      },
    });
    this.props.setValues(updateRes.values);
    this.props.setTouched(updateRes.touched);
  };

  updateReportValues = (updateObj: Record<string, any>) => {
    const { values, touched } = updateValues(
      this.props.values,
      this.props.touched,
      {
        report: {
          ...this.props.values.report,
          ...updateObj,
        },
      }
    );
    this.props.setValues(values);
    this.props.setTouched(touched);
  };

  handleAttachFile = (e: React.FormEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files);
    // @ts-ignore
    this.props.getBase64files(e).then((base64Files) => {
      const original = this.props.values.report.attachedFileList || [];

      const isExceedNumber =
        base64Files.length + original.length > ATTACHMENT_MAX_COUNT;
      const largeFiles = base64Files
        .filter((file) => file.size > MAX_FILE_SIZE)
        .map((file) => file.name);
      const invalidFiles = base64Files
        .filter((file) => !ALLOWED_MIME_TYPES.includes(file.type))
        .map((file) => file.name);

      this.setState({ largeFiles, invalidFiles, isExceedNumber });

      if (isExceedNumber || !isEmpty(largeFiles) || !isEmpty(invalidFiles)) {
        return;
      }

      // @ts-ignore
      this.props.uploadReceipts(base64Files).then((res) => {
        if (res) {
          const appendedFiles = res.map((info, index) => ({
            attachedFileId: info.contentDocumentId,
            attachedFileVerId: info.contentVersionId,
            attachedFileDataType: base64Files[index].type,
            attachedFileName: `Receipt_${base64Files[index].name}`, // add prefix so that consistent with when select from receipt library
          }));
          const attachedFileList = [...original, ...appendedFiles];
          this.updateReportValues({ attachedFileList });

          // save metadata for multi files
          files.forEach(async (file, index) => {
            const { contentDocumentId } = res[index];
            const metadata = await getMetadata(file);
            if (metadata) {
              this.props.saveFileMetadata({
                ...metadata,
                contentDocumentId,
              });
            }
          });
        }
      });
    });
  };

  handleDeleteFile = (file: AttachedFile) => {
    this.setState({
      isExceedNumber: false,
      largeFiles: [],
      invalidFiles: [],
    });

    const originalList = this.props.values.report.attachedFileList || [];
    const attachedFileList = originalList.filter(
      (original) => original.attachedFileVerId !== file.attachedFileVerId
    );
    this.updateReportValues({ attachedFileList });
  };

  setExpenseTypeError(id: string) {
    const {
      expReportTypeList,
      values: {
        report: { records },
      },
    } = this.props;

    const selectedReportType = find(expReportTypeList, { id });
    const availableExpTypes =
      (selectedReportType && selectedReportType.expTypeIds) || [];
    const recordList = records ? records.map((x) => x.items[0]) : [];

    const usedExpType = recordList.map(({ expTypeId, expTypeName }) => ({
      expTypeId,
      expTypeName,
    }));

    const invalidExpTypes = usedExpType
      .filter((x) => availableExpTypes.indexOf(x.expTypeId) < 0)
      .map((x) => x.expTypeName);

    const expenseTypeError = `${
      msg().Exp_Warn_InvalidRecordExpenseTypeForReportTypeMobile
    } ${invalidExpTypes.join(', ')}`;

    this.setState({
      errorMessages: invalidExpTypes.length > 0 ? [expenseTypeError] : [],
    });
  }

  handleDateChange = async (date: Date | '', key: string) => {
    const formattedDate = (date && moment(date).format('YYYY-MM-DD')) || date;
    const { touched, values } = updateValues(
      this.props.values,
      this.props.touched,
      {
        report: {
          ...this.props.values.report,
          [key]: formattedDate,
        },
      }
    );
    this.props.setValues(values);
    this.props.setTouched(touched);
  };

  setError(field: string): string[] {
    const error: string = get(this.props.errors, field);
    const isFieldTouched: boolean = get(this.props.touched, field);
    return error && isFieldTouched ? [error] : [];
  }

  buildOptionList(
    picklist: Array<{ value: string; label: string }>
  ): Array<{ value: string | number | null; label: string }> {
    const optionList = picklist.map((pick) => ({
      value: pick.value || '',
      label: pick.label,
    }));
    return [{ value: '', label: msg().Exp_Lbl_PleaseSelect }, ...optionList];
  }

  getExtendedItemInfo(
    range: string[],
    source: Record<string, any>,
    fieldPrefix: string
  ) {
    return range.reduce(
      (acc, index) =>
        isNil(source[`${fieldPrefix}${index}Id`])
          ? acc
          : [
              ...acc,
              {
                id: source[`${fieldPrefix}${index}Id`],
                info: source[`${fieldPrefix}${index}Info`],
                value: source[`${fieldPrefix}${index}Value`],
                idx: index,
              },
            ],
      []
    );
  }

  getReportTypeList() {
    let rtl = this.props.reportTypeListOption;
    const selectedReportTypeId = this.props.values.report.expReportTypeId;
    const reportId = this.props.values.report.reportId;
    if (reportId && rtl.findIndex((x) => x.id === selectedReportTypeId) < 0) {
      // @ts-ignore
      rtl = [{ id: '', name: '' }].concat(rtl);
    }
    const t = map(rtl, (o: any) => {
      return {
        value: o.id,
        label: o.name,
      };
    });
    return t;
  }

  getCustomHintProps = (fieldName: string, disabled?: boolean) => ({
    hintMsg: !disabled ? this.props.customHints[fieldName] : '',
    isShowHint: this.props.activeHints.includes(fieldName),
    onClickHint: () => this.props.onClickHint(fieldName),
  });

  getCustomHintforEI = (id: string, info: ExtendItemInfo) => ({
    hintMsg: info.description,
    isShowHint: this.props.activeHints.includes(id),
    onClickHint: () => this.props.onClickHint(id),
  });

  getApOptionList = (
    accountingPeriodOptionList: AccountingPeriodOptionList
  ): Array<{ label: string; value: string; disabled: boolean }> => {
    const optionsList = this.isSelectedApInactive()
      ? cloneDeep(accountingPeriodOptionList)
      : // remove unselected inactive accounting period
        accountingPeriodOptionList.filter((apOption) => apOption.active);

    const apOptionList = optionsList.map((option) => ({
      label: option.label,
      value: option.value,
      disabled: !option.active,
    }));
    apOptionList.unshift(
      // @ts-ignore
      <option key="default-blank-option" value="" className="is-hidden" />
    );
    return apOptionList;
  };

  toggleTotalAmountEditMode = () => {
    const {
      userSetting: { currencyDecimalPlaces },
      values: { report },
    } = this.props;

    const isNewEstimated = !report.isEstimated;
    const totalAmount = isNewEstimated
      ? report.totalAmount
      : calcTotalAmount(report, currencyDecimalPlaces);

    this.updateReportValues({
      isEstimated: isNewEstimated,
      totalAmount,
    });
  };

  renderEditButton = () => {
    const {
      isRequest,
      values: { report },
    } = this.props;

    if (!isRequest) return null;

    const imgEdit = report.isEstimated ? ImgEditDisabled : ImgEditOn;
    const imgEditAlt = report.isEstimated ? 'ImgEditOff' : 'ImgEditOn';
    return (
      <IconButton
        alt={imgEditAlt}
        className={`${ROOT}__edit-btn`}
        onClick={this.toggleTotalAmountEditMode}
        src={imgEdit}
        srcType="svg"
      />
    );
  };

  renderTotalAmount = () => {
    const {
      isRequest,
      userSetting: {
        currencySymbol,
        currencyDecimalPlaces,
        expDisplayTaxDetailsSetting,
      },
      values: { report },
    } = this.props;

    const subAmountClassName = isRequest ? `${ROOT}__sub-amount` : '';
    return (
      <>
        {!isRequest ? (
          <ViewItem label={msg().Exp_Lbl_TotalAmount}>
            <p className={`${ROOT}__amount-text`}>
              {`${currencySymbol} ${FormatUtil.formatNumber(
                report.totalAmount,
                currencyDecimalPlaces
              )}`}
            </p>
          </ViewItem>
        ) : (
          <div className={`${ROOT}__total-amount-area`}>
            <AmountInputField
              className={`${ROOT}__total-amount-area-input`}
              decimalPlaces={currencyDecimalPlaces}
              disabled={!report.isEstimated}
              label={msg().Exp_Lbl_TotalAmount}
              onBlur={this.onChangeTotalAmount}
              value={report.totalAmount}
            />
            {this.renderEditButton()}
          </div>
        )}

        <div className={`${ROOT}__subtotal-area`}>
          {renderSubtotalAmount(
            currencySymbol,
            currencyDecimalPlaces,
            this.props.targetExpReport.records,
            expDisplayTaxDetailsSetting,
            ROOT,
            subAmountClassName
          )}
        </div>
      </>
    );
  };

  render() {
    const {
      recordUpdateInfo,
      userSetting: {
        currencySymbol,
        currencyDecimalPlaces,
        jctInvoiceManagement: useJctRegistrationNumber,
      },
      values: { report },
    } = this.props;

    const accountingPeriodList = this.props.accountingPeriodList || [];
    const selectedAccountingPeriod =
      (report.accountingPeriodId &&
        find(accountingPeriodList, {
          value: report.accountingPeriodId,
        })) ||
      ({} as AccountingPeriodOption);

    const selectedReportType =
      find(this.props.expReportTypeList, {
        id: report.expReportTypeId,
      }) || ({} as ExpenseReportType);

    const {
      isCostCenterVisible,
      isCostCenterRequired,
      isJobVisible,
      isJobRequired,
      isVendorVisible,
      isVendorRequired,
    } = getDisplayOfVendorCCJob(selectedReportType);
    const { isCustomRequestVisible, isCustomRequestRequired } =
      getDisplayOfCR(selectedReportType);

    const isFileAttachmentVisible =
      selectedReportType && selectedReportType.useFileAttachment;
    const isShowCustomRequest = !this.props.isRequest && isCustomRequestVisible;
    const hasError = this.state.errorMessages.length > 0;
    const isReportFromRequest = !!report.preRequestId;
    const isExistingReport =
      this.props.reportId && this.props.reportId !== 'null';
    const isCreatingReportHeader =
      !isExistingReport && isEmpty(this.props.values.report.records);

    const showPaymentDate =
      report.vendorId &&
      report.paymentDueDateUsage !== VENDOR_PAYMENT_DUE_DATE_USAGE.NotUsed;

    return (
      <Wrapper className={ROOT}>
        <Navigation
          className={`${ROOT}__navigation`}
          title={
            isExistingReport
              ? msg().Exp_Lbl_ReportEdit
              : msg().Exp_Lbl_CreateReport
          }
          backButtonLabel={
            isExistingReport || isCreatingReportHeader
              ? msg().Com_Btn_Cancel
              : msg().Exp_Lbl_BackToRecordSelection
          }
          onClickBack={() => {
            this.props.onClickCancelButton();
          }}
          actions={[
            <TextButton
              type="submit"
              onClick={this.props.handleSubmit}
              disabled={hasError}
            >
              {msg().Com_Btn_Save}
            </TextButton>,
          ]}
        />
        <Form className="main-content">
          {this.state.errorMessages.length > 0 && (
            <Alert
              className={`${ROOT}__alert`}
              variant="warning"
              message={this.state.errorMessages}
            />
          )}

          {isReportFromRequest && (
            <PreRequestArea
              preRequest={report.preRequest}
              baseCurrencySymbol={currencySymbol}
              baseCurrencyDecimal={currencyDecimalPlaces}
            />
          )}

          <section className={`${ROOT}__input`}>
            <TextField
              required
              label={msg().Exp_Clbl_ReportTitle}
              onChange={this.onChangeReport('subject')}
              errors={this.setError('report.subject')}
              value={report.subject}
            />
          </section>

          {accountingPeriodList.length > 0 && (
            <div>
              <section className={`${ROOT}__input option-hidden`}>
                <SelectField
                  required
                  label={msg().Exp_Clbl_AccountingPeriod}
                  errors={this.setError('report.accountingPeriodId')}
                  onChange={this.handleAccountingPeriodChange}
                  options={this.getApOptionList(accountingPeriodList)}
                  value={selectedAccountingPeriod.value}
                  {...this.getCustomHintProps('reportHeaderAccountingPeriod')}
                />
              </section>

              <section className={`${ROOT}__input`}>
                <ViewItem label={msg().Exp_Clbl_RecordDate}>
                  {DateUtil.dateFormat(
                    selectedAccountingPeriod.recordDate || ''
                  )}
                </ViewItem>
              </section>
            </div>
          )}

          <section className={`${ROOT}__input`}>
            {isReportFromRequest ? (
              <>
                <TextField
                  label={msg().Exp_Clbl_ReportType}
                  errors={this.setError('report.expReportTypeId')}
                  value={get(report, 'expReportTypeName') || ''}
                  disabled
                  {...this.getCustomHintProps('reportHeaderReportType')}
                />
                <div className="hint_message">
                  {msg().Exp_Msg_ReportTypeInfoForExpense}
                </div>
              </>
            ) : (
              <SelectField
                required
                label={msg().Exp_Clbl_ReportType}
                errors={this.setError('report.expReportTypeId')}
                onChange={this.onChangeExpReportType}
                options={this.getReportTypeList()}
                value={report.expReportTypeId}
                {...this.getCustomHintProps('reportHeaderReportType')}
              />
            )}
          </section>

          {accountingPeriodList.length < 1 && (
            <section className={`${ROOT}__input`}>
              <SFDateField
                required
                label={
                  this.props.isRequest
                    ? msg().Exp_Clbl_ScheduledDate
                    : msg().Exp_Clbl_RecordDate
                }
                errors={this.setError(`report.${this.getDateKey()}`)}
                onChange={(e, { date }) =>
                  this.handleAccountingPeriodChange(e, date)
                }
                value={report[this.getDateKey()]}
                {...this.getCustomHintProps('reportHeaderRecordDate')}
              />
            </section>
          )}

          <section className={`${ROOT}__input`}>
            {this.renderTotalAmount()}
          </section>

          {isShowCustomRequest && (
            <section className={`${ROOT}__input`}>
              <span className={`${ROOT}__custom-request-name`}>
                <SearchButtonField
                  required={isCustomRequestRequired}
                  placeholder={msg().Admin_Lbl_Search}
                  onClick={() => {
                    this.props.saveReportFormValues(report);
                    this.props.onClickSearchCustomRequest();
                  }}
                  onClickDeleteButton={this.onClickDeleteCustomRequestButton}
                  value={report.customRequestName || ''}
                  label={msg().Exp_Lbl_CustomRequest}
                  errors={this.setError('report.customRequestId')}
                />
              </span>
            </section>
          )}

          <section className={`${ROOT}__input`}>
            <TextField
              required={this.props.isRequest}
              label={msg().Exp_Clbl_Purpose}
              onChange={this.onChangeReport('purpose')}
              errors={this.setError('report.purpose')}
              value={report.purpose}
              {...this.getCustomHintProps('reportHeaderPurpose')}
            />
          </section>

          {/* display cost center based on admin setting */}
          {isCostCenterVisible && (
            <section className={`${ROOT}__input`}>
              <SearchButtonField
                required={isCostCenterRequired}
                placeholder={msg().Admin_Lbl_Search}
                disabled={isEmpty(report[this.getDateKey()])}
                onClick={() => {
                  this.props.saveReportFormValues(report);
                  this.props.onClickSearchCostCenter(report[this.getDateKey()]);
                }}
                onClickDeleteButton={this.onClickDeleteCCButton}
                value={report.costCenterName || ''}
                label={msg().Exp_Clbl_CostCenterHeader}
                errors={this.setError('report.costCenterName')}
                {...this.getCustomHintProps('reportHeaderCostCenter')}
              />
            </section>
          )}

          {/* display job based on admin setting */}
          {isJobVisible && (
            <section className={`${ROOT}__input`}>
              <SearchButtonField
                required={isJobRequired}
                disabled={isEmpty(report[this.getDateKey()])}
                placeholder={msg().Admin_Lbl_Search}
                onClick={() => {
                  this.props.saveReportFormValues(report);
                  this.props.onClickSearchJob(report[this.getDateKey()]);
                }}
                onClickDeleteButton={this.onClickDeleteJobButton}
                value={report.jobName || ''}
                label={msg().Exp_Lbl_Job}
                errors={this.setError('report.jobId')}
                {...this.getCustomHintProps('reportHeaderJob')}
              />
            </section>
          )}

          {isVendorVisible && (
            <>
              <section className={`${ROOT}__input`}>
                <SearchButtonField
                  required={isVendorRequired}
                  placeholder={msg().Admin_Lbl_Search}
                  onClick={() => {
                    this.props.saveReportFormValues(report);
                    this.props.onClickSearchVendor();
                  }}
                  onClickDeleteButton={this.onClickDeleteVendorButton}
                  value={report.vendorName || ''}
                  label={msg().Exp_Clbl_Vendor}
                  errors={this.setError('report.vendorId')}
                  {...this.getCustomHintProps('reportHeaderVendor')}
                />
              </section>
              {useJctRegistrationNumber && report.vendorId && (
                <div className={`${ROOT}__vendor-jct`}>{`${
                  msg().Exp_Clbl_JctRegistrationNumber
                }: ${getJctRegistrationNumber(
                  report.vendorJctRegistrationNumber,
                  report.vendorIsJctQualifiedIssuer
                )}`}</div>
              )}
            </>
          )}

          {showPaymentDate && (
            <section className={`${ROOT}__input`}>
              <SFDateField
                useRemoveValueButton
                onClickRemoveValueButton={this.onClickDeletePaymentDueDate}
                required={
                  report.paymentDueDateUsage ===
                  VENDOR_PAYMENT_DUE_DATE_USAGE.Required
                }
                label={msg().Exp_Clbl_PaymentDate}
                errors={this.setError('report.paymentDueDate')}
                onChange={(_e, { date }) => {
                  this.handleDateChange(date, 'paymentDueDate');
                }}
                value={report.paymentDueDate}
              />
            </section>
          )}

          {getExtendedItemArray(this.props.values.report)
            .filter((i) => i.id)
            .map(({ id, info, value, index, name }) => {
              if (!info) {
                return null;
              }

              let $field;
              switch (info.inputType) {
                case 'Text':
                  $field = (
                    <section className={`${ROOT}__input`} key={id}>
                      <TextField
                        required={info.isRequired}
                        label={info.name}
                        errors={this.setError(
                          `report.extendedItemText${index}Value`
                        )}
                        onChange={this.onChangeReportUnTypeSafely(
                          `extendedItemText${index}Value`
                        )}
                        value={value}
                        {...this.getCustomHintforEI(id, info)}
                      />
                    </section>
                  );
                  break;
                case 'Picklist':
                  $field = (
                    <section className={`${ROOT}__input`} key={id}>
                      <SelectField
                        errors={this.setError(
                          `report.extendedItemPicklist${index}Value`
                        )}
                        required={info.isRequired}
                        label={info.name}
                        options={this.buildOptionList(info.picklist)}
                        onChange={this.onChangeReportUnTypeSafely(
                          `extendedItemPicklist${index}Value`
                        )}
                        value={value || ''}
                        {...this.getCustomHintforEI(id, info)}
                      />
                    </section>
                  );
                  break;
                case 'Lookup':
                  $field = (
                    <section className={`${ROOT}__input`} key={id}>
                      <SearchButtonField
                        placeholder={msg().Admin_Lbl_Search}
                        required={info.isRequired}
                        errors={this.setError(
                          `report.extendedItemLookup${index}Value`
                        )}
                        onClick={() => {
                          this.props.saveReportFormValues(report);
                          this.props.onClickSearchCustomEI(
                            id,
                            info.extendedItemCustomId,
                            info.name,
                            index
                          );
                        }}
                        onClickDeleteButton={() =>
                          this.onClickDeleteCustomEIButton(index)
                        }
                        value={name || ''}
                        label={info.name}
                        {...this.getCustomHintforEI(id, info)}
                      />
                    </section>
                  );
                  break;
                case 'Date':
                  const onChangeDateValue = (date) => {
                    this.handleDateChange(
                      date,
                      `extendedItemDate${index}Value`
                    );
                  };

                  $field = (
                    <section className={`${ROOT}__input`} key={id}>
                      <SFDateField
                        key={id}
                        required={info.isRequired}
                        label={info.name}
                        errors={this.setError(
                          `report.extendedItemDate${index}Value`
                        )}
                        onChange={(e, { date }) => onChangeDateValue(date)}
                        value={value || ''}
                        useRemoveValueButton
                        onClickRemoveValueButton={() => onChangeDateValue('')}
                        {...this.getCustomHintforEI(id, info)}
                      />
                    </section>
                  );
                  break;
                default:
                  $field = null;
              }

              return $field;
            })}

          <section className={`${ROOT}__input`}>
            <TextField
              label={msg().Exp_Clbl_ReportRemarks}
              onChange={this.onChangeReport('remarks')}
              errors={this.setError('report.remarks')}
              value={report.remarks}
              {...this.getCustomHintProps('reportHeaderRemarks')}
            />
          </section>

          {isFileAttachmentVisible && (
            <section className={`${ROOT}__input`}>
              <Attachment
                isRequired={report.isFileAttachmentRequired}
                attachedFileList={report.attachedFileList}
                isExceedNumber={this.state.isExceedNumber}
                largeFiles={this.state.largeFiles}
                invalidFiles={this.state.invalidFiles}
                openReceiptLibrary={this.onOpenReceiptLibrary}
                handleAttachFile={this.handleAttachFile}
                handleDeleteFile={this.handleDeleteFile}
                formikError={this.setError('report.attachedFileList')}
              />
            </section>
          )}
        </Form>
        {!isEmpty(recordUpdateInfo) && (
          <InfoDialog
            updateInfo={recordUpdateInfo}
            onClickHideDialogButton={this.props.clearRecordUpdateInfo}
          />
        )}
      </Wrapper>
    );
  }
}
