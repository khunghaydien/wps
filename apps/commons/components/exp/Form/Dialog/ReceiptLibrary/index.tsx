import React from 'react';

import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import {
  isPDF,
  previewUrl,
  SelectedReceipt,
  VALID_EXTENSIONS,
  VALID_OCR_EXTENSIONS,
} from '../../../../../../domain/models/exp/Receipt';
import { ReceiptList } from '../../../../../../domain/models/exp/receipt-library/list';

import FileUtil from '../../../../../utils/FileUtil';

import msg from '../../../../../languages';
import Button from '../../../../buttons/Button';
import DialogFrame from '../../../../dialogs/DialogFrame';
import { DropzoneFile } from '../../../../fields/Dropzone';
import LabelWithHint from '../../../../fields/LabelWithHint';
import ProgressBar, {
  PROGRESS_STATUS,
  ProgressBarStep,
} from '../../../../ProgressBar';
import DropZoneArea from './DropZoneArea';
import ImageDisplayArea from './ImageDisplayArea';

import './index.scss';

const ROOT = 'ts-expenses-modal-receipt-library';

export type Props = {
  hintMsg?: string;
  isLoading: boolean;
  isMaxCountSelected?: boolean;
  isMultiStep?: boolean;
  isReportReceipt?: boolean;
  mainButtonTitle: string;
  maxSelectionCount: number;
  progressBar: Array<ProgressBarStep>;
  receiptList: ReceiptList;
  selectedReceipt: Array<SelectedReceipt>;
  title: string;
  deleteReceipt: (receiptId: string, dataType: string) => void;
  executeOcr: (arg0: string) => void;
  executePdfSubPageOcr?: (pdfContentDocId: string) => void;
  getReceipts: (arg0: boolean, arg1: boolean) => void;
  getScannedPdfBase64List?: (
    selectedPdfIdsList: SelectedPdfIdsList
  ) => Promise<void>;
  onClickReceiptLibrayCloseButton: () => void;
  onClickSelectReceipt: (arg0: Record<string, any>) => void;
  onImageDrop: (files: File, runOCR: boolean) => Promise<any>;
  openDetailConfirmDialog: () => void;
  setProgressBar: (arg0: Array<ProgressBarStep>) => Record<string, unknown>;
  setSelectedReceipt: (arg0: SelectedReceipt) => void;
};

export type SelectedPdfIdsList = {
  receiptFileId: string;
  receiptId: string;
}[];

type State = {
  errorMsg: string;
  imageUrlList: Array<Record<string, any>>;
  isFullDropZone: boolean;
  isUploading: boolean;
};
export default class ReceiptDialog extends React.Component<Props, State> {
  state = {
    imageUrlList: [],
    errorMsg: '',
    isFullDropZone: false,
    isUploading: false,
  };

  componentDidMount() {
    const { selectedReceipt } = this.props;
    if (this.props.isMultiStep) {
      const receiptSelectionStatus = get(selectedReceipt, '0.receiptFileId')
        ? PROGRESS_STATUS.ACTIVE
        : PROGRESS_STATUS.SELECTED;
      const steps = [
        {
          id: '1',
          text: msg().Exp_Lbl_ReceiptSelection,
          status: receiptSelectionStatus,
        },
        {
          id: '2',
          text: msg().Exp_Lbl_ConfirmReceipt,
          status: PROGRESS_STATUS.INACTIVE,
        },
        {
          id: '3',
          text: msg().Exp_Lbl_ExpenseTypeSelect,
          status: PROGRESS_STATUS.INACTIVE,
        },
      ];
      this.props.setProgressBar(steps);
    }
    window.addEventListener('mouseout', this.onDragLeave);
    window.addEventListener('mouseup', this.onDragLeave);
    window.addEventListener('drop', this.onDragLeave);
    window.addEventListener('dragenter', this.onDragEnter);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { receiptList } = nextProps;
    if (receiptList !== this.props.receiptList && !this.state.isUploading) {
      this.setState({
        imageUrlList: Array(receiptList.length).fill({}),
      });
      this.setState((prevState) => {
        const list = prevState.imageUrlList;
        receiptList.forEach((item, idx) => {
          if (!isEmpty(item.contentVersionId)) {
            list[idx] = {
              receiptFileId: item.contentVersionId,
              contentDocumentId: item.contentDocumentId,
              title: item.title,
              ocrInfo: item.ocrInfo,
              uploadedDate: item.createdDate,
              dataType: item.fileType,
              extension: item.fileExtension,
              fileBody: previewUrl(
                item.contentVersionId,
                item.fileType === 'PDF'
              ),
              pages: item.pages,
            };
          }
        });
        return { imageUrlList: list };
      });
    }
  }

  componentWillUnmount() {
    this.setState({ imageUrlList: [] });
    window.removeEventListener('mouseout', this.onDragLeave);
    window.removeEventListener('mouseup', this.onDragLeave);
    window.removeEventListener('drop', this.onDragLeave);
    window.removeEventListener('dragenter', this.onDragEnter);
  }

  onDragLeave = () => {
    this.setState({ isFullDropZone: false });
  };

  onDragEnter = () => {
    this.setState({ isFullDropZone: true, errorMsg: '' });
  };

  onClickMainButton = (imageUrlList: Array<Record<string, any>>) => {
    return async () => {
      const selectedIds = map(this.props.selectedReceipt, 'receiptFileId');
      if (!isEmpty(selectedIds)) {
        if (this.props.isMultiStep) {
          // only expense report has multi step
          const selectedPdfIdsList = this.props.selectedReceipt
            .filter((receipt) => isPDF(receipt.dataType))
            .map(({ receiptId, receiptFileId }) => ({
              receiptId,
              receiptFileId,
            }));
          if (selectedPdfIdsList.length > 0) {
            await this.props.getScannedPdfBase64List(selectedPdfIdsList);
          }
          this.props.openDetailConfirmDialog();
        } else {
          const selectedItems = [];
          selectedIds.forEach((id) => {
            const data = find(imageUrlList, { receiptFileId: id }) || {};
            const {
              dataType,
              title,
              uploadedDate,
              contentDocumentId,
              receiptId,
              extension,
            } = data;
            selectedItems.push({
              receiptId: contentDocumentId || receiptId,
              receiptFileId: id,
              dataType,
              title,
              uploadedDate,
              extension,
            });
          });
          this.props.onClickSelectReceipt(selectedItems);
        }
      }
    };
  };

  onSelectImage = () => {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      const receiptFileId = e.target.value;
      const data = find(this.state.imageUrlList, { receiptFileId }) || {};
      if (this.props.isMultiStep) {
        const steps = this.props.progressBar || [];
        steps[0].status = PROGRESS_STATUS.ACTIVE;
        this.props.setProgressBar(steps);
      }
      const receiptId = data.contentDocumentId || data.receiptId;
      const selectedReceipt = {
        receiptFileId,
        receiptId,
        receiptData: data.fileBody,
        ocrInfo: data.ocrInfo,
        dataType: data.dataType,
        title: data.title,
        uploadedDate: data.uploadedDate,
        pages: data.pages,
      };
      this.props.setSelectedReceipt(selectedReceipt);
    };
  };

  onClickDeleteButton = (receiptId: string, dataType: string) => {
    return () => {
      this.props.deleteReceipt(receiptId, dataType);
    };
  };

  handleDropAccepted = (files: DropzoneFile[]) => {
    this.setState((prevState) => {
      const prevImageUrlList = prevState.imageUrlList;
      const newImageUrlList = Array(files.length).fill({});
      return {
        imageUrlList: newImageUrlList.concat(prevImageUrlList),
        errorMsg: '',
        isUploading: true,
      };
    });
    const runOCR = !this.props.isReportReceipt;
    files.map((file) =>
      this.props.onImageDrop(file, runOCR).then((res) => {
        this.props.getReceipts(runOCR, !!res.receiptFileId);
        this.setState({ isUploading: false });
      })
    );
  };

  handleDropRejected = (res: File[]) => {
    let errorMsg = this.props.isMultiStep
      ? msg().Common_Err_MaxOCRFileSize
      : msg().Common_Err_MaxFileSize;

    const extension = FileUtil.getFileExtension(res[0].name);
    const validExtensions = this.props.isMultiStep
      ? VALID_OCR_EXTENSIONS
      : VALID_EXTENSIONS;

    if (!validExtensions.includes(String(extension))) {
      errorMsg = msg().Common_Err_InvalidType;
    }
    if (res.length > 1) {
      errorMsg = msg().Exp_Lbl_SelectSingleFile;
    }
    this.setState({ errorMsg });
  };

  footer() {
    const hintText = this.props.hintMsg ? msg().Exp_Lbl_Hint : '';
    const selectedIds = map(this.props.selectedReceipt, 'receiptFileId');

    return (
      <DialogFrame.Footer
        sub={
          <>
            <LabelWithHint
              text={hintText}
              hintMsg={this.props.hintMsg}
              infoAlign="left"
            />
            {this.props.isMultiStep && (
              <ProgressBar steps={this.props.progressBar} />
            )}
          </>
        }
      >
        <Button
          type="primary"
          onClick={this.onClickMainButton(this.state.imageUrlList)}
          disabled={isEmpty(selectedIds)}
        >
          {this.props.mainButtonTitle}
        </Button>
      </DialogFrame.Footer>
    );
  }

  render() {
    const dropZoneArea = (
      <DropZoneArea
        errorMsg={this.state.errorMsg}
        handleDropAccepted={this.handleDropAccepted}
        handleDropRejected={this.handleDropRejected}
        multiple={false}
        isMultiStep={this.props.isMultiStep}
      />
    );

    const dropZoneOverlay = (
      <div className={`${ROOT}--overlay`}>
        <DropZoneArea
          errorMsg={this.state.errorMsg}
          handleDropAccepted={this.handleDropAccepted}
          handleDropRejected={this.handleDropRejected}
          multiple={false}
          isFullDropZone
        />
      </div>
    );
    return (
      <DialogFrame
        title={this.props.title}
        hide={this.props.onClickReceiptLibrayCloseButton}
        className={`${ROOT}__dialog-frame`}
        footer={this.footer()}
      >
        <ImageDisplayArea
          imageUrlList={this.state.imageUrlList}
          onSelectImage={this.onSelectImage}
          isLoading={this.props.isLoading}
          onClickDeleteButton={this.onClickDeleteButton}
          dropZoneArea={dropZoneArea}
          selectedReceipt={this.props.selectedReceipt}
          isMaxCountSelected={this.props.isMaxCountSelected}
          maxSelectionCount={this.props.maxSelectionCount}
          isReportReceipt={this.props.isReportReceipt}
          executeOcr={this.props.executeOcr}
          executePdfSubPageOcr={this.props.executePdfSubPageOcr}
        />
        {this.state.isFullDropZone && dropZoneOverlay}
      </DialogFrame>
    );
  }
}
