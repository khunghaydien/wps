/* @flow */
import React from 'react';

import classNames from 'classnames';

import GlobalContainer from '../../commons/containers/GlobalContainer';

// list of api from RemoteRouteAPIMap
import apiList from '../api/api-list.json';
import Prism from '../vendors/prism.min';

import './index.scss';

type Props = {
  response: string,
  executeAPI: (api: string) => void,
};

type State = {
  searchValue: string,
  isSidebarOpen: boolean,
  requestParam: string,
};

const ROOT = 'test-api-root';

export default class TestAPI extends React.Component<Props, State> {
  state = {
    searchValue: '',
    isSidebarOpen: false,
    requestParam: `{
      "path": "/user-setting/get",
      "param": {
      }
}`,
  };

  componentDidUpdate() {
    const code = document.getElementById('test-api-root__code');
    Prism.highlightElement(code);
  }

  callAPI = () => {
    const { requestParam } = this.state;
    this.props.executeAPI(JSON.parse(requestParam));
  };

  handleChange = (e: any) => {
    this.setState({ requestParam: e.target.value });
  };

  handleInput = (e: any) => {
    this.setState({
      searchValue: e.target.value,
    });
  };

  toggleSidebar = () => {
    this.setState((prevState) => ({
      isSidebarOpen: !prevState.isSidebarOpen,
    }));
  };

  setRequestPath = (api: string) => {
    const templateString = `{
      "path": "${api}",
      "param": {
      }
}`;

    return () => {
      this.setState({
        requestParam: templateString,
      });
    };
  };

  renderAPILinks() {
    let apiListFinal = [...apiList];

    if (this.state.searchValue) {
      apiListFinal = apiListFinal.filter((api) => {
        return api.includes(this.state.searchValue);
      });
    }

    return apiListFinal.map((api, index) => {
      const header = api.split('/')[1];
      const prevHeader = apiList[index - 1]
        ? apiListFinal[index - 1].split('/')[1]
        : '';
      const link = (
        <button
          key={`link-${index}`}
          className={`${ROOT}__link`}
          onClick={this.setRequestPath(api)}
        >
          {api}
        </button>
      );

      if (header !== prevHeader) {
        return (
          <React.Fragment key={index}>
            <span key={`header-${index}`} className={`${ROOT}__link-header`}>
              {header}
            </span>
            {link}
          </React.Fragment>
        );
      }

      return link;
    });
  }

  render() {
    const sidebarClass = classNames(`${ROOT}__sidebar`, {
      [`${ROOT}__sidebar--active`]: this.state.isSidebarOpen,
    });
    const containerClass = classNames(`${ROOT}__container`, {
      [`${ROOT}__container--active`]: this.state.isSidebarOpen,
    });
    const toggleIconClass = classNames(`${ROOT}__toggle-icon`, {
      [`${ROOT}__toggle-icon--active`]: this.state.isSidebarOpen,
    });

    return (
      <GlobalContainer>
        <div className={ROOT}>
          <div className={sidebarClass}>
            <button
              className={`${ROOT}__close-btn`}
              onClick={this.toggleSidebar}
            >
              &times;
            </button>
            <div className={`${ROOT}__search-container`}>
              <input
                type="search"
                className={`${ROOT}__search`}
                value={this.state.searchValue}
                onChange={this.handleInput}
                placeholder="Type something to search"
              />
            </div>
            {this.renderAPILinks()}
          </div>

          <div className={containerClass}>
            <button
              className={`${ROOT}__toggle-btn`}
              onClick={this.toggleSidebar}
            >
              <span className={toggleIconClass}>&#9664;</span> Toggle Sidebar
            </button>
            <div className={`${ROOT}__input`}>
              <h2 className={`${ROOT}__header`}>Test your api here</h2>
              <textarea
                className={`${ROOT}__content`}
                onChange={this.handleChange}
                value={this.state.requestParam}
              >
                {this.state.requestParam}
              </textarea>
              <button
                className={`${ROOT}__call-api-btn`}
                onClick={this.callAPI}
              >
                Call API
              </button>
            </div>

            <div className={`${ROOT}__output`}>
              <h2 className={`${ROOT}__header`}>Response Result</h2>
              <pre className={`${ROOT}__content`}>
                <code className="language-json" id={`${ROOT}__code`}>
                  {JSON.stringify(this.props.response, null, 4)}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </GlobalContainer>
    );
  }
}
