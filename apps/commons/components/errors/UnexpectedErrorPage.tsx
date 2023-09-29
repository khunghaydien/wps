import * as React from 'react';

import Chevrondown from '../../../../node_modules/@salesforce-ux/design-system/assets/icons/utility/chevrondown.svg';
import Chevronright from '../../../../node_modules/@salesforce-ux/design-system/assets/icons/utility/chevronright.svg';

import ApexError from '../../errors/ApexError';
import FatalError from '../../errors/FatalError';
import Unexpected from '../../images/unexpected.png';
import msg from '../../languages';
import ErrorPageFrame from './ErrorPageFrame';

import './UnexpectedErrorPage.scss';

const COMPONENT_ROOT = 'commons-errors-unexpected-error-page';

type Props = {
  error: FatalError | ApexError;
};

type State = {
  isOpening: boolean;
};

const withState = (WrappedComponent: React.ComponentType<any>) => {
  return class UnexpectedErrorPageContainer extends React.PureComponent<
    Props,
    State
  > {
    static displayName = 'UnexpectedErrorPage';

    constructor(props) {
      super(props);

      this.state = {
        isOpening: false,
      };
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onClickNextSolution={() =>
            this.setState((prevState) => ({
              isOpening: !prevState.isOpening,
            }))
          }
        />
      );
    }
  };
};

type PresentationProps = { onClickNextSolution: Function } & State & Props;

const UnexpectedErrorPagePresnetation = (props: PresentationProps) => {
  const { error, isOpening, onClickNextSolution } = props;

  const SolutionDetail = () => {
    switch (error.type) {
      case 'FatalError':
        return (
          <dl>
            <dt className={`${COMPONENT_ROOT}__info-title`}>Name</dt>
            <dd>{error.name}</dd>
            <dt className={`${COMPONENT_ROOT}__info-title`}>Code</dt>
            <dd>{error.errorCode}</dd>
            <dt className={`${COMPONENT_ROOT}__info-title`}>Message</dt>
            <dd> {error.message}</dd>
            <dt className={`${COMPONENT_ROOT}__info-title`}>Stacktrace</dt>
            <dd>{error.stacktrace}</dd>
          </dl>
        );

      case 'ApexError':
        return (
          <dl>
            <dt className={`${COMPONENT_ROOT}__info-title`}>Action</dt>
            <dd>{error.action}</dd>
            <dt className={`${COMPONENT_ROOT}__info-title`}>Status Code</dt>
            <dd>{error.statusCode}</dd>
            <dt className={`${COMPONENT_ROOT}__info-title`}>Message</dt>
            <dd> {error.message}</dd>
            <dt className={`${COMPONENT_ROOT}__info-title`}>Where</dt>
            <dd>{error.where}</dd>
          </dl>
        );

      default:
        return <div />;
    }
  };

  const Solution = () => (
    <div className={`${COMPONENT_ROOT}__solution`}>
      <div className={`${COMPONENT_ROOT}__solution-headline`}>
        <div className={`${COMPONENT_ROOT}__cheveon`}>
          {isOpening ? (
            <Chevrondown
              aria-hidden="true"
              className="slds-button__icon slds-button__icon-xx-small"
            />
          ) : (
            <Chevronright
              aria-hidden="true"
              className="slds-button__icon slds-button__icon-xx-small"
            />
          )}
        </div>
        <div className={`${COMPONENT_ROOT}__title`}>
          {/*
            // @ts-ignore */}
          <a onClick={onClickNextSolution}>
            {msg().Com_Lbl_UnexpectedErrorPageHint}
          </a>
        </div>
      </div>
      {isOpening ? (
        <div className={`${COMPONENT_ROOT}__solution-detail`}>
          <p className={`${COMPONENT_ROOT}__header`}>
            {msg().Com_Lbl_UnexpectedErrorPageHintDescription}
          </p>
          {/*
            // @ts-ignore */}
          <SolutionDetail error={error} />
        </div>
      ) : null}
    </div>
  );

  return (
    <ErrorPageFrame
      icon={Unexpected}
      title={msg().Com_Lbl_UnexpectedErrorPageTitle}
      solution={msg().Com_Lbl_UnexpectedErrorPageSolution}
    >
      <Solution />
    </ErrorPageFrame>
  );
};

const Component = withState(UnexpectedErrorPagePresnetation);

export default Component;
