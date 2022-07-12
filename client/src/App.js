import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// create a link to the server
const httpLink = createHttpLink({
  uri: '/graphql'
});

// set context in graphQL requests
const authLink = setContext((_, { headers }) => {
  // get token from localStorage
  const token = localStorage.getItem('id_token');
  
  return {
    headers: {
      ...headers,
      // if there is token, set token to authorization
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// connect the client with the server
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
