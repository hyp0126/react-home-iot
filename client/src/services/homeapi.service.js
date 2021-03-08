import axios from "axios";
import * as DotEnv from "../DotEnv";

async function homeApiGetRoomData() {
  const {
    data: { roomData },
  } = await axios.post(
    DotEnv.ADDRESS_ROOMDATA,
    {},
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return roomData;
}

async function homeApiSetLed(id) {
  axios.post(
    DotEnv.ADDRESS_LED,
    { id: id },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
}

async function homeApiGetTempData(startTime, endTime) {
  const {
    data: { tempMsgs },
  } = await axios.post(
    DotEnv.ADDRESS_TEMPERATURE,
    {
      startTime: startTime,
      endTime: endTime,
      token: sessionStorage.getItem("token"),
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  return tempMsgs;
}

async function homeApiLogin(username, password) {
  const {
    data: { token },
  } = await axios.post(
    DotEnv.ADDRESS_LOGIN,
    { username, password },
    { withCredentials: true }
  );

  return token;
}

function homeApiLogout() {
  axios.post(
    DotEnv.ADDRESS_LOGOUT,
    { token: sessionStorage.getItem("token") },
    { withCredentials: true }
  );
}

export {
  homeApiGetRoomData,
  homeApiSetLed,
  homeApiGetTempData,
  homeApiLogin,
  homeApiLogout,
};
