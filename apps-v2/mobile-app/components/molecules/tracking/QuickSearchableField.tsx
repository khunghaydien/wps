import * as React from 'react';

import isEmpty from 'lodash/isEmpty';

import SearchField from '../commons/Fields/SearchField';

type Props = {
  onChange: (
    e: React.SyntheticEvent<HTMLInputElement>,
    terms?: string[]
  ) => void;
} & React.ElementType<typeof SearchField>;

const QuickSearchableField = (props: Props) => {
  const onChange = React.useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      const { value } = e.target as HTMLInputElement;
      const terms = value.split(/\s/).filter((elem) => !isEmpty(elem));
      props.onChange(e, terms);
    },
    [props.onChange]
  );
  // @ts-ignore
  return <SearchField {...props} onChange={onChange} />;
};

export default QuickSearchableField;
