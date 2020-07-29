import { format } from "date-fns";
import Plotly from "plotly.js-basic-dist-min";
import * as React from "react";
import createPlotlyComponent from "react-plotly.js/factory";

const Plot = createPlotlyComponent(Plotly);

export type CovidRecord = {
  date: string;
  dateChecked: string;
  positive: number;
  death: number;
};

type ChartProps = {
  chartData: CovidRecord[];
  onSelect?: (e: string) => void;
};

function Chart(props: ChartProps) {
  const { onSelect, chartData } = props;

  // Parsing data to adapt to Plotly Histogram
  function handleData(data: CovidRecord[]) {
    let x: string[] = [];
    let y: number[] = [];
    let z: number[] = [];

    for (const record of data) {
      x.push(record.dateChecked);
      y.push(record.positive);
      z.push(record.death);
    }

    return [
      {
        x: x.reverse(),
        y,
        name: "# of positives",
        type: "bar",
      },
      {
        x: x.reverse(),
        y: z,
        type: "bar",
        name: "# of deaths",
      },
    ] as Partial<any>[];
  }

  // Single Bar click handler
  function onPointSelect(event: Readonly<any>) {
    const { points } = event;

    if (!points || !points.length) return;

    const date = points[0].x;

    if (onSelect) {
      onSelect(format(new Date(date), "yyyyMMdd"));
    }
  }

  return (
    <Plot
      data={handleData(chartData)}
      layout={{
        title: "Covid-19 USA Histogram",
        barmode: "overlay",
      }}
      config={{ displaylogo: false }}
      onClick={onPointSelect}
    ></Plot>
  );
}

export default Chart;
