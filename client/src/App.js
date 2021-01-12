import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Chart from './routes/Chart';
import Guage from './routes/Guage';
import Login from './routes/Login';
import Logout from './routes/Logout';
import Navigation from "./components/Navigation";
import './App.css';

function App() {
  return (
      <HashRouter>
        <Navigation />
        <Route path="/" exact={true} component={Guage} />
        <Route path="/chart" component={Chart} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
      </HashRouter>
  );
}

export default App;
