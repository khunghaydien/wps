import * as React from 'react';
import { Dispatch } from 'redux';

import withDispatch from './Dispatcher';

/**
 * Lifecyle hooks of container component
 */
export type LifecyleHooks = {
  /**
   * Equivalent to React's componentDidMount.
   *
   * This is good timing to fetch data over network.
   */
  componentDidMount?: (arg0: Dispatch<any>, props: Record<string, any>) => void;

  /**
   * Equivalent to React's componentWillUnmount.
   */
  componentWillUnmount?: (arg0: Dispatch, props: Record<string, any>) => void;
};

/**
 * Lifecycle hooks of container component.
 *
 * NOTE
 * Do not use those hooks for manuplating actual DOM.
 * Those hooks is provided for initialization or cleanup through
 * Web API.
 * If you are looking for hooks write/read actual DOM, then just create or modify
 * React's component.
 *
 * @example
 *
 * import * as React from 'react';
 * import { type Dispatch, compose } from 'redux';
 * import { connect } from 'react-redux';
 *
 * import lifecycle from '../../../commons-sp/containers/lifecycle';
 * import SampleaPage from '../components/pages/SamplePage';
 *
 * const mapStateToProps = (state) => ({});
 *
 * const mapDispatchToProps = (dispatch: Dispatch<*>) => ({});
 *
 * const mergeProps = (stateProps, dispatchProps, ownProps) => ({});
 *
 * export default compose(
 *   lifecycle({
 *     componentDidMount: (_dispatch, _props) => window.alert('Hello!'),
 *     componentWillUnmount: (_dispatch, _props) => window.alert('By!'),
 *   }),
 *   connect(
 *     mapStateToProps,
 *     mapDispatchToProps,
 *     mergeProps
 *   )
 * )(SampleaPage);
 *
 */
export default <TProps extends Record<string, any>>(hooks: LifecyleHooks) =>
  (WrappedComponent: React.ComponentType<any>): React.ComponentType<any> => {
    type Props = Partial<
      TProps & {
        dispatch: Dispatch;
      }
    >;

    return withDispatch(
      class Lifecycle extends React.PureComponent<Props> {
        static decompose(props: Props): {
          dispatch: Dispatch;
          props: Omit<Props, 'dispatch'>;
        } {
          const { dispatch, ...rest } = props;
          return { dispatch, props: rest };
        }

        componentDidMount() {
          const { dispatch, props } = Lifecycle.decompose(this.props);
          if (hooks.componentDidMount) {
            hooks.componentDidMount(dispatch, props);
          }
        }

        componentWillUnmount() {
          const { dispatch, props } = Lifecycle.decompose(this.props);
          if (hooks.componentWillUnmount) {
            hooks.componentWillUnmount(dispatch, props);
          }
        }

        render() {
          const { props } = Lifecycle.decompose(this.props);
          return <WrappedComponent {...props} />;
        }
      }
    );
  };
