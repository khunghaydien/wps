import * as React from 'react';
import ReactDropzone, { DropzoneProps, FileWithPreview } from 'react-dropzone';

import classNames from 'classnames';
import isNil from 'lodash/isNil';

import { Text } from '../../../core';

import msg from '../../languages';

import './Dropzone.scss';

const ROOT = 'commons-fields-dropzone';

export type DropzoneFile = FileWithPreview;

export type Props = DropzoneProps & {
  onDrop?: DropzoneProps['onDrop'];
  hint?: string;
  files?: DropzoneFile[];
  onClickDelete?: () => void;
  className?: any;
  accept?: any;
  onDropAccepted?: any;
  onDropRejected?: any;
  multiple?: boolean;
  maxSize?: any;
  children?: any;
  buttontext?: string;
  labeltext?: React.ReactNode;
};

export default class Dropzone extends React.Component<Props> {
  renderDropzone() {
    return (
      // @ts-ignore
      <ReactDropzone {...this.props} className={`${ROOT}__dropzone`}>
        <div className={`${ROOT}__file-label`}>
          {this.props.labeltext ? (
            this.props.labeltext
          ) : (
            <p>
              <Text size="large" color="secondary">
                {this.props.hint || msg().Com_Lbl_DragAndDrop}
              </Text>
            </p>
          )}

          <button
            type="button"
            className={`${ROOT}__button--file ts-button`}
            disabled={this.props.disabled}
          >
            {this.props.buttontext
              ? this.props.buttontext
              : msg().Com_Lbl_ChooseFile}
          </button>
        </div>
      </ReactDropzone>
    );
  }

  renderDroppedResult() {
    return (
      <React.Fragment>
        {isNil(this.props.children) ? (
          <React.Fragment>
            {(this.props.files || []).map((file, index) => (
              <div key={index}>
                {file.name}: {file.type}
              </div>
            ))}
          </React.Fragment>
        ) : (
          this.props.children
        )}
        <button
          type="button"
          className={`${ROOT}__button--delete ts-button`}
          onClick={this.props.onClickDelete}
        >
          {msg().Com_Lbl_DeleteFile}
        </button>
      </React.Fragment>
    );
  }

  render() {
    const className = classNames(ROOT, this.props.className);
    const isDropped = (this.props.files || []).length > 0;
    return (
      <div className={className}>
        {isDropped ? this.renderDroppedResult() : this.renderDropzone()}
      </div>
    );
  }
}
