import {
  SEARCH_TERM_CHANGED,
} from './constants'

const initialState = {
  walletName: '',
}

export default function walletReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_TERM_CHANGED:
      return {
        ...state,
        walletName: action.data,
      }

    default:
      return state;
  }
}
