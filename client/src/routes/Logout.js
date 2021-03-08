import { homeApiLogout } from "../services/homeapi.service";

function Logout() {
  homeApiLogout();
  sessionStorage.clear("token");
  //this.props.history.push('/');
  return (
    <div>
      <p>Logout</p>
    </div>
  );
}

export default Logout;
