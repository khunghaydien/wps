import { useCallback, useMemo, useState } from 'react';

import escapeStringRegexp from 'escape-string-regexp';

type ReturnValue<T> = [
  string,
  ReadonlyArray<T>,
  (arg0: React.SyntheticEvent<HTMLInputElement>, terms?: string[]) => void
];

export default <T>(
  items: ReadonlyArray<T>,
  selector: (arg0: T) => string
): ReturnValue<T> => {
  const [value, setValue] = useState('');
  const [terms, setTerms] = useState([]);

  const onChange = useCallback((e, terms) => {
    setValue(e.currentTarget.value);
    if (terms) {
      setTerms(terms);
    }
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      terms.every((term) => {
        const strBase = selector(item);
        const escapedString = escapeStringRegexp(term);
        return new RegExp(escapedString.toLowerCase()).test(
          strBase.toLowerCase()
        );
      })
    );
  }, [items, terms, selector]);

  return [value, filteredItems, onChange];
};
