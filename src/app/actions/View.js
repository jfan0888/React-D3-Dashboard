export const UPDATE_VIEW_STATE = 'UPDATE_VIEW_STATE';
export const UPDATE_VIEW_MODAL = 'UPDATE_VIEW_MODAL';

export const STATE_LOADING = 'loading';
export const STATE_LANDING = 'landing';
export const MODAL_TYPE_JOIN = 'join';
export const MODAL_TYPE_NOTICE = 'notice';
export const MODAL_SUBTYPE_INPUT = 'input';
export const MODAL_SUBTYPE_VERIFY_PHONE = 'verify_phone';
export const MODAL_SUBTYPE_VERIFY_EMAIL = 'verify_email';
export const MODAL_SUBTYPE_WELCOME = 'welcome';

export function updateViewState(data) {
  return {
    type: UPDATE_VIEW_STATE,
    payload: data,
  };
}

export function updateViewModal(data) {
  return {
    type: UPDATE_VIEW_MODAL,
    payload: data,
  };
}
