import React from 'react';

import msg from '@commons/languages';

import { isPDF } from '@apps/domain/models/exp/Receipt';

import btnCloseZoom from '../images/btnCloseZoom.png';
import btnRotate from '../images/btnRotate.png';
import IconButton from './buttons/IconButton';

import './LightboxModal.scss';

type Props = {
  src: string;
  fileType?: string;
  toggleLightbox: () => void;
};

type State = {
  rotate: number;
  bottom?: number;
  top: number;
  isTallImage: boolean;
};

export default class LightboxModal extends React.Component<Props, State> {
  img: HTMLElement;
  imgContainer: HTMLElement;

  constructor(props) {
    super(props);
    this.state = {
      // false positive
      // eslint-disable-next-line react/no-unused-state
      rotate: 0,
      // false positive
      // eslint-disable-next-line react/no-unused-state
      bottom: null,
      // false positive
      // eslint-disable-next-line react/no-unused-state
      top: 0,
      // false positive
      // eslint-disable-next-line react/no-unused-state
      isTallImage: false,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick, false);
    this.resetImageInitialState(this.props);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  resetImageInitialState = (props) => {
    const { img } = this;
    const { imgContainer } = this;
    const isTallImage =
      img.clientHeight > imgContainer.clientHeight &&
      img.clientWidth < imgContainer.clientWidth &&
      img.clientWidth < imgContainer.clientHeight;
    const newImg = new Image();

    newImg.src = props.src;
    newImg.onload = () => {
      this.setState({
        // false positive
        // eslint-disable-next-line react/no-unused-state
        rotate: 0,
        // false positive
        // eslint-disable-next-line react/no-unused-state
        isTallImage,
      });
    };
  };

  handleRotate = (angle) => {
    const { img } = this;
    this.setState((prevState) => {
      const rotate = (360 + prevState.rotate + angle) % 360;
      let top = 0;
      let bottom = null;

      if ((rotate / 90) % 2) {
        // 90 || 270 rotation
        if (prevState.isTallImage) {
          bottom = 0;
        } else {
          top = (img.clientWidth - img.clientHeight) / 2;
        }
      }

      return {
        rotate,
        // false positive
        // eslint-disable-next-line react/no-unused-state
        top,
        // false positive
        // eslint-disable-next-line react/no-unused-state
        bottom,
      };
    });
  };

  handleRotateClockwise = () => {
    // eslint-disable-next-line no-useless-call
    this.handleRotate.call(this, 90);
  };

  handleClose = () => {
    this.props.toggleLightbox();
  };

  handleOutsideClick = (e) => {
    const { img } = this;
    const isButton = e.target.className === 'ts-icon-button__image';
    // ignore clicks on the component itself
    if (img.contains(e.target) || isButton) {
      return;
    }

    this.handleClose();
  };

  render() {
    const [props, state] = [this.props, this.state];
    const transform = `rotate(${state.rotate}deg)`;

    const styles = {
      transform,
      top: state.top,
      bottom: state.bottom,
    };

    const isPdf = isPDF(this.props.fileType);

    const content = isPdf ? (
      <object
        data={`${props.src}#toolbar=0`}
        type="application/pdf"
        width="100%"
        height="100%"
        ref={(el) => {
          this.img = el;
        }}
      >
        <p>{msg().Exp_Lbl_Receipt}</p>
      </object>
    ) : (
      <img
        src={props.src}
        alt="expense-evidence"
        style={styles}
        ref={(el) => {
          this.img = el;
        }}
      />
    );

    return (
      <div className="lightbox__modal">
        <div className="lightbox__modal__image-controls">
          <IconButton
            src={btnRotate}
            onClick={this.handleRotateClockwise}
            alt="rotate"
            disabled={isPdf}
          />
          <IconButton
            src={btnCloseZoom}
            onClick={this.handleClose}
            alt="close"
          />
        </div>
        <div
          className="lightbox__modal__image-container"
          ref={(el) => {
            this.imgContainer = el;
          }}
        >
          {content}
        </div>
      </div>
    );
  }
}
