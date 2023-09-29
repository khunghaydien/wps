import * as React from 'react';

import Button from '../../../../commons/components/buttons/Button';
import Dropzone, {
  DropzoneFile,
} from '../../../../commons/components/fields/Dropzone';
import HorizontalLayout from '../../../../commons/components/fields/layouts/HorizontalLayout';
import TextAreaField from '../../../../commons/components/fields/TextAreaField';
import msg from '../../../../commons/languages';

import './New.scss';

const ROOT = 'admin-pc-att-pattern-employee-batch-detail-pane-new';
const MAX_FILE_SIZE = 5242880;

export type Props = {
  comment: string;
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
            {msg().Admin_Lbl_AttPatternEmployeeBatchCsvFile}
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
              hint={msg().Admin_Lbl_AttPatternEmployeeBatchDragAndDrop}
            />
          </HorizontalLayout.Body>
        </HorizontalLayout>
        <HorizontalLayout>
          <HorizontalLayout.Label>
            {msg().Admin_Lbl_Comment}
          </HorizontalLayout.Label>
          <HorizontalLayout.Body>
            <TextAreaField
              maxLength={1000}
              value={this.props.comment}
              onChange={(event) =>
                this.props.onChange('comment', event.target.value)
              }
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
