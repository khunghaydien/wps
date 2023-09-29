import React from 'react';
import { CSSTransition } from 'react-transition-group';

import iconZoom from '../images/iconZoom.png';
import msg from '../languages';
import LightboxModal from './LightboxModal';

import './Lightbox.scss';

const ROOT = 'lightbox';

type Props = {
  children: React.ReactNode;
  modalUrl?: string;
};

type State = {
  showLightbox: boolean;
};

export default class Lightbox extends React.Component<Props, State> {
  state = {
    showLightbox: false,
  };

  toggleLightbox = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    this.setState((prevState) => ({
      showLightbox: !prevState.showLightbox,
    }));
  };

  render() {
    const { showLightbox } = this.state;
    return (
      <div className={`${ROOT}`}>
        <a
          className={`${ROOT}__thumbnail-container`}
          onClick={this.toggleLightbox}
          tabIndex={-1}
        >
          <div className={`${ROOT}__thumbnail-hover`}>
            <img className="ts-icon__button-image" src={iconZoom} alt="zoom" />
            <p className={`${ROOT}__thumbnail-hover__msg`}>
              {msg().Exp_Lbl_ClickToZoom}
            </p>
          </div>
          {this.props.children}
        </a>
        <CSSTransition
          in={showLightbox}
          timeout={500}
          classNames={`${ROOT}__modal-container`}
          unmountOnExit
        >
          <LightboxModal
            // @ts-ignore
            src={this.props.modalUrl || this.props.children.props.src}
            toggleLightbox={this.toggleLightbox}
          />
        </CSSTransition>
      </div>
    );
  }
}
