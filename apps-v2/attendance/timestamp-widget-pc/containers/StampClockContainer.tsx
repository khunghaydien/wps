import * as React from 'react';

import StampClock from '../components/StampClock';

import { useLocale, useTickTimer } from '../hooks/stampClock';

const StampClockContainer = () => {
  const currentTime = useTickTimer();
  const locale = useLocale();
  return <StampClock currentTime={currentTime} locale={locale} />;
};

export default StampClockContainer;
