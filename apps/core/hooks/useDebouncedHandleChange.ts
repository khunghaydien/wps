import React from 'react';

import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';

const useDebouncedHandleChange = (
  debounced: boolean,
  wait: number,
  onChange: (
    e: React.SyntheticEvent<HTMLInputElement>,
    terms?: string[]
  ) => void
) => {
  const internalHandleChange: (
    arg0: React.SyntheticEvent<HTMLInputElement>
  ) => void = React.useMemo(() => {
    // eslint-disable-next-line no-underscore-dangle
    const _onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
      const { value } = e.target as any as HTMLInputElement;
      const terms = value.split(/\s/).filter((elem) => !isEmpty(elem));
      onChange(e, terms);
    };

    return debounced
      ? debounce((e) => _onChange(e), wait)
      : (e) => _onChange(e);
  }, [debounced, wait, onChange]);

  const handleChange = React.useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      if (debounced) {
        e.persist();
      }

      internalHandleChange(e);
    },
    [debounced, internalHandleChange]
  );

  return handleChange;
};

export default useDebouncedHandleChange;
