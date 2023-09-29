import React from 'react';

import { RATING_TYPE } from '@apps/domain/models/psa/Skillset';

import { Skillset } from '../index';

export default (skill: Skillset) => {
  const isRatingTypeGrade = skill.ratingType === RATING_TYPE.Grade;

  let skillRating = '';
  let minRating = skill.rating && skill.rating[0];
  let maxRating = skill.rating && skill.rating[1];

  if (isRatingTypeGrade) {
    const gradeOptions = skill.grades.split('\n');
    minRating = gradeOptions[minRating];
    maxRating = gradeOptions[maxRating];
  }

  if (minRating && maxRating) {
    skillRating = ` (${minRating} - ${maxRating})`;
  } else if (minRating) {
    skillRating = ` (> ${minRating})`;
  } else if (maxRating) {
    skillRating = ` (< ${maxRating})`;
  }

  return (
    <span>
      {skill.required && <span className="skill-is-required">* </span>}
      {skill.name}
      {skillRating}
    </span>
  );
};

export const mapSkillWithCommas = (skill: any, index: number, skills: any) => {
  const hasNext = skills.length && index < skills.length - 1;
  const isRatingTypeGrade = skill.ratingType === RATING_TYPE.Grade;

  let skillRating = '';
  let minRating = skill.min;
  let maxRating = skill.max;

  if (skill.rating) {
    minRating = skill.rating[0];
    maxRating = skill.rating[1];
  }

  if (isRatingTypeGrade) {
    const gradeOptions = skill.grades.split('\n');
    minRating = gradeOptions[minRating];
    maxRating = gradeOptions[maxRating];
  }

  if (minRating && maxRating) {
    skillRating = ` (${minRating} - ${maxRating})`;
  } else if (minRating) {
    skillRating = ` (> ${minRating})`;
  } else if (maxRating) {
    skillRating = ` (< ${maxRating})`;
  }

  return (
    <span>
      {skill.required && <span className="skill-is-required">* </span>}
      <span className={`${skill.deleted && 'strikeThrough'}`}>
        {skill.name}
      </span>
      {skillRating}
      {hasNext && ', '}
    </span>
  );
};

export const sortSkillByRequired = (a: any, b: any) => {
  if (a.required && !b.required) {
    return -1;
  }

  if (!a.required && b.required) {
    return 1;
  }

  return 0;
};

export const getSkillFromRole = (skill: any, index: number, skills: any) => {
  const hasNext = skills.length && index < skills.length - 1;
  const isRatingTypeGrade = skill.ratingType === RATING_TYPE.Grade;

  let result = '';
  let minRating = skill.min;
  let maxRating = skill.max;

  if (isRatingTypeGrade) {
    const gradeOptions = skill.grades.split('\n');
    minRating = gradeOptions[minRating];
    maxRating = gradeOptions[maxRating];
  }

  if (minRating && maxRating) {
    result = ` (${minRating} - ${maxRating})`;
  } else if (minRating) {
    result = ` (> ${minRating})`;
  } else if (maxRating) {
    result = ` (< ${maxRating})`;
  }

  return (
    <span>
      {skill.required && <span className="skill-is-required">* </span>}
      <span className={`${skill.deleted && 'strikeThrough'}`}>
        {skill.name}
      </span>
      {result}
      {hasNext && ', '}
    </span>
  );
};
