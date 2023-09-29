import * as React from 'react';

/**
 * Set name to displayName property of React component
 * @param name Component's name
 * @return Component
 */
const displayName =
  (name: string) =>
  <T extends Record<string, any>>(
    WrappedComponent: React.ComponentType<T>
  ): React.ComponentType<T> => {
    WrappedComponent.displayName = name;
    return WrappedComponent;
  };

export default displayName;
