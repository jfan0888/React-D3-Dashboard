export const UPDATE_USER_EMAIL = 'UPDATE_USER_EMAIL';
export const UPDATE_USER_PHONE = 'UPDATE_USER_PHONE';

export function updateUserEmail(data) {
  return {
    type: UPDATE_USER_EMAIL,
    payload: data,
  };
}

export function updateUserPhone(data) {
  return {
    type: UPDATE_USER_PHONE,
    payload: data,
  };
}
