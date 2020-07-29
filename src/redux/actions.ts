import { Dispatch } from "redux";
import { fetchAdapter } from "../utils";

const API_ENDPOINT_BASE = "https://covidtracking.com/api/v1";

export const actionTypes = {
  FETCHING_DATASET: "FETCHING_DATASET",
  FETCH_DATASET_SUCCESS: "FETCH_SUCCESS",
  FETCH_DATASET_FAILED: "FETCH_FAILED",
  FETCHING_BY_DATE: "FETCHING_BY_DATE",
  FETCH_BY_DATE_SUCCESS: "FETCH_BY_DATE_SUCCESS",
  FETCHING_STATE_INFO: "FETCHING_STATE_INFO",
  FETCHING_STATE_INFO_SUCCESS: "FETCHING_STATE_INFO_SUCCESS",
  FETCHING_STATE_INFO_FAILED: "FETCHING_STATE_INFO_FAILED",
  FILTER_LAST_WEEK: "FILTER_LAST_WEEK",
  FILTER_LAST_MONTH: "FILTER_LAST_MONTH",
  FILTER_ALL_TIME: "FILTER_ALL_TIME",
  SELECT_STATE: "SELECT_STATE",
};

// Function to fetch full country daily stats
export const fetchCountryData = () => {
  return async (
    dispatch: Dispatch<{ type: string; payload?: any }>,
    getState: Function
  ) => {
    try {
      dispatch({ type: actionTypes.SELECT_STATE, payload: null });
      dispatch({ type: actionTypes.FETCHING_DATASET });

      const data = await fetchAdapter(`${API_ENDPOINT_BASE}/us/daily.json`, {});

      dispatch({ type: actionTypes.FETCH_DATASET_SUCCESS, payload: data });

      // Filter data if applicable
      filterBySelected(dispatch, getState);
    } catch (e) {
      console.error(e);
      dispatch({ type: actionTypes.FETCH_DATASET_FAILED, payload: e });
    }
  };
};

// Function to fetch current day country data
export const fetchCountryCurrentData = () => {
  return async (dispatch: Dispatch<{ type: string; payload?: any }>) => {
    try {
      dispatch({ type: actionTypes.FETCHING_BY_DATE });

      const [data] = await fetchAdapter(
        `${API_ENDPOINT_BASE}/us/current.json`,
        {}
      );

      dispatch({ type: actionTypes.FETCH_BY_DATE_SUCCESS, payload: data });
    } catch (e) {
      console.error(e);
      dispatch({ type: actionTypes.FETCH_DATASET_FAILED, payload: e });
    }
  };
};

// Function to fetch states list and state info
export const fetchStatesList = () => {
  return async (dispatch: Dispatch<{ type: string; payload?: any }>) => {
    try {
      dispatch({ type: actionTypes.FETCHING_STATE_INFO });

      const data = await fetchAdapter(
        `${API_ENDPOINT_BASE}/states/info.json`,
        {}
      );

      dispatch({
        type: actionTypes.FETCHING_STATE_INFO_SUCCESS,
        payload: data,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: actionTypes.FETCHING_STATE_INFO_FAILED, payload: e });
    }
  };
};

// Function to fetch all states historic data
export const fetchDataByState = (state: string) => {
  return async (
    dispatch: Dispatch<{ type: string; payload?: any }>,
    getState: Function
  ) => {
    try {
      dispatch({
        type: actionTypes.SELECT_STATE,
        payload: state.toLowerCase(),
      });
      dispatch({ type: actionTypes.FETCHING_DATASET });

      const data = await fetchAdapter(
        `${API_ENDPOINT_BASE}/states/${state.toLowerCase()}/daily.json`,
        {}
      );

      dispatch({ type: actionTypes.FETCH_DATASET_SUCCESS, payload: data });

      // Filter data if applicable
      filterBySelected(dispatch, getState);
    } catch (e) {
      console.error(e);
      dispatch({ type: actionTypes.FETCH_DATASET_FAILED, payload: e });
    }
  };
};

// Function to fetch country or state data for a given date
export const fetchDataByDate = (date: string) => {
  return async (
    dispatch: Dispatch<{ type: string; payload?: any }>,
    getState: Function
  ) => {
    const { usStates } = getState();

    // Check URL to fetch data for a given state or full country
    const uri = usStates.selectedState
      ? `states/${usStates.selectedState}/${date}.json`
      : `us/${date}.json`;
    try {
      dispatch({ type: actionTypes.FETCHING_BY_DATE });

      const data = await fetchAdapter(`${API_ENDPOINT_BASE}/${uri}`, {});

      dispatch({ type: actionTypes.FETCH_BY_DATE_SUCCESS, payload: data });
    } catch (e) {
      console.error(e);
      dispatch({ type: actionTypes.FETCH_DATASET_FAILED, payload: e });
    }
  };
};

// Utility function to filter data if filter is selected and data has updated succesfully
const filterBySelected = (
  dispatch: Dispatch<{ type: string; payload?: any }>,
  getState: Function
) => {
  const filter = getState().country.selectedFilter;

  switch (filter) {
    case "last_week":
      return dispatch({ type: actionTypes.FILTER_LAST_WEEK });
    case "last_month":
      return dispatch({ type: actionTypes.FILTER_LAST_MONTH });
    default:
      return dispatch({ type: actionTypes.FILTER_ALL_TIME });
  }
};
