import React, { useMemo, useRef } from 'react';

import classNames from 'classnames';

import styled from 'styled-components';

import IconButton from '@apps/commons/components/buttons/IconButton';
import ImgIconClose from '@apps/core/assets/icons-generic/close.svg';
import AutocompleteInput, {
  Option,
} from '@commons/components/exp/AutocompleteInput';
import LocationIcon from '@commons/images/icons/location.svg';
import RecentlyUsedIcon from '@commons/images/icons/recently-used.svg';

import './DestinationInput.scss';

type Props = {
  disabled?: boolean;
  isError?: boolean;
  isFinalDestination?: boolean;
  placeholder?: string;
  recentlyUsedDestinations?: Array<string>;
  showClearButton?: boolean;
  value: string;
  onChange: (destination: string) => void;
  onClickClear: () => void;
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

const ROOT = 'mobile-app-molecules-destination-input';
const DestinationInput = (props: Props) => {
  const {
    value,
    showClearButton,
    placeholder = '',
    disabled = false,
    isError = false,
    isFinalDestination = false,
    recentlyUsedDestinations,
    onChange,
    onClickClear,
  } = props;
  const autocompleteService = useRef<
    google.maps.places.AutocompleteService | undefined
  >(new google.maps.places.AutocompleteService());

  const onChangeDestination = async (keyword: string): Promise<Option[]> => {
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

  const onSelectDestination = (option?: Option) => {
    onChange(option?.value);
  };

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

  return (
    <div className={ROOT}>
      {!isFinalDestination && (
        <>
          <SmallIndicator top={36} />
          <SmallIndicator top={46} />
          <SmallIndicator top={56} />
        </>
      )}
      <span
        className={classNames({
          [`${ROOT}__indicator`]: true,
          [`${ROOT}__indicator-red`]: isFinalDestination,
        })}
      />
      <AutocompleteInput
        type="text"
        value={value}
        getSuggestions={onChangeDestination}
        onSelectSuggestion={onSelectDestination}
        className={classNames({
          [`${ROOT}__input`]: true,
        })}
        disabled={disabled}
        placeholder={placeholder}
        error={isError}
        defaultOptions={recentlyUsedOptions}
        debounceDuration={500}
        isMobile
        freeFlow
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
