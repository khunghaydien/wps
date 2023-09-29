import * as React from 'react';

export const DEFAULT_MAX_CHECKED = 100;

const useCheckAll = <T>({
  targets,
  checked,
  setChecked,
  max: $max,
}: {
  targets: T[];
  checked: T[];
  setChecked: (value: T[]) => void;
  max?: number | null;
}): {
  checkedAll: boolean;
  checkAll: () => void;
  check: (item: T) => boolean;
} => {
  const max = React.useMemo(() => $max ?? DEFAULT_MAX_CHECKED, [$max]);
  const checkedAll = React.useMemo(() => {
    if (!checked.length) {
      return false;
    } else if (checked.length >= max) {
      return true;
    } else {
      return targets.every((value) => checked.includes(value));
    }
  }, [checked, max, targets]);
  const checkAll = React.useCallback(() => {
    if (checkedAll) {
      setChecked([]);
    } else {
      const notChecked = targets.filter((id) => !checked.includes(id));
      const ids = checked.concat(notChecked).slice(0, max);
      setChecked(ids);
    }
  }, [checked, checkedAll, max, setChecked, targets]);
  const check = React.useCallback(
    (item: T) => {
      const included = checked.includes(item);
      if (included) {
        setChecked(checked.filter(($item) => $item !== item));
        return true;
      } else {
        if (checked.length >= max) {
          return false;
        } else {
          setChecked(checked.concat(item));
          return true;
        }
      }
    },
    [checked, max, setChecked]
  );

  React.useEffect(() => {
    if (checked.length > max) {
      setChecked(checked.slice(0, max));
    }
  }, [max]);

  return {
    checkedAll,
    checkAll,
    check,
  };
};

export default useCheckAll;
