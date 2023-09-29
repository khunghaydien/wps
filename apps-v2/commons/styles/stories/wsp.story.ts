/* eslint-disable storybook/default-exports */
// import React from 'react';

// /* eslint-disable import/no-extraneous-dependencies */
// import '../wsp.scss';

// const Center = (style) => (story) => (
//   <div
//     style={{
//       padding: '5em',
//       width: '100%',
//       height: '100vh',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       flexFlow: 'column',
//       ...style,
//     }}
//   >
//     {story()}
//   </div>
// );
// export default {
//   title: '[WIP] WSP Design System/Button',
//   decorators: [(story) => (
//       <div
//         style={{
//           width: '100%',
//           height: '100vh',
//           display: 'flex',
//           justifyContent: 'space-around',
//           alignItems: 'center',
//         }}
//       >
//         {story()}
//       </div>
//     )],
// };
// export const Buttons = () => (
//     <>
//       <button className="wsp-button">Button (same with default)</button>
//       <button className="wsp-button wsp-button--primary">Primary</button>
//       <button className="wsp-button wsp-button--secondary">Secondary</button>
//       <button className="wsp-button wsp-button--error">Error</button>
//       <button className="wsp-button wsp-button--default">Default</button>
//       <button className="wsp-button wsp-button--text">Text</button>
//     </>
//   );
// Buttons.story = {
//   name: 'buttons',
// };
// export const Disabled = () => (
//     <>
//       <button className="wsp-button" disabled>
//         Button (same with default)
//       </button>
//       <button className="wsp-button wsp-button--primary" disabled>
//         Primary
//       </button>
//       <button className="wsp-button wsp-button--secondary" disabled>
//         Secondary
//       </button>
//       <button className="wsp-button wsp-button--error" disabled>
//         Error
//       </button>
//       <button className="wsp-button wsp-button--default" disabled>
//         Default
//       </button>
//       <button className="wsp-button wsp-button--text" disabled>
//         Text
//       </button>
//     </>
//   );
// Disabled.story = {
//   name: 'disabled',
// };
// export default {
//   title: '[WIP] WSP Design System/Card',
//   decorators: [Center()],
// };
// export const Card = () => (
//     <div className="wsp-card">
//       <div className="wsp-card__header">
//         <div className="wsp-card__header-group">
//           <h1 className="wsp-card__title">Title</h1>
//         </div>
//         <div className="wsp-card__header-group--right">
//           <div className="wsp-card__header-group__item">item1</div>
//           <div className="wsp-card__header-group__item">item2</div>
//         </div>
//       </div>
//       <hr className="wsp-card__divider" />
//       <div className="wsp-card__body">
//         Body
//         <div className="wsp-body-1">body-1</div>
//         <div className="wsp-body-2">body-2</div>
//       </div>
//     </div>
//   );
// Card.story = {
//   name: 'card',
// };
// export default {
//   title: '[WIP] WSP Design System/Labels',
//   decorators: [Center()],
// };
// export const Label = () => <div className="wsp-label">default</div>;
// Label.story = {
//   name: 'label',
// };
// export const Round = () => <div className="wsp-label wsp-label--round">Round</div>;
// Round.story = {
//   name: 'round',
// };
// export const Outline = () => (
//     <div className="wsp-label wsp-label--round wsp-label--outline">Outline</div>
//   );
// Outline.story = {
//   name: 'outline',
// };
// export const Small = () => (
//     <div className="wsp-label wsp-label--outline wsp-label--small">Small</div>
//   );
// Small.story = {
//   name: 'small',
// };
// export default {
//   title: '[WIP] WSP Design System',
//   decorators: [Center({
//     alignItems: 'flex-start',
//   })],
// };
// export const Typography = () => (
//     <>
//       <div className="wsp-header-1">Header 1, 20px</div>
//       <div className="wsp-body-1">Body 1, 13px</div>
//       <div className="wsp-body-2">Body 2, 10px</div>
//     </>
//   );
// export default {
//   title: '[WIP] WSP Design System',
//   decorators: [Center({
//     flexFlow: 'row',
//     justifyContent: 'flex-start',
//   })],
// };
// export const GraphColors = () => (
//     <>
//       <div className="wsp-graph-color-1">wsp-graph-color-1</div>
//       <div className="wsp-graph-color-2">wsp-graph-color-2</div>
//       <div className="wsp-graph-color-3">wsp-graph-color-3</div>
//       <div className="wsp-graph-color-4">wsp-graph-color-4</div>
//       <div className="wsp-graph-color-5">wsp-graph-color-5</div>
//       <div className="wsp-graph-color-6">wsp-graph-color-6</div>
//       <div className="wsp-graph-color-7">wsp-graph-color-7</div>
//       <div className="wsp-graph-color-8">wsp-graph-color-8</div>
//       <div className="wsp-graph-color-9">wsp-graph-color-9</div>
//       <div className="wsp-graph-color-10">wsp-graph-color-10</div>
//       <div className="wsp-graph-color-11">wsp-graph-color-11</div>
//       <div className="wsp-graph-color-12">wsp-graph-color-12</div>
//     </>
//   );
