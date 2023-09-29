import * as React from 'react';

import classNames from 'classnames';

import googleMapKey from '../../../../commons/config/googleMapKey';

const ROOT = 'mobile-app-molecules-commons-map';

const URL = 'https://www.google.com/maps/embed/v1/place';

type Props = Readonly<{
  className?: string;
  latitude: number;
  longitude: number;
}>;

export default class Map extends React.Component<Props> {
  render() {
    const { className, latitude, longitude } = this.props;
    const params = new URLSearchParams({
      key: googleMapKey,
      q: `${latitude},${longitude}`,
    });

    return (
      <div className={classNames(ROOT, className)}>
        <iframe
          height="100%"
          width="100%"
          title="Map"
          frameBorder="0"
          style={{ border: 0 }}
          src={`${URL}?${params.toString()}`}
        />
      </div>
    );
  }
}
