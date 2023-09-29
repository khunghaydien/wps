import * as React from 'react';

import classNames from 'classnames';

import Header from '../../atoms/Header';
import NextButton from './Buttons/NextButton';
import PrevButton from './Buttons/PrevButton';

import './PagingHeader.scss';

const ROOT = 'mobile-app-molecules-commons-paging-header';

// @ts-ignore
type Props = Readonly<{
  /**
   * className
   */
  className?: string;

  /**
   * center element
   */
  children?: React.ReactNode;

  /**
   * a label for previous button.
   */
  prevButtonLabel?: string;

  /**
   * a label for next button.
   */
  nextButtonLabel?: string;

  /**
   * a disable flag for previous button
   */
  disabledPrevButton?: boolean;

  /**
   * a disable flag for next button
   */
  disabledNextButton?: boolean;

  /**
   * event handler on previous button clicked.
   */
  onClickPrev?: (arg0: React.SyntheticEvent<Element>) => void;

  /**
   * event handler on next button clicked.
   */
  onClickNext?: (arg0: React.SyntheticEvent<Element>) => void;

  /**
   * testId on previous button.
   */
  prevTestId?: string;

  /**
   * testId on next button.
   */
  nextTestId?: string;
}>;

export default class PagingHeader extends React.Component<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    const {
      prevButtonLabel,
      nextButtonLabel,
      disabledPrevButton,
      disabledNextButton,
      onClickNext,
      onClickPrev,
      prevTestId,
      nextTestId,
    } = this.props;

    return (
      <Header className={className}>
        <div className={`${ROOT}__container`}>
          <div className={`${ROOT}__prev`}>
            <PrevButton
              testId={prevTestId}
              text={prevButtonLabel || ''}
              onClick={onClickPrev}
              disabled={disabledPrevButton}
            />
          </div>
          <div className={`${ROOT}__center heading-3`}>
            {this.props.children}
          </div>
          <div className={`${ROOT}__next`}>
            <NextButton
              testId={nextTestId}
              text={nextButtonLabel || ''}
              onClick={onClickNext}
              disabled={disabledNextButton}
            />
          </div>
        </div>
      </Header>
    );
  }
}
