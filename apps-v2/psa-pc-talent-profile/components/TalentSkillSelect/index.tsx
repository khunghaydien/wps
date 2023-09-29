import React, { useEffect, useState } from 'react';
import usePortal from 'react-useportal';

import classNames from 'classnames';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import CheckIcon from '@apps/commons/images/icons/CheckIcon.svg';
import msg from '@apps/commons/languages';

import {
  SkillCategory,
  SkillItem,
} from '@apps/domain/models/psa/CapabilityInfo';

import ListItem from '@apps/time-tracking/JobSelectDialog/components/ExploreInHierarchy/ListItem';

import IconAdd from '@psa/images/icons/add.svg';

import './index.scss';

const ROOT = 'ts-talent-skill-select';

type Props = {
  selectedSkillsets: Array<SkillItem>;
  isResetted: boolean;
  onSelect: (skills: Array<SkillItem>) => void;
  onCategorySelect: (categoryId: string) => void;
  skillCategories: Array<SkillCategory>;
  skillItems: Array<SkillItem>;
  title: string;
};

const TalentSkillSelect = (props: Props) => {
  const [selectedSkill, setSelectedSkill] = useState(undefined);
  const [selection, setSelection] = useState(props.selectedSkillsets || []);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState(undefined);
  const [isSelectionDisabled, setSelectionDisabled] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [categoryNameFilter, setCategoryNameFilter] = useState('');
  const [skillCategoryList, setSkillCategoryList] = useState(
    props.skillCategories || []
  );
  const [skillItemsList, setSkillItemsList] = useState(props.skillItems || []);

  const { Portal } = usePortal({
    isOpen: true,
  });

  useEffect(() => {
    if (props.isResetted) {
      const { selectedSkillsets } = props;
      props.onSelect(selectedSkillsets);
      setSelection(selectedSkillsets);
    }
  }, [props.isResetted]);

  useEffect(() => {
    setSkillCategoryList(props.skillCategories);
  }, [props.skillCategories]);

  useEffect(() => {
    setSkillItemsList(props.skillItems);
  }, [props.skillItems]);

  useEffect(() => {
    setSelection(props.selectedSkillsets);
  }, [props.selectedSkillsets]);

  useEffect(() => {
    setSelectionDisabled(selectedSkill === undefined);
  }, [selectedSkill]);

  const toggleOpen = () => {
    setDialogOpen(!isDialogOpen);
    setSkillCategoryList(props.skillCategories);
    setSelectedSkill(undefined);
    setSelectedSkillCategory(undefined);
  };

  const onSkillSelect = () => {
    let skills = [];

    if (selectedSkill) {
      skills = selection.filter((s) => s.skillId !== selectedSkill.id);
      skills.push({
        ...selectedSkill,
        skillId: selectedSkill.id,
        skillName: selectedSkill.name,
        skillCode: selectedSkill.code,
        grades: selectedSkill.grades ? selectedSkill.grades.split('\n') : [],
        rating: selectedSkill.rating || 0,
      });
    }
    props.onSelect(skills);
    setSelection(skills);

    setSelectedSkill(undefined);
    setSelectedSkillCategory(undefined);
    setDialogOpen(!isDialogOpen);
  };

  const onClickSkillCategory = (category) => {
    props.onCategorySelect(category.id);
    setSelectedSkill(undefined);
    setSelectedSkillCategory(category);
  };

  const onClickSkill = (skill) => {
    setSelectedSkill(skill);
  };

  const modalContent = (
    <div className={`${ROOT}__modal-content`}>
      <div className={`${ROOT}__skill-category-list`}>
        <div className={`${ROOT}__skill-category-filter`}>
          <input
            type="text"
            className="ts-text-field slds-input"
            onChange={(e) => {
              const value = e.target.value;
              setCategoryNameFilter(value);
              if (value.length) {
                const filteredList = props.skillCategories.filter((listItem) =>
                  listItem.name.toLowerCase().includes(value.toLowerCase())
                );
                setSkillCategoryList(filteredList);
              } else {
                setSkillCategoryList(props.skillCategories);
              }
            }}
            value={categoryNameFilter}
            placeholder={`Search Skill Category`}
          />
        </div>
        {props.skillCategories &&
          skillCategoryList.map((category: SkillCategory) => {
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
        {selectedSkillCategory && skillItemsList
          ? skillItemsList.map((skill: SkillItem) => {
              const isSkillSelected = selection
                .map((s) => s.skillId)
                .includes(skill.id);
              return (
                <ListItem
                  className={classNames({
                    [`${ROOT}__skill-list__item`]: true,
                    [`${ROOT}__skill-list__item__disabled`]: isSkillSelected,
                  })}
                  key={skill.id}
                  opened={selectedSkill && skill.id === selectedSkill.id}
                  onClick={() => !isSkillSelected && onClickSkill(skill)}
                >
                  {selection && isSkillSelected && (
                    <CheckIcon className={`${ROOT}__skill-list__item__check`} />
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
    <div className={`${ROOT}__selection-button`} onClick={toggleOpen}>
      <IconAdd className={`${ROOT}__selection-button__icon`} />
    </div>
  );

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__selection`}>{selectionButton}</div>
      <Portal>{isDialogOpen && selectDialog}</Portal>
    </div>
  );
};

export default TalentSkillSelect;
