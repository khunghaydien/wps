import React from 'react';

import styled from 'styled-components';

import DotLoader from '../DotLoader';
import Spinner from '../Spinner';

/*
if isLoaderOverride is true, apply loading indicator override component;
if false, pass loading flag to component(for components cover loading indicator internally)
if undefined, display loading indicator only
**/

interface WithLoadingProps {
  isDotLoader?: boolean;
  isLoaderOverride?: boolean;
  isLoading: boolean;
  loadingAreas: string[];
  loadingHint?: string;
  className?: string;
}

const S = {
  LoaderContainer: styled.div`
    z-index: 1;
    height: 100%;
    width: 100%;
    position: absolute;
  `,
  Spinner: styled(Spinner)`
    z-index: 1 !important;
    position: absolute !important;
  `,
};

const withLoading = <P extends Record<string, any>>(
  WrappedComponent: React.ComponentType<P>
) =>
  class WithLoadingHOC extends React.Component<P & WithLoadingProps> {
    render() {
      const {
        isLoaderOverride,
        isDotLoader,
        isLoading,
        loadingHint,
        loadingAreas = [],
        ...props
      } = this.props as P & WithLoadingProps;

      const isTargetArea = loadingAreas.includes(
        WrappedComponent.displayName || WrappedComponent.name
      );
      const isTargetLoading = isTargetArea && isLoading;
      const LoadIndicator = isDotLoader ? DotLoader : S.Spinner;
      const extraProps = isDotLoader ? {} : { hintMsg: loadingHint };
      const renderLoadIndicator = () => (
        <S.LoaderContainer className={this.props.className}>
          <LoadIndicator className={`with-loader`} loading {...extraProps} />
        </S.LoaderContainer>
      );
      const renderWrappedComponent = (isLoading) => (
        <WrappedComponent {...(props as P)} isLoading={isLoading} />
      );

      if (isTargetLoading && isLoaderOverride === undefined) {
        return renderLoadIndicator();
      }

      return (
        <>
          {isTargetLoading && isLoaderOverride && renderLoadIndicator()}
          {renderWrappedComponent(isTargetLoading)}
        </>
      );
    }
  };

export default withLoading;
