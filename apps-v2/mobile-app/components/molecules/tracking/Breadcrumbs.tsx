// NOTE
// No use case of breadcrumbs for mobile_app excepting for "tracking".
// If you want Breadcrumbs, then move this components to under commons please.
import * as React from 'react';

import 'element-scroll-polyfill';
import Icon from '../../atoms/Icon';

import './Breadcrumbs.scss';

const ROOT = 'mobile-app-molecules-tracking-breadcrumbs';

type BreadcrumbItem = { id: string; name: string };

type Props<T extends BreadcrumbItem> = Readonly<{
  items: ReadonlyArray<T>;
  onClick: (value: T) => void;
}>;

const Breadcrumbs = <T extends BreadcrumbItem>({
  items = [],
  onClick,
}: Props<T>) => {
  const parents = React.useMemo(() => {
    return items.slice(0, items.length - 1);
  }, [items]);
  const last = React.useMemo(() => {
    return items.length > 0 ? items[items.length - 1] : null;
  }, [items]);

  const handleClick = React.useCallback(
    (value: T) => (e: React.SyntheticEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(value);
    },
    [onClick]
  );

  const ref = React.useRef<any>();
  React.useEffect(() => {
    if (ref.current && ref.current instanceof Element) {
      ref.current.scrollIntoView();
    }
  }, [ref.current]);

  return (
    <div className={ROOT}>
      {parents.map((item) => {
        return (
          <div key={item.id} className={`${ROOT}__block`}>
            <div className={`${ROOT}__item`}>
              <a href="#" onClick={handleClick(item)}>
                {item.name}
              </a>
            </div>
            <div className={`${ROOT}__mark`}>
              <Icon type="chevronright" size="x-small" color="#054A69" />
            </div>
          </div>
        );
      })}
      {last && (
        <div key={last.id} className={`${ROOT}__block`} ref={ref}>
          <div className={`${ROOT}__item ${ROOT}__item--last`}>{last.name}</div>
        </div>
      )}
    </div>
  );
};

export default Breadcrumbs;
