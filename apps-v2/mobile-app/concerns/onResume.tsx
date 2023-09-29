import * as React from 'react';
import { Dispatch } from 'redux';

import withDispatch from './lifecycle/Dispatcher';

type Handler = (dispatch: Dispatch, props: Record<string, any>) => void;

let VISIBILITY_CHANGE = '';
let HIDDEN = '';
if (typeof document.hidden !== 'undefined') {
  // Opera 12.10 や Firefox 18 以降でサポート
  VISIBILITY_CHANGE = 'visibilitychange';
  HIDDEN = 'hidden';
} else if (typeof (document as any).msHidden !== 'undefined') {
  VISIBILITY_CHANGE = 'msvisibilitychange';
  HIDDEN = 'msHidden';
} else if (typeof (document as any).webkitHidden !== 'undefined') {
  VISIBILITY_CHANGE = 'webkitvisibilitychange';
  HIDDEN = 'webkitHidden';
}

export default (onResume: Handler) =>
  <_T, TProps extends Record<string, any>>(
    WrappedComponent: React.ComponentType<TProps>
  ): React.ComponentType<TProps> => {
    return withDispatch(
      class OnResume extends React.Component<TProps> {
        static decompose(props: TProps): {
          dispatch: Dispatch;
          props: Omit<TProps, 'dispatch'>;
        } {
          const { dispatch, ...rest } = props;
          return { dispatch, props: rest };
        }

        constructor(props) {
          super(props);

          this.resumeHandler = this.resumeHandler.bind(this);
        }

        componentDidMount(): void {
          document.addEventListener(
            VISIBILITY_CHANGE,
            this.resumeHandler,
            false
          );
        }

        componentWillUnmount(): void {
          document.removeEventListener(VISIBILITY_CHANGE, this.resumeHandler);
        }

        resumeHandler(): void {
          const { dispatch, props } = OnResume.decompose(this.props);
          if (!(document as any)[HIDDEN]) {
            onResume(dispatch, props);
          }
        }

        render() {
          return <WrappedComponent {...this.props} />;
        }
      }
    );
  };
