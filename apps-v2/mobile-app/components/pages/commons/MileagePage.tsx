import React, { useRef } from 'react';

import MileageMap, {
  MileageMapRefProps,
} from '@apps/commons/components/exp/MileageMap';
import { useScript } from '@apps/core/hooks';
import googleMapsApiKey, {
  GOOGLE_MAP_SCRIPT_ID,
} from '@commons/config/exp/googleMapKey';
import msg from '@commons/languages';
import Navigation from '@mobile/components/molecules/commons/Navigation';

import { MileageDestinationInfo } from '@apps/domain/models/exp/Mileage';

import './MileagePage.scss';

type Props = {
  destinations: Array<MileageDestinationInfo>;
  onClickBack: () => void;
};
const ROOT = 'mobile-app-pages-commons-mileage';
const MileagePage = (props: Props) => {
  const { destinations, onClickBack } = props;

  const { loading } = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`,
    GOOGLE_MAP_SCRIPT_ID
  );

  const mapRef = useRef<MileageMapRefProps>();

  const onMapLoaded = () => {
    if (mapRef.current) mapRef.current.searchDirections();
  };

  return (
    <div className={ROOT}>
      <Navigation title={msg().Exp_Lbl_Map} onClickBack={onClickBack} />
      <MileageMap
        readOnly
        ref={mapRef}
        destinations={destinations}
        libraryLoaded={!loading}
        containerClass={`${ROOT}__map-container`}
        onMapInitialised={onMapLoaded}
      />
    </div>
  );
};

export default MileagePage;
