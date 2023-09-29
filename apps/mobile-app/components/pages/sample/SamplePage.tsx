import React from 'react';

import './SamplePage.scss';

const ROOT = 'mobile-app-pages-sample-page';

export default (props: any) => (
  <section className={ROOT} style={{ backgroundColor: props.color }}>
    <h1 className="text">{props.title}</h1>
  </section>
);
