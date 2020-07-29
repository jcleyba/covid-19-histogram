import * as React from "react";
import { connect } from "react-redux";
import { Dropdown, DropdownProps } from "semantic-ui-react";
import {
  fetchCountryData,
  fetchDataByState,
  fetchStatesList,
} from "../redux/actions";

type Props = {
  statesList: Record<string, string>[];
  fetchStatesList: () => void;
  fetchCountryData: () => void;
  fetchDataByState: (state: string) => void;
};

function StatesSelector(props: Props) {
  const {
    statesList,
    fetchStatesList,
    fetchDataByState,
    fetchCountryData,
  } = props;

  React.useEffect(() => {
    if (!statesList?.length) {
      fetchStatesList();
    }
  }, [statesList, fetchStatesList]);

  // Dropdown selection handler
  function handleSelectionChange(
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) {
    const { value = null } = data;

    if (!value || value === "") {
      fetchCountryData();
    } else {
      fetchDataByState(value as string);
    }
  }

  // Parsing data to adapt to Semantic UI Dropdown
  function formatStatesData() {
    if (!statesList) return [];

    return statesList.map((singleState: Record<string, string>) => ({
      key: singleState.state,
      text: singleState.name,
      value: singleState.state,
    }));
  }

  return (
    <Dropdown
      placeholder="Select State"
      selection
      options={formatStatesData()}
      search
      onChange={handleSelectionChange}
      clearable
    ></Dropdown>
  );
}

const mapStateToProps = (state: Record<string, any>) => {
  return {
    statesList: state.usStates.statesList,
  };
};
export default connect(mapStateToProps, {
  fetchStatesList,
  fetchDataByState,
  fetchCountryData,
})(StatesSelector);
