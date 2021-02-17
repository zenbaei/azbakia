import {
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';
import {
  EventListenerCallback,
  EventMapCore,
  NavigationAction,
  StackNavigationState,
} from '@react-navigation/native';
import {StackNavigationEventMap} from '@react-navigation/stack/lib/typescript/src/types';

export class StackNavigationPropStub<
  T extends Record<string, object>,
  K extends keyof T
> implements StackNavigationProp<T, K> {
  navigate<RouteName extends keyof T>(
    ...args: undefined extends T[RouteName]
      ? [RouteName] | [RouteName, T[RouteName]]
      : [RouteName, T[RouteName]]
  ): void;
  navigate<RouteName extends keyof T>(
    route:
      | {key: string; params?: T[RouteName]}
      | {name: RouteName; key?: string; params: T[RouteName]},
  ): void;
  navigate(route?: any, ...rest: any[]) {}
  protected?: {a: T; b: keyof T; c: {}} & {
    a: T;
    b: K;
    c: StackNavigationEventMap;
  };

  setParams(params: Partial<T[K]>): void {
    throw new Error('Method not implemented.');
  }
  setOptions(options: Partial<StackNavigationOptions>): void {
    throw new Error('Method not implemented.');
  }
  addListener(type, callback): () => void {
    throw new Error('Method not implemented.');
  }
  removeListener(type, callback): void {
    throw new Error('Method not implemented.');
  }
  replace<RouteName extends keyof T = string>(...args): void {
    throw new Error('Method not implemented.');
  }
  push<RouteName extends keyof T>(...args): void {
    throw new Error('Method not implemented.');
  }
  pop(count?: number): void {
    throw new Error('Method not implemented.');
  }
  popToTop(): void {
    throw new Error('Method not implemented.');
  }
  params: object;
  dispatch(
    action: NavigationAction | ((state: StackNavigationState<T>) => {}),
  ) {}

  reset() {}
  goBack() {}

  isFocused(): boolean {
    return true;
  }

  canGoBack(): boolean {
    return true;
  }

  dangerouslyGetState(): StackNavigationState<T> {
    return {
      index: 1,
      key: 'key1',
      routeNames: [],
      type: 'stack',
      stale: false,
      routes: [],
    };
  }
  dangerouslyGetParent() {
    return undefined;
  }
}
