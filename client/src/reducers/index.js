import { SET_ROOM_TEMP } from "../actions";
import { combineReducers } from "redux";

const roomTempInitialState = {
  roomData: [],
};

const room = (state = roomTempInitialState, action) => {
  switch (action.type) {
    case SET_ROOM_TEMP:
      return Object.assign({}, state, {
        roomData: action.roomData,
      });
    default:
      return state;
  }
};

const rootReducer = combineReducers({ room });

export default rootReducer;
