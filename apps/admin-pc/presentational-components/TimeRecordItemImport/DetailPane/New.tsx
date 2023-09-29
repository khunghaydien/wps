import * as React from 'react';

import Button from '../../../../commons/components/buttons/Button';
import Dropzone, {
  DropzoneFile,
} from '../../../../commons/components/fields/Dropzone';
import HorizontalLayout from '../../../../commons/components/fields/layouts/HorizontalLayout';
import msg from '../../../../commons/languages';

import './New.scss';

const ROOT = 'admin-pc-time-record-item-import-detail-pane-new';
const MAX_FILE_SIZE = 5242880;

export type Props = {
  files: DropzoneFile[];
  canExecute: boolean;

  onChange: (key: string, value: any) => void;
  onDropAccepted: (arg0: File[]) => void;
  onClickExecute: () => void;
  onClickDelete: () => void;
};

export default class New extends React.Component<Props> {
  onDropAccepted = (files: DropzoneFile[]) => {
    this.props.onDropAccepted(files);
  };

  onDropRejected = () => {};

  render() {
    return (
      <div className={ROOT}>
        <HorizontalLayout>
          <HorizontalLayout.Label>
            {msg().Admin_Lbl_TimeRecordItemImportCsvFile}
          </HorizontalLayout.Label>
          <HorizontalLayout.Body className={`${ROOT}__file`}>
            {/* @ts-ignore */}
            <Dropzone
              className={`${ROOT}__dropzone`}
              files={this.props.files}
              accept=".csv"
              onDropAccepted={this.onDropAccepted}
              onDropRejected={this.onDropRejected}
              onClickDelete={this.props.onClickDelete}
              multiple={false}
              maxSize={MAX_FILE_SIZE}
              hint={msg().Admin_Lbl_TimeRecordItemImportDragAndDrop}
            />
          </HorizontalLayout.Body>
        </HorizontalLayout>
        <div className={`${ROOT}__button-area`}>
          <Button
            className={`${ROOT}__execute-button`}
            type="primary"
            disabled={!this.props.canExecute}
            onClick={this.props.onClickExecute}
          >
            {msg().Com_Btn_Execute}
          </Button>
        </div>
      </div>
    );
  }
}
