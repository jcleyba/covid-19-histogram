import format from "date-fns/format";
import subMonths from "date-fns/subMonths";
import subWeeks from "date-fns/subWeeks";
import { CovidRecord } from "./components/Chart";

// Adapter to native fetch function to avoid chaining of Promise responses and
// catching errors
export async function fetchAdapter(
  url: string,
  options: RequestInit
): Promise<any> {
  return fetch(url, options).then((response: Response) => {
    if (response.status >= 400) {
      throw new Error(
        `Bad response from server: ${response.status} - ${response.statusText}`
      );
    }

    const contentType = response?.headers?.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return response.json();
    }

    return response.text();
  });
}

// Get data filtered by last 7 days
export function getLastWeekData(data: CovidRecord[]) {
  return filterDataByDateRange(data, subWeeks(new Date(), 1));
}

// Get data filtered by last 30 days
export function getLastMonthData(data: CovidRecord[]) {
  return filterDataByDateRange(data, subMonths(new Date(), 1));
}

// Utility to get filtered data by a given date to act as pivot point
function filterDataByDateRange(data: CovidRecord[], point: Date) {
  if (!data) return [];

  const date = format(point, "yyyyMMdd");

  const filtered = data.filter((d: CovidRecord) => d.date >= date);

  return filtered;
}
