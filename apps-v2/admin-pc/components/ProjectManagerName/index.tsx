import React from 'react';

const ProjectManagerNameComponent = (props) => (
  <input
    className="ts-text-field slds-input"
    type="text"
    disabled
    value={props.pmName}
  />
);

export default ProjectManagerNameComponent;
