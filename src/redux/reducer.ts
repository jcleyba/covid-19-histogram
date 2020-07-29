import { combineReducers } from "redux";
import { actionTypes } from "./actions";
import { getLastWeekData, getLastMonthData } from "../utils";
import { CovidRecord } from "../components/Chart";

export type ContryState = {
  dataset: CovidRecord[];
  filteredDataset: CovidRecord[];
  selectedFilter: "all_time" | "last_week" | "last_month";
  tableData: Record<string, string | number> | null;
  loading: boolean;
  error: string | null;
};

const INITIAL_COUNTRY_STATE: ContryState = {
  dataset: [],
  filteredDataset: [],
  selectedFilter: "all_time",
  tableData: null,
  loading: false,
  error: null,
};

function countryReducer(
  state = INITIAL_COUNTRY_STATE,
  action: { type: string; payload?: any }
) {
  switch (action.type) {
    case actionTypes.FETCHING_DATASET:
      return { ...state, loading: true };

    case actionTypes.FETCH_DATASET_SUCCESS:
      return {
        ...state,
        loading: false,
        dataset: action.payload,
        selectedState: null,
      };

    case actionTypes.FETCH_DATASET_FAILED:
      return { ...state, loading: false, error: action.payload };

    case actionTypes.FILTER_ALL_TIME:
      return { ...state, filteredDataset: [], selectedFilter: "all_time" };

    case actionTypes.FILTER_LAST_WEEK:
      return {
        ...state,
        filteredDataset: getLastWeekData(state.dataset),
        selectedFilter: "last_week",
      };

    case actionTypes.FILTER_LAST_MONTH:
      return {
        ...state,
        filteredDataset: getLastMonthData(state.dataset),
        selectedFilter: "last_month",
      };

    case actionTypes.FETCH_BY_DATE_SUCCESS:
      return { ...state, tableData: action.payload };

    default:
      return { ...state };
  }
}

export type USStatesState = {
  statesList: Record<string, string | number>[];
  selectedState: string | null;
  loading: boolean;
  error: string | null;
};

const INITIAL_USSTATES_STATE: USStatesState = {
  statesList: [],
  selectedState: null,
  loading: false,
  error: null,
};

function USStatesReducer(
  state = INITIAL_USSTATES_STATE,
  action: { type: string; payload?: any }
) {
  switch (action.type) {
    case actionTypes.FETCHING_STATE_INFO:
      return { ...state, loading: true };

    case actionTypes.FETCHING_STATE_INFO_SUCCESS:
      return { ...state, loading: false, statesList: action.payload };

    case actionTypes.FETCHING_STATE_INFO_FAILED:
      return { ...state, loading: false, error: action.payload };

    case actionTypes.SELECT_STATE:
      return { ...state, selectedState: action.payload };

    default:
      return { ...state };
  }
}

export default combineReducers({
  usStates: USStatesReducer,
  country: countryReducer,
});
