import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import format from 'date-fns/format';

import { TIME_TRACK_SUBMIT } from '@apps/commons/constants/customEventName';

import Request from '@apps/planner-pc/action-dispatchers/Request';

export const useFetchAlertOnSubmit = (targetDate: Date): void => {
  const dispatch = useDispatch();
  const request = useMemo(() => Request(dispatch), [dispatch]);
  const targetDateISOString = useMemo(
    () => format(targetDate, 'YYYY-MM-DD'),
    [targetDate]
  );
  const fetchAlert = useCallback(() => {
    request.fetchAlert({ targetDate: targetDateISOString });
  }, [request, targetDateISOString]);

  useEffect(() => {
    window.addEventListener(TIME_TRACK_SUBMIT, fetchAlert);
    return () => {
      window.removeEventListener(TIME_TRACK_SUBMIT, fetchAlert);
    };
  }, [fetchAlert]);
};
