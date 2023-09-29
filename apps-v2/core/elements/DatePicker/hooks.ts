import * as React from 'react';

import moment from 'moment';

export const useCallbackWithMoment = (
  callback?: (arg0: null | Date) => void
) => {
  return React.useCallback(
    (date: moment.Moment) => {
      if (callback) {
        callback(date && date.isValid() ? date.toDate() : null);
      }
    },
    [callback]
  );
};

export const useTempValue = (
  value: string,
  onChange: (arg0: moment.Moment) => void
): [
  string,
  (e: React.SyntheticEvent<HTMLInputElement>) => void,
  () => void
] => {
  const [tempValue, setTempValue] = React.useState(value);

  React.useEffect(() => {
    setTempValue(value);
  }, [value]);

  const onChangeRaw = React.useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      setTempValue(e.currentTarget.value);
    },
    []
  );

  const onBlur = React.useCallback(() => {
    const date = moment(tempValue);

    if (date.isValid() && !date.isSame(moment(value))) {
      onChange(date);
    } else {
      setTempValue(value);
    }
  }, [tempValue, value, onChange]);

  return [tempValue, onChangeRaw, onBlur];
};
