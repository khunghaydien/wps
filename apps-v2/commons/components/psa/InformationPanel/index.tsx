import React from 'react';

import './index.scss';

const ROOT = 'ts-psa__info-panel';

type Props = {
  title: string;
  informationDetail: Array<any>;
};
const InformationPanel = (props: Props) => {
  const { title, informationDetail } = props;
  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__title`}>{title}</div>

      <div className={`${ROOT}__body`}>
        {informationDetail &&
          informationDetail.map((data) => {
            if (data.hidden) {
              return null;
            }
            return (
              <div
                key={data.key}
                className={`${ROOT}__field`}
                data-testid={`${ROOT}__${data.key}`}
              >
                <span className="label">{data.label}</span>
                <span className="value">{data.value}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default InformationPanel;
