import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Chart from './routes/Chart';
import Gauge from './routes/Gauge';
import Login from './routes/Login';
import Logout from './routes/Logout';
import Navigation from "./components/Navigation";
import './App.css';

function App() {
  // const token = sessionStorage.getItem('token');

  // if(!token) {
  //   return <Login />
  // }

  return (
      <HashRouter>
        <Navigation />
        <Route path={["/", "/gauge"]} exact={true} component={Gauge} />
        <Route path="/chart" component={Chart} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
      </HashRouter>
  );
}

export default App;
