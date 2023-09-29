import React, { useEffect, useState } from 'react';

import IconButton from '@apps/commons/components/buttons/IconButton';
import SelectField from '@apps/commons/components/fields/SelectField';
import TextField from '@apps/commons/components/fields/TextField';
import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import DeleteIcon from '@apps/commons/images/icons/iconTrash.svg';
import msg from '@apps/commons/languages';

import {
  SkillCategory,
  SkillItem,
} from '@apps/domain/models/psa/CapabilityInfo';

import TalentSkillSelect from '../TalentSkillSelect';

import './index.scss';

const ROOT = 'ts-psa__talent-profile__skill-edit';

type Props = {
  selectedSkillsets: Array<SkillItem>;
  skillCategories: Array<SkillCategory>;
  onSkillSelect: (skills: Array<SkillItem>) => void;
  onCategorySelect: (categoryId: string) => void;
  skillItems: Array<SkillItem>;
  updateSkillItems: (skills: Array<SkillItem>) => void;
};

const SkillEdit = (props: Props) => {
  const [skills, setSkills] = useState(props.selectedSkillsets);

  useEffect(() => {
    setSkills(props.selectedSkillsets);
  }, [props.selectedSkillsets]);

  const onClickDeleteItem = (id: string) => {
    const updatedSkill = skills.filter((item) => id !== item.skillId);
    setSkills(updatedSkill);
    props.updateSkillItems(updatedSkill);
  };
  const onUpdateSkill = (id: string, value: string | number) => {
    const updatedSkill = skills.map((item) => {
      if (id === item.skillId) {
        item.rating = value;
      }
      return item;
    });
    setSkills(updatedSkill);
    props.updateSkillItems(updatedSkill);
  };

  const generateSkillGradeOptions = (grades: Array<any>) => {
    return grades.map((grade, i) => ({
      value: i,
      text: grade,
    }));
  };

  const generateHeaderTitle = () => {
    return (
      <MultiColumnsGrid
        className={`${ROOT}__header-title`}
        sizeList={[3, 4, 4, 1]}
      >
        <div className={`${ROOT}__header-title-column`}>
          {msg().Psa_Lbl_SkillsetCategory}
        </div>
        <div className={`${ROOT}__header-title-column`}>
          {msg().Psa_Lbl_SkillsetName}
        </div>
        <div className={`${ROOT}__header-title-column`}>
          {msg().Admin_Lbl_Rating}
        </div>
        <div className={`${ROOT}__header-title-column`}></div>
      </MultiColumnsGrid>
    );
  };
  const generateReadOnlyRow = (skillItem: SkillItem) => {
    let skillRating;
    if (skillItem.ratingType === 'Score') {
      skillRating = skillItem.rating;
    } else if (skillItem.ratingType === 'Grade') {
      skillRating = skillItem.grades[skillItem.rating];
    } else {
      skillRating = '-';
    }
    return (
      <div className={`${ROOT}__row`}>
        <MultiColumnsGrid
          className={`${ROOT}__skill-item`}
          sizeList={[3, 4, 4, 1]}
        >
          <div className={`${ROOT}__skill-item-column`}>
            {skillItem.categoryName}
          </div>
          <div className={`${ROOT}__skill-item-column`}>
            {skillItem.skillName}
          </div>
          <div className={`${ROOT}__skill-item-column`}>{skillRating}</div>
        </MultiColumnsGrid>
      </div>
    );
  };
  const generateEditableRow = (skillItem: SkillItem) => {
    return (
      <div className={`${ROOT}__row`}>
        <MultiColumnsGrid
          className={`${ROOT}__skill-item`}
          sizeList={[3, 4, 4, 1]}
        >
          <div className={`${ROOT}__skill-item-column`}>
            {skillItem.categoryName}
          </div>
          <div className={`${ROOT}__skill-item-column`}>
            {skillItem.skillName}
          </div>
          <div className={`${ROOT}__skill-item-value`}>
            {skillItem.ratingType === 'None' && (
              <div className={`${ROOT}__skill-item-column`}> - </div>
            )}
            {skillItem.ratingType === 'Score' && (
              <TextField
                disabled={false}
                onChange={(e) => {
                  if (e.target.value.match(/^\d*(\.\d{0,5})?$/)) {
                    onUpdateSkill(skillItem.skillId, e.target.value);
                  }
                }}
                onBlur={(e) => {
                  onUpdateSkill(skillItem.skillId, Number(e.target.value) || 0);
                }}
                value={skillItem.rating}
              />
            )}
            {skillItem.ratingType === 'Grade' && (
              <SelectField
                options={generateSkillGradeOptions(skillItem.grades)}
                onChange={(e) => {
                  onUpdateSkill(skillItem.skillId, e.target.value);
                }}
                value={'' + skillItem.rating}
              />
            )}
          </div>
          <div className={`${ROOT}__skill-item-delete`}>
            <IconButton
              src={DeleteIcon}
              srcType="svg"
              className={`${ROOT}__button--delete ts-button`}
              data-testid={`${ROOT}__button--delete`}
              onClick={() => onClickDeleteItem(skillItem.skillId)}
            />
          </div>
        </MultiColumnsGrid>
      </div>
    );
  };

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__header`}>
        {msg().Psa_Lbl_SkillProficiency}
        <TalentSkillSelect
          selectedSkillsets={skills && skills.filter((skill) => !skill.deleted)}
          isResetted
          onSelect={props.onSkillSelect}
          onCategorySelect={props.onCategorySelect}
          skillCategories={props.skillCategories}
          skillItems={props.skillItems}
          title={msg().Psa_Lbl_AddSkill}
        />
      </div>
      <div className={`${ROOT}__subheader`}>{generateHeaderTitle()}</div>
      <div className={`${ROOT}__skill-divider`}></div>
      <div className={`${ROOT}__editable-skill`}>
        {skills &&
          skills.map(
            (item) =>
              item.allowSelfEditing === 'Allowed' && generateEditableRow(item)
          )}
      </div>
      <div className={`${ROOT}__skill-divider`}></div>
      <div className={`${ROOT}__read-only-skill`}>
        {skills &&
          skills.map(
            (item) =>
              item.allowSelfEditing === 'NotAllowed' &&
              generateReadOnlyRow(item)
          )}
      </div>
    </div>
  );
};

export default SkillEdit;
