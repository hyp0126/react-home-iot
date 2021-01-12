import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Chart from './routes/Chart';
import Guage from './routes/Guage';
import Login from './routes/Login';
import Logout from './routes/Logout';
import Navigation from "./components/Navigation";
import './App.css';

var roomData = [{
  temperature: '20.0',
  humidity: '44.4',
  brightness: '500',
  ledState: '1'
},
{
  temperature: '10.0',
  humidity: '14.4',
  brightness: '100',
  ledState: '0'
}];

function App() {
  return (
      <HashRouter>
        <Navigation />
        <Route path="/" exact={true} render={
          () => <Guage roomData={roomData} />
        } />
        <Route path="/chart" component={Chart} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
      </HashRouter>
  );
}

export default App;
