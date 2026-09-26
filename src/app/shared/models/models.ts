export type StatisticRow = {
  id: string;
  label: string;
  values: Record<string, number>;
};

export type Statistic = {
  id: string;
  title: string;
  columns: string[];
  rows: StatisticRow[];
};

export type DashboardData = {
  adminPassword: string;
  statistics: Statistic[];
};
