import * as React from 'react';

import classNames from 'classnames';

import CircleOutlineShapeIcon from '../../molecules/commons/ShapeIcons/CircleOutlineShapeIcon';

import { Job } from '../../../../domain/models/time-tracking/Job';

import './ItemList.scss';

const ROOT = 'mobile-app-organisms-tracking-item-list';

type Props = Readonly<{
  className?: string;
  items: ReadonlyArray<Job>;
  onClickJob: (job: Job) => void;
  onClickChildJob: (job: Job) => void;
}>;

const ItemList = ({
  items = [],
  onClickJob,
  onClickChildJob,
  className,
}: Props) => {
  return (
    <div className={classNames(ROOT, className)}>
      {items.map((item) => (
        <div
          tabIndex={0}
          role="button"
          onClick={() => onClickJob(item)}
          className={`${ROOT}__item`}
        >
          <div className={`${ROOT}__content`}>
            <div className={`${ROOT}__code`}>{item.code}</div>
            <div className={`${ROOT}__name`}>{item.name}</div>
          </div>
          {item.hasChildren && (
            <div className={`${ROOT}__button`}>
              <div
                tabIndex={0}
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClickChildJob(item);
                }}
              >
                <CircleOutlineShapeIcon type="chevronright" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ItemList;
