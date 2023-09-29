import * as React from 'react';

import classNames from 'classnames';

import { useFilter } from '../../../../commons/hooks';
import msg from '../../../../commons/languages';

import Toast from '../../atoms/Toast';
import Breadcrumbs from '../../molecules/tracking/Breadcrumbs';
import QuickSearchableField from '../../molecules/tracking/QuickSearchableField';

import './QuickSearchableList.scss';

const ROOT = 'mobile-app-organisms-tracking-quick-searchable-list';

export type Props<T extends { id: string; name: string }> = Readonly<{
  isLoading: boolean;
  breadcrumbs: ReadonlyArray<T>;
  items: ReadonlyArray<T>;
  filterSelector: (arg0: T) => string;
  onClickBreadCrumbs: (arg0: T) => void;
  children: React.FunctionComponent<{
    className?: string;
    items: ReadonlyArray<T>;
  }>;
}>;

const Renderer = ({
  component,
  ...props
}: {
  component: React.FunctionComponent<{
    [key: string]: any;
  }>;
} & {
  [key: string]: any;
}) => {
  return component(props);
};

const QuickSearchableList = <T extends { id: string; name: string }>({
  children,
  items,
  filterSelector,
  isLoading,
  breadcrumbs,
  onClickBreadCrumbs,
}: Props<T>) => {
  const [value, filtered, onChange] = useFilter(items, filterSelector);
  const breadcrumbsExist = React.useMemo(() => {
    return breadcrumbs.length > 0;
  }, [breadcrumbs]);

  return (
    <div className={ROOT}>
      <div className={`${ROOT}__quick-search-field`}>
        {breadcrumbsExist && (
          <div className={`${ROOT}__breadcrumbs`}>
            <Breadcrumbs items={breadcrumbs} onClick={onClickBreadCrumbs} />
          </div>
        )}
        <QuickSearchableField
          // @ts-ignore
          placeHolder={msg().Trac_Lbl_FilterJobs}
          value={value}
          onChange={onChange}
        />
      </div>
      <Renderer
        component={children}
        items={filtered}
        className={classNames(`${ROOT}__item-list`, {
          [`${ROOT}__item-list--with-breadcrumbs`]: breadcrumbsExist,
        })}
      />
      <Toast
        className={`${ROOT}__toast`}
        message={msg().Com_Lbl_Loading}
        isShow={isLoading}
      />
    </div>
  );
};

export default QuickSearchableList;
