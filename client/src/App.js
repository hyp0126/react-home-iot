import React from "react";
import { HashRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import roomApp from "./reducers";
import Chart from "./routes/Chart";
import Gauge from "./routes/Gauge";
import Login from "./routes/Login";
import Logout from "./routes/Logout";
import Navigation from "./components/Navigation";
import "./App.css";

const store = createStore(roomApp);

function App() {
  // const token = sessionStorage.getItem('token');

  // if(!token) {
  //   return <Login />
  // }

  return (
    <Provider store={store}>
      <HashRouter>
        <Navigation />
        <Route path={["/", "/gauge"]} exact={true} component={Gauge} />
        <Route path="/chart" component={Chart} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
      </HashRouter>
    </Provider>
  );
}

export default App;
