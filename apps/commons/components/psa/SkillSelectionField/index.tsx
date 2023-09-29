import React, { useEffect, useState } from 'react';
import usePortal from 'react-useportal';

import cloneDeep from 'lodash/cloneDeep';

import { Input as SFInput } from '@salesforce/design-system-react';

import { CloseButton } from '../../../../core';

import { RATING_TYPE } from '@apps/domain/models/psa/Skillset';

import ListItem from '../../../../time-tracking/JobSelectDialog/components/ExploreInHierarchy/ListItem';

import IconAdd from '../../../../psa-pc/images/icons/add.svg';
import CheckIcon from '../../../images/icons/CheckIcon.svg';
import msg from '../../../languages';
import Button from '../../buttons/Button';
import DialogFrame from '../../dialogs/DialogFrame';
import SelectField from '../../fields/SelectField';
import FormField from '../FormField';
import {
  default as skillNameHelper,
  sortSkillByRequired,
} from './SkillNameHelper';

import './index.scss';

type Keys = keyof typeof RATING_TYPE;

const ROOT = 'ts-skill-selection-field';

export type Skillset = {
  id: string;
  name: string;
  ratingType: typeof RATING_TYPE[Keys];
  rating: Array<any>;
  grades: string;
  required: boolean;
};

type SkillCategory = {
  id: string;
  name: string;
  skillsets: Array<Skillset>;
};

type Props = {
  initialSkillsets: Array<Skillset>;
  isDialogOpen: boolean;
  isResetted: boolean;
  name: string;
  onSelect: (skills: Array<Skillset>) => void;
  selectLimit: number;
  setDialogOpen: (isDialogOpen: boolean) => void;
  skillCategories: Array<SkillCategory>;
  testid: string;
  title: string;
};

const SkillSelectionField = (props: Props) => {
  const [selectedSkill, setSelectedSkill] = useState(undefined);
  const [selection, setSelection] = useState(props.initialSkillsets || []);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState(undefined);
  const [isSelectionDisabled, setSelectionDisabled] = useState(true);
  const [wrapperClass, setWrapperClass] = useState(
    selection && selection.length < props.selectLimit ? 'action' : 'disable'
  );
  const [ratingError, setRatingError] = useState(false);
  const { isDialogOpen, setDialogOpen } = props;

  const { Portal } = usePortal({
    isOpen: true,
  });

  const checkWrapper = (s) =>
    setWrapperClass(s.length < props.selectLimit ? 'action' : 'disable');

  useEffect(() => {
    if (props.isResetted) {
      const { initialSkillsets } = props;
      checkWrapper(initialSkillsets);
      props.onSelect(initialSkillsets);
      setSelection(initialSkillsets);
    }
  }, [props.isResetted]);

  useEffect(() => {
    setSelectionDisabled(selectedSkill === undefined);
  }, [selectedSkill]);

  const toggleOpen = () => {
    setDialogOpen(!isDialogOpen);
  };

  const isRatingTypeGrade =
    selectedSkill && selectedSkill.ratingType === RATING_TYPE.Grade;
  const isRatingTypeScore =
    selectedSkill && selectedSkill.ratingType === RATING_TYPE.Score;
  const isRatingTypeNone =
    selectedSkill && selectedSkill.ratingType === RATING_TYPE.None;

  const validateRatings = () => {
    if (isRatingTypeNone) {
      return false;
    }

    // valid input: '' || min < max
    const [min, max] = selectedSkill ? selectedSkill.rating : [null, null];

    return (
      min !== null &&
      max !== null &&
      Number.isInteger(min) &&
      Number.isInteger(max) &&
      min > max
    );
  };

  const onSkillSelect = () => {
    let skills = [];
    if (validateRatings()) {
      setRatingError(true);
      return;
    }

    if (selectedSkill) {
      skills = selection.filter((s) => s.id !== selectedSkill.id);
      skills.push(selectedSkill);
    }
    checkWrapper(skills);
    props.onSelect(skills);
    setSelection(skills);

    setSelectedSkill(undefined);
    setSelectedSkillCategory(undefined);
    setDialogOpen(!isDialogOpen);
  };

  const onClickSkillCategory = (category) => {
    setSelectedSkill(undefined);
    setSelectedSkillCategory(category);
  };

  const onClickSkill = (skill) => {
    setRatingError(false);
    // init skill required
    const [checkSkill] = selection.filter((s) => s.id === skill.id);
    if (skill.required === undefined || !checkSkill) {
      skill.required = true;
    }

    if (checkSkill) {
      skill.required = checkSkill.required;
    }

    if (skill.ratingType !== 'None') {
      if (skill.rating === undefined || !checkSkill) {
        skill.rating = [null, null];
      }

      if (checkSkill) {
        skill.rating = checkSkill.rating;
      }
    }
    setSelectedSkill(skill);
  };

  const onRemoveSkill = (id) => {
    setSelection(() => {
      const newSkill = selection.filter((skill: Skillset) => skill.id !== id);
      checkWrapper(newSkill);
      props.onSelect(newSkill);
      return newSkill;
    });
  };

  const onSetRequired = () => {
    const skill = cloneDeep(selectedSkill);
    if (skill) {
      skill.required = skill.required ? !skill.required : true;
      setSelectedSkill(skill);
    }
  };

  const onSetRating = (e, index) => {
    setRatingError(false);
    const skill = cloneDeep(selectedSkill);
    const parsedInput = parseInt(e.target.value);
    if (skill && skill.rating) {
      skill.rating[index] =
        isNaN(parsedInput) || parsedInput < 0 ? null : parsedInput;
      setSelectedSkill(skill);
    }
  };

  let ratingFormFields = null;
  if (isRatingTypeScore) {
    ratingFormFields = (
      <div>
        <FormField
          title={msg().Psa_Lbl_MinRating}
          className={`${ROOT}__rating__input__field`}
        >
          <SFInput
            placeholder={msg().Psa_Lbl_EnterValue}
            onChange={(e) => onSetRating(e, 0)}
            value={
              selectedSkill.rating[0] === null ? '' : selectedSkill.rating[0]
            }
            errorText={ratingError ? ' ' : ''}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_MaxRating}
          className={`${ROOT}__rating__input__field`}
        >
          <SFInput
            placeholder={msg().Psa_Lbl_EnterValue}
            onChange={(e) => onSetRating(e, 1)}
            value={
              selectedSkill.rating[1] === null ? '' : selectedSkill.rating[1]
            }
            errorText={ratingError ? msg().Psa_Lbl_RatingError : ''}
          />
        </FormField>
      </div>
    );
  } else if (isRatingTypeGrade) {
    const options = selectedSkill.grades.split('\n').map((grade, i) => ({
      value: i,
      text: grade,
    }));
    // placeholder for select option
    options.unshift({ text: msg().Psa_Lbl_SelectGrade });
    ratingFormFields = (
      <div>
        <FormField
          title={msg().Psa_Lbl_MinRating}
          className={`${ROOT}__rating__input__field`}
        >
          <SelectField
            options={options}
            onChange={(e) => onSetRating(e, 0)}
            value={
              selectedSkill.rating[0] !== null
                ? selectedSkill.rating[0].toString()
                : ''
            }
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_MaxRating}
          className={`${ROOT}__rating__input__field`}
          isTouched={true}
          error={ratingError && 'Psa_Lbl_RatingError'}
        >
          <SelectField
            options={options}
            onChange={(e) => onSetRating(e, 1)}
            value={
              selectedSkill.rating[1] !== null
                ? selectedSkill.rating[1].toString()
                : ''
            }
          />
        </FormField>
      </div>
    );
  }

  const modalContent = (
    <div className={`${ROOT}__modal-content`}>
      <div className={`${ROOT}__skill-category-list`}>
        {props.skillCategories &&
          props.skillCategories.map((category: SkillCategory) => {
            return (
              <ListItem
                className={`${ROOT}__skill-category-list__item`}
                key={category.id}
                hasChildren
                opened={
                  selectedSkillCategory &&
                  category.id === selectedSkillCategory.id
                }
                onClick={() => onClickSkillCategory(category)}
              >
                <span
                  className={
                    selectedSkillCategory &&
                    category.id === selectedSkillCategory.id
                      ? `${ROOT}__skill-category-list__item__selected`
                      : ''
                  }
                >
                  {category.name}
                </span>
              </ListItem>
            );
          })}
      </div>
      <div className={`${ROOT}__skill-list`}>
        {selectedSkillCategory
          ? selectedSkillCategory.skillsets.map((skill: Skillset) => {
              return (
                <ListItem
                  className={`${ROOT}__skill-list__item`}
                  key={skill.id}
                  hasChildren={skill.ratingType !== 'None'}
                  opened={selectedSkill && skill.id === selectedSkill.id}
                  onClick={() => onClickSkill(skill)}
                >
                  {selection &&
                    selection.map((s) => s.id).includes(skill.id) && (
                      <CheckIcon
                        className={`${ROOT}__skill-list__item__check`}
                      />
                    )}
                  <span
                    className={
                      selectedSkill && skill.id === selectedSkill.id
                        ? `${ROOT}__skill-list__item__selected`
                        : ''
                    }
                  >
                    {skill.name}
                  </span>
                </ListItem>
              );
            })
          : null}
      </div>
      <div className={`${ROOT}__rating__input`}>
        {ratingFormFields}
        {selectedSkill && (
          <label
            className={`${ROOT}__required-skill-label`}
            htmlFor="required-skill"
            key="required-skill"
          >
            <input
              type="checkbox"
              id="required-skill"
              className={`${ROOT}__required-skill-checkbox`}
              data-testid={`${ROOT}__required-skill-checkbox`}
              onChange={onSetRequired}
              checked={selectedSkill.required}
            />
            <span className={`${ROOT}__required-skill-text`}>
              {msg().Psa_Lbl_RequiredSkill}
            </span>
          </label>
        )}
      </div>
    </div>
  );

  const modalFooter = (
    <DialogFrame.Footer>
      <Button type="default" onClick={toggleOpen}>
        {msg().Psa_Btn_Cancel}
      </Button>
      <Button
        disabled={isSelectionDisabled}
        type="primary"
        onClick={onSkillSelect}
      >
        {msg().Com_Btn_Select}
      </Button>
    </DialogFrame.Footer>
  );

  const selectDialog = (
    <DialogFrame
      title={props.title}
      hide={toggleOpen}
      className={`${ROOT}__modal`}
      draggable
      footer={modalFooter}
    >
      {modalContent}
    </DialogFrame>
  );

  const selectionButton = (
    <div className={`${ROOT}__selection-button`}>
      <IconAdd className={`${ROOT}__selection-button__icon__${wrapperClass}`} />
      <div onClick={toggleOpen}>
        <span className={`${ROOT}__selection-button__name__${wrapperClass}`}>
          {props.name}
        </span>
      </div>
    </div>
  );

  const selectionList = (
    <div className={`${ROOT}__selection-list`}>
      {selection &&
        selection.sort(sortSkillByRequired).map((skill: Skillset) => {
          return (
            <div key={skill.id} className={`${ROOT}__selection-list__item`}>
              <span className={`${ROOT}__selection-list__item__label`}>
                {skillNameHelper(skill)}
              </span>
              <CloseButton
                className={`${ROOT}__selection-list__item__close-button`}
                onClick={() => onRemoveSkill(skill.id)}
              />
            </div>
          );
        })}
    </div>
  );

  return (
    <div className={`${ROOT}`} data-testid={props.testid}>
      <div className={`${ROOT}__selection`}>
        {selectionButton}
        {selectionList}
      </div>
      <Portal>
        {isDialogOpen && selection.length < props.selectLimit && selectDialog}
      </Portal>
    </div>
  );
};

export default SkillSelectionField;
