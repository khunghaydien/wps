import React from 'react';

import ObjectUtil from '@commons/utils/ObjectUtil';

import './PhotoUrl.scss';

const ROOT = 'approvals-pc-attendance-particles-grid-formatters-photo-url';

type ValueType = {
  photoUrl: string;
};

type Props = {
  value: ValueType;
  keyMap?: ValueType;
};

const PhotoUrl: React.FC<Props> = ({ keyMap, value }) => {
  const photoUrl = ObjectUtil.getOrEmpty(
    value,
    keyMap ? keyMap.photoUrl : 'photoUrl'
  );

  return (
    <div className={`${ROOT}`}>
      {photoUrl && (
        <div className={`${ROOT}__icon-wrapper`}>
          <img className={`${ROOT}__icon`} alt="" src={photoUrl} />
        </div>
      )}
    </div>
  );
};

PhotoUrl.defaultProps = {
  keyMap: null,
};

export default PhotoUrl;
