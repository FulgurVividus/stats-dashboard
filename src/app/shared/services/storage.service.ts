import { Injectable, signal } from "@angular/core";
import type { DashboardData, Statistic } from "../models/models";

const STORAGE_KEY = "stat-dashboard-data-v1";
const DEFAULT_PASSWORD = "admin123";

const initialData: DashboardData = {
  adminPassword: DEFAULT_PASSWORD,
  statistics: [],
};

@Injectable({ providedIn: "root" })
export class StorageService {
  readonly data = signal<DashboardData>(this.load());

  saveStatistics(statistics: Statistic[]) {
    this.persist({ ...this.data(), statistics });
  }

  savePassword(adminPassword: string) {
    this.persist({ ...this.data(), adminPassword });
  }

  reset() {
    this.persist(initialData);
  }

  private persist(data: DashboardData) {
    this.data.set(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  private load(): DashboardData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        return initialData;
      }

      const parsed: unknown = JSON.parse(raw);

      if (this.isDashboardData(parsed)) return parsed;
    } catch (error) {
      console.log(error);
    }

    return initialData;
  }

  private isDashboardData(value: unknown): value is DashboardData {
    if (!value || typeof value !== "object") return false;

    const item = value as Record<string, unknown>;

    return typeof item["adminPassword"] === "string" && Array.isArray(item["statistics"]);
  }
}
