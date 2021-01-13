import axios from "axios";

function Logout() {
    sessionStorage.clear('token');
    axios.post('http://localhost:8080/logout',
    { token: sessionStorage.getItem('token')});
    //this.props.history.push('/');
    return <div><p>Logout</p></div>;
} 

export default Logout;