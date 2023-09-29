import React from 'react';

import IconDOC from '../../../../../../commons/images/icons/doc.svg';
import IconPDF from '../../../../../../commons/images/icons/pdf.svg';
import IconXLS from '../../../../../../commons/images/icons/xls.svg';
import FileUtil from '../../../../../../commons/utils/FileUtil';

import {
  Base64FileList,
  isDOC,
  isNotImage,
  isPDF,
  isXLS,
} from '../../../../../../domain/models/exp/Receipt';

import IconButton from '../../../../atoms/IconButton';

import './Preview.scss';
import colors from '../../../../../styles/variables/_colors.scss';

const ROOT = 'mobile-app-pages-expense-page-receipt-upload-preview';

type State = {
  index: number;
  isLandscape: boolean;
};

export type Props = {
  images: Base64FileList;
  onClickRemoveButton: (arg0: number) => void;
};

export default class Preview extends React.Component<Props, State> {
  // previewImage can be img or svg
  previewImage: any;

  state = {
    index: 0,
    isLandscape: true,
  };

  onClickRemoveButton = () => {
    this.props.onClickRemoveButton(this.state.index);
    if (this.state.index !== 0) {
      this.setState((prevState) => ({
        index: prevState.index - 1,
      }));
    }
  };

  onClickCarouselButton = (add: 1 | -1) => {
    const { index } = this.state;
    const { images } = this.props;

    let idx;
    if (index + add === -1) {
      idx = images.length - 1;
    } else if (index + add === images.length) {
      idx = 0;
    } else {
      idx = index + add;
    }
    this.setState({ index: idx });
  };

  adjustSize = () => {
    if (this.previewImage) {
      this.setState({
        isLandscape:
          this.previewImage.naturalWidth >= this.previewImage.naturalHeight,
      });
    }
  };

  renderPreviewBox = (Component: string) => {
    const { index } = this.state;
    const { images } = this.props;
    return (
      <>
        <Component aria-hidden="true" />
        <span>{images[index].name}</span>
      </>
    );
  };

  render() {
    const { index, isLandscape } = this.state;
    const { images } = this.props;
    const b64Data = images[index].data;
    const extension = String(FileUtil.getB64FileExtension(b64Data));

    const imageWrapperClass = isLandscape
      ? `${ROOT}__image-landscape`
      : `${ROOT}__image-portrait`;

    const isNotImageType = isNotImage(extension);

    const fileClassName = isNotImageType ? `${ROOT}__non-image-file` : '';
    let previewImg = <img alt="file" src={b64Data} onLoad={this.adjustSize} />;

    if (isPDF(extension)) {
      previewImg = this.renderPreviewBox(IconPDF);
    } else if (isDOC(extension)) {
      previewImg = this.renderPreviewBox(IconDOC);
    } else if (isXLS(extension)) {
      previewImg = this.renderPreviewBox(IconXLS);
    }

    return (
      <div className={ROOT}>
        <div className={`${ROOT}__main`}>
          <IconButton
            className={`${ROOT}__remove`}
            color={colors.textReverse}
            size="small"
            icon="close-copy"
            onClick={this.onClickRemoveButton}
          />
          {images.length > 1 && (
            <IconButton
              className={`${ROOT}__nav-left`}
              icon="chevronleft"
              color={colors.textReverse}
              disabled={images.length === 1 || index === undefined}
              onClick={() => this.onClickCarouselButton(-1)}
            />
          )}
          <div
            className={`${imageWrapperClass} ${fileClassName}`}
            ref={(c) => {
              this.previewImage = c;
            }}
          >
            {previewImg}
          </div>
          {images.length > 1 && (
            <IconButton
              className={`${ROOT}__nav-right`}
              icon="chevronright"
              color={colors.textReverse}
              onClick={() => this.onClickCarouselButton(1)}
              disabled={images.length === 1 || index === undefined}
            />
          )}
        </div>
        <div className={`${ROOT}__index`}>
          {index + 1} / {images.length}
        </div>
      </div>
    );
  }
}
