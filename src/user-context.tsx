// CounterContext.tsx
import {Cart} from 'domain/user/user';
import React from 'react';

// Declaring the state object globally.
const initialUserState = {
  cart: [] as Cart[],
  favs: [] as string[],
};

const userContextWrapper = (component?: React.Component) => ({
  ...initialUserState,
  setCart: (cart: Cart[]) => {
    initialUserState.cart = cart;
    component?.setState({context: userContextWrapper(component)});
  },
  setFavs: (favs: string[]) => {
    initialUserState.favs = favs;
    component?.setState({context: userContextWrapper(component)});
  },
});

type Context = ReturnType<typeof userContextWrapper>;

export const UserContext = React.createContext<Context>(userContextWrapper());

interface State {
  context: Context;
}

export class UserContextProvider extends React.Component {
  state: State = {
    context: userContextWrapper(this),
  };

  render() {
    return (
      <UserContext.Provider value={this.state.context}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
