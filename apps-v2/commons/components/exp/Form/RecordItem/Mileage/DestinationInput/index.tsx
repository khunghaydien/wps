import React, { useEffect, useMemo, useRef } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import styled from 'styled-components';

import IconButton from '@apps/commons/components/buttons/IconButton';
import ImgIconClose from '@apps/core/assets/icons-generic/close.svg';
import AutocompleteInput, {
  Option,
} from '@commons/components/exp/AutocompleteInput';
import LocationIcon from '@commons/images/icons/location.svg';
import RecentlyUsedIcon from '@commons/images/icons/recently-used.svg';

import './index.scss';

type Props = {
  autocompleteContainerClass?: string;
  containerClass?: string;
  disabled?: boolean;
  error?: boolean;
  isFinalDestination?: boolean;
  placeholder?: string;
  recentlyUsedDestinations?: Array<string>;
  showClearButton?: boolean;
  value: string;
  withIndicator?: boolean;
  onBlur?: () => void;
  onChange: (destination: string) => void;
  onClickClear?: () => void;
};

const SmallIndicator = styled.div<{ top: number }>`
  position: absolute;
  height: 4px;
  width: 4px;
  background-color: #666666;
  border-radius: 50%;
  top: ${({ top }) => top}px;
  left: 3px;
`;

const ROOT = 'ts-expenses__form-record-item__mileage-destination-input';
const DestinationInput = (props: Props) => {
  const {
    value,
    showClearButton,
    placeholder = '',
    disabled = false,
    isFinalDestination = false,
    recentlyUsedDestinations,
    withIndicator = true,
    containerClass,
    autocompleteContainerClass,
    error,
    onChange,
    onBlur,
    onClickClear,
  } = props;

  const autocompleteService = useRef<
    google.maps.places.AutocompleteService | undefined
  >();

  useEffect(() => {
    if (window.google && window.google.maps.places) {
      autocompleteService.current =
        new google.maps.places.AutocompleteService();
    }
  }, []);

  const recentlyUsedOptions = useMemo(
    () =>
      (recentlyUsedDestinations || []).map((destination) => ({
        id: destination,
        label: destination,
        value: destination,
        icon: <RecentlyUsedIcon className={`${ROOT}__icon`} />,
      })),
    [recentlyUsedDestinations]
  );

  const getDestinations = async (keyword: string): Promise<Option[]> => {
    if (!keyword || keyword.length === 0) return [];
    try {
      const result = await autocompleteService.current.getPlacePredictions({
        input: keyword,
      });
      if (result && result.predictions && result.predictions.length > 0) {
        const suggestions = result.predictions.map((p) => {
          const isUsedBefore = (recentlyUsedDestinations || []).find((r) =>
            r.toLowerCase().startsWith(p.description.toLowerCase())
          );
          return {
            id: p.description,
            value: p.description,
            label: p.description,
            icon: isUsedBefore ? (
              <RecentlyUsedIcon className={`${ROOT}__icon`} />
            ) : (
              <LocationIcon className={`${ROOT}__icon`} />
            ),
            order: isUsedBefore ? 0 : 1,
          };
        });
        return suggestions.sort((a, b) => a.order - b.order);
      }
    } catch (e) {
      return Promise.resolve([
        {
          id: keyword,
          value: keyword,
          label: keyword,
          icon: <LocationIcon className={`${ROOT}__icon`} />,
        },
      ]);
    }
  };

  const onSelectDestination = (place?: Option) => {
    onChange(place?.value || '');
  };

  return (
    <div className={classNames(ROOT, containerClass)}>
      {!isFinalDestination && withIndicator && (
        <>
          <SmallIndicator top={28} />
          <SmallIndicator top={38} />
          <SmallIndicator top={48} />
        </>
      )}
      {withIndicator && (
        <span
          className={classNames({
            [`${ROOT}__indicator`]: true,
            [`${ROOT}__indicator-red`]: isFinalDestination,
          })}
        />
      )}
      <AutocompleteInput
        type="text"
        value={value}
        getSuggestions={getDestinations}
        onSelectSuggestion={onSelectDestination}
        className={classNames({
          [`${ROOT}__input`]: true,
          [`${ROOT}__input-error`]: error,
          [`${autocompleteContainerClass}`]: !isEmpty(
            autocompleteContainerClass
          ),
        })}
        disabled={disabled}
        placeholder={placeholder}
        defaultOptions={recentlyUsedOptions}
        debounceDuration={500}
        freeFlow
        onBlur={onBlur}
      />
      {showClearButton && !disabled && (
        <IconButton
          srcType="svg"
          src={ImgIconClose}
          onClick={onClickClear}
          className={`${ROOT}-button`}
        />
      )}
    </div>
  );
};

export default DestinationInput;
