import * as React from "react";
import { connect } from "react-redux";
import { Table } from "semantic-ui-react";
import { fetchCountryCurrentData } from "../redux/actions";

type Props = {
  tableData: Record<string, string | number> | null;
  fetchCountryCurrentData: () => void;
};

function DataTable(props: Props) {
  const { tableData, fetchCountryCurrentData } = props;

  React.useEffect(() => {
    if (!tableData) {
      fetchCountryCurrentData();
    }
  }, [tableData, fetchCountryCurrentData]);

  // Function to render given date
  const renderDate = () => {
    if (!tableData) return null;

    const { dateChecked } = tableData;

    return new Date(dateChecked).toLocaleDateString();
  };

  // Function to render rows when data is injected
  const renderRows = () => {
    if (!tableData) return null;

    const {
      hospitalizedIncrease,
      positiveIncrease,
      deathIncrease,
      negativeIncrease,
      totalTestResultsIncrease,
    } = tableData;

    return (
      <>
        <Table.Row>
          <Table.Cell>Hospitalized</Table.Cell>
          <Table.Cell>{hospitalizedIncrease}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Positives</Table.Cell>
          <Table.Cell>{positiveIncrease}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Negatives</Table.Cell>
          <Table.Cell>{negativeIncrease}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Dead</Table.Cell>
          <Table.Cell>{deathIncrease}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Daily Tests</Table.Cell>
          <Table.Cell>{totalTestResultsIncrease}</Table.Cell>
        </Table.Row>
      </>
    );
  };

  return (
    <div className="data-table">
      <h4>Daily Stats</h4>
      {renderDate()}
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Category</Table.HeaderCell>
            <Table.HeaderCell>Increase</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{renderRows()}</Table.Body>
      </Table>
    </div>
  );
}

const mapStateToProps = (state: Record<string, any>) => {
  return {
    tableData: state.country.tableData,
  };
};
export default connect(mapStateToProps, { fetchCountryCurrentData })(DataTable);
