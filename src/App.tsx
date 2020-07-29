import * as React from "react";
import { connect } from "react-redux";
import { Dimmer, Loader } from "semantic-ui-react";
import "./App.css";
import Chart, { CovidRecord } from "./components/Chart";
import DataTable from "./components/DataTable";
import DateIntervalSelector from "./components/DateInvervalSelector";
import StatesSelector from "./components/StatesSelector";
import { fetchCountryData, fetchDataByDate } from "./redux/actions";

type AppProps = {
  filteredData: CovidRecord[];
  dataset: CovidRecord[];
  fetchCountryData: () => void;
  fetchDataByDate: (date: string) => void;
  loading: boolean;
};

function App(props: AppProps) {
  const {
    filteredData,
    dataset,
    loading,
    fetchCountryData,
    fetchDataByDate,
  } = props;

  React.useEffect(() => {
    if (!dataset.length) {
      fetchCountryData();
    }
  }, [dataset, fetchCountryData]);

  const renderChart = () => {
    if (loading)
      return (
        <Dimmer active inverted>
          <Loader inverted content="Loading" />
        </Dimmer>
      );

    const chartData = filteredData.length ? filteredData : dataset;

    return <Chart chartData={chartData} onSelect={fetchDataByDate}></Chart>;
  };

  return (
    <div className="App">
      <div className="top-bar">
        <DateIntervalSelector />
        <StatesSelector />
      </div>
      <div className="chart-wrapper">
        {renderChart()}
        <DataTable />
      </div>
      <footer>
        Data source: The Covid Tracking Project https://covidtracking.com/
      </footer>
    </div>
  );
}

const mapStateToProps = (state: Record<string, any>) => {
  return {
    dataset: state.country.dataset,
    filteredData: state.country.filteredDataset,
    loading: state.country.loading,
  };
};

export default connect(mapStateToProps, {
  fetchCountryData,
  fetchDataByDate,
})(App);
