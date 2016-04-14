import React from 'react';
import { Route } from 'react-router';

// Here we define all our material-ui ReactComponents.
import App from './components/App';
import Room from './components/Room';
import NoMatch from './components/NoMatch';

/**
 * Routes: https://github.com/rackt/react-router/blob/master/docs/api/components/Route.md
 *
 * Routes are used to declare your view hierarchy.
 *
 * Say you go to http://material-ui.com/#/components/paper
 * The react router will search for a route named 'paper' and will recursively render its
 * handler and its parent handler like so: Paper > Components > Master
 */
const AppRoutes = (
  <Route path="/" component={App}>
    <Route path="rooms" component={Room}>
      <Route path="/room/:roomId" component={Room}/>
    </Route>
    <Route path="*" component={NoMatch}/>
  </Route>
);

export default AppRoutes;
