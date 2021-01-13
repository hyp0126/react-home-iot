import axios from "axios";
import * as DotEnv from './DotEnv';

function Logout() {
    sessionStorage.clear('token');
    axios.post(DotEnv.ADDRESS_LOGOUT,
    { token: sessionStorage.getItem('token')});
    //this.props.history.push('/');
    return <div><p>Logout</p></div>;
} 

export default Logout;