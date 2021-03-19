export const SET_ROOM_TEMP = "SET_ROOM_TEMP";

export function setRoomTemp(value) {
  return {
    type: SET_ROOM_TEMP,
    roomData: value,
  };
}
