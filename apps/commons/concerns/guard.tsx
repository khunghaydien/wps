import * as React from 'react';

type Predicate<T> = (arg0: T) => boolean;

/**
 * Block rendeing until a given predicate is satisified.
 */
const guard =
  <TProps extends Record<string, any>>(predicate: Predicate<TProps>) =>
  (
    WrappedComponent: React.ComponentType<TProps>
  ): React.ComponentType<TProps> => {
    return class Gurad extends React.Component<TProps> {
      render() {
        return predicate(this.props) ? (
          <WrappedComponent {...this.props} />
        ) : null;
      }
    };
  };

export default guard;
