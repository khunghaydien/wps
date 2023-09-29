import * as React from 'react';
import loadable from 'react-loadable';
import { RouteComponentProps } from 'react-router';
import * as Router from 'react-router-dom';

type DynamicComponentType = () => Promise<{
  default: React.ComponentType<any>;
}>;

type RouteComponentType = React.ComponentType<any> | DynamicComponentType;
/**
 * Route
 *
 * ルート
 */
export type Route = {
  /**
   * PATH
   *
   * パス
   */
  path: string;

  /**
   * Component
   *
   * コンポーネント
   */
  component?: RouteComponentType;

  /**
   * A flag to enable dynamic import
   *
   * Dynamic importを有効にします
   */
  dynamicImport?: boolean;

  /**
   * A flag of behavior matching path
   * true: A slash in the trailing path is matched
   * false: A slash in the trailing path is ignored
   *
   * パスに厳密にマッチするかどうか
   * true: パスの末尾スラッシュまでマッチ
   * false: パスの末尾スラッシュは見ない
   */
  strict?: boolean;

  /**
   * A flag to enable case sensitive matching
   * true: Case sensitive
   * false: Case insensitive
   *
   * true: 大文字小文字を区別する
   * false: 大文字小文字を区別しない
   */
  sensitive?: boolean;

  /**
   * Child routes
   *
   * 子ルート
   */
  children?: Array<Route>;

  /**
   * Redirect
   *
   * リダイレクト
   */
  redirect?: string | Router.Redirect;

  /**
   * Transition animation which is fired on child routes
   *
   * ページ遷移時に[子要素]へ適用されるtransition
   */
  transition?: React.ComponentType<any>;

  /**
   * Map "Router Context" to props.
   * It is useful to convert route parameters to props
   *
   * Router ContextをPropsへマップします。
   * パラメーターをPropsへ変化するときに役に立ちます。
   */
  mapParamsToProps?: (context: RouteComponentProps) => Record<string, any>;
};

/**
 * Configuration of routes
 *
 * ルート設定
 */
export type RouteConfig = Route[];

/**
 * Content rendered by RouteRenderer
 */
class RouteContent extends React.Component<{
  route: Route;
  context: RouteComponentProps;
  children: React.ReactNode;
}> {
  shouldComponentUpdate(
    nextProps: {
      route: Route;
      context: RouteComponentProps;
      children: React.ReactNode;
    }
    // _nextState: void,
    // _nextContext: any
  ): boolean {
    return this.props.context.location.key !== nextProps.context.location.key;
  }

  render() {
    if (!this.props.route.component) {
      return this.props.children;
    }

    const Transition = this.props.route.transition;
    const mapParamsToProps =
      this.props.route.mapParamsToProps || ((_x) => ({}));
    const Component = this.props.route.dynamicImport
      ? (loadable({
          loader: this.props.route.component as DynamicComponentType,
          loading: () => null,
        }) as React.ComponentType<any>)
      : (this.props.route.component as React.ComponentType<any>);

    return (
      <Component
        {...this.props.context}
        {...mapParamsToProps(this.props.context)}
      >
        {Transition ? (
          <Transition transitionKey={this.props.context.location.key || 'none'}>
            {this.props.children}
          </Transition>
        ) : (
          this.props.children
        )}
      </Component>
    );
  }
}

/**
 * Render routes
 *
 * ルートをレンダリングします。
 */
const RouteRenderer = (route: Route) => {
  const isTailComponent = (route.children || []).length === 0;
  return (
    <React.Fragment key={route.path}>
      {route.redirect !== undefined && route.redirect !== null ? (
        <Router.Route
          exact
          path={route.path}
          render={() => <Router.Redirect to={route.redirect || ''} />}
        />
      ) : null}
      <Router.Route
        exact={isTailComponent}
        strict={route.strict || false}
        sensitive={route.sensitive || false}
        path={route.path}
        render={(routerContext) => (
          <RouteContent context={routerContext} route={route}>
            <Router.Switch location={routerContext.location}>
              {(route.children || []).map((child: Route, index: number) => (
                <RouteRenderer
                  key={`${index}`}
                  {...child}
                  path={`${route.path}/${child.path}`.replace(/\/\//, '/')}
                />
              ))}
            </Router.Switch>
          </RouteContent>
        )}
      />
    </React.Fragment>
  );
};

/**
 * Render routes
 *
 * ルートをレンダリングします
 */
const renderRoutes = (config: RouteConfig): React.ReactElement => {
  return (
    <React.Fragment>
      {config.map((route, index) => {
        return <RouteRenderer key={index} {...route} />;
      })}
    </React.Fragment>
  );
};

export default renderRoutes;
