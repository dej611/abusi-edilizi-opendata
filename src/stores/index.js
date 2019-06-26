import {combineReducers} from 'redux';

export const HOVER_AREA = 'HOVER_AREA';
export const HOVER_YEAR = 'HOVER_YEAR';
export const HOVER_CLEAR = 'HOVER_CLEAR';
export const SELECT_AREA = 'SELECT_AREA';
export const SELECT_YEAR = 'SELECT_YEAR';
export const CLEAR = 'CLEAR';
export const HOVER_REGION = 'HOVER_REGION';
export const SELECT_TOWN = 'SELECT_TOWN';
export const CLEAR_TOWN = 'CLEAR_TOWN';
export const CHANGE_LANG = 'CHANGE_LANG';

const INITIAL_STATE = {
  selected_area: null,
  selected_year: null,
  selected_town: null,
  hover_area: null,
  hover_year: null,
  hover_offset: 0,
  hover_region: null,
  language: 'it',
};

function navigation(state = INITIAL_STATE, action) {
  switch (action.type) {
    case HOVER_REGION:
      return {
        ...state,
        hover_region: action.area,
      };
    case HOVER_AREA:
      return {
        ...state,
        hover_area: action.area,
      };
    case HOVER_YEAR:
      return {
        ...state,
        hover_year: action.value,
        hover_offset: action.offset,
      };
    case HOVER_CLEAR:
      return {
        ...state,
        hover_area: null,
        hover_year: null,
        hover_offset: null,
      };
    case SELECT_AREA:
      return {
        ...state,
        selected_area: action.area,
      };
    case SELECT_YEAR:
      return {
        ...state,
        selected_year: action.value,
      };
    case SELECT_TOWN:
      return {
        ...state,
        selected_town: action.town,
      };
    case CLEAR_TOWN:
      return {
        ...state,
        selected_town: null,
      };
    case CHANGE_LANG:
      return {
        ...state,
        language: action.lang,
      };
    case CLEAR:
      return {
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
}

export default combineReducers({navigation});
