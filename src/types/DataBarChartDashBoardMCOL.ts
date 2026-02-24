interface DataSetItem {
  label: string;
  data: number[];
  backgroundColor: string;
}

export interface DataBarChartDashBoardMCOL {
  labels: string[];
  datasets: DataSetItem[];
}
