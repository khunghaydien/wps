import React, { FunctionComponent } from 'react';

import Input from '@apps/mobile-app/components/atoms/Fields/Input';

import './TextFilter.scss';

const ROOT = 'mobile-app-components-molecules-commons-advsearch-text-filter';

type Props = {
  selected: string;
  onChangeTextFilter: (textValue: string) => void;
};

const TextFilter: FunctionComponent<Props> = (props) => {
  const { selected, onChangeTextFilter } = props;

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeTextFilter(event.target.value);
  };

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__field`}>
        <Input type="text" value={selected} onChange={onChangeText} />
      </div>
    </div>
  );
};

export default TextFilter;
