import * as React from "react";
import { Dropdown, DropdownProps } from "semantic-ui-react";
import { useDispatch, connect } from "react-redux";
import { actionTypes } from "../redux/actions";

const options = {
  ALL_TIME: "all_time",
  LAST_MONTH: "last_month",
  LAST_WEEK: "last_week",
};

type Props = {
  selected: "all_time" | "last_month" | "last_week";
};

function DateIntervalSelector(props: Props) {
  const dispatch = useDispatch();

  // Dropdwon selection handler
  function handleSelectionChange(
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) {
    switch (data.value) {
      case options.LAST_WEEK:
        return dispatch({ type: actionTypes.FILTER_LAST_WEEK });

      case options.LAST_MONTH:
        return dispatch({ type: actionTypes.FILTER_LAST_MONTH });

      case options.ALL_TIME:
      default:
        return dispatch({ type: actionTypes.FILTER_ALL_TIME });
    }
  }

  return (
    <Dropdown
      placeholder="Select Time lapse"
      selection
      options={[
        { key: options.ALL_TIME, text: "All Time", value: options.ALL_TIME },
        { key: options.LAST_WEEK, text: "Last Week", value: options.LAST_WEEK },
        {
          key: options.LAST_MONTH,
          text: "Last Month",
          value: options.LAST_MONTH,
        },
      ]}
      value={props.selected}
      onChange={handleSelectionChange}
    ></Dropdown>
  );
}
const mapStateToProps = (state: Record<string, any>) => {
  return {
    selected: state.country.selectedFilter,
  };
};
export default connect(mapStateToProps)(DateIntervalSelector);
