import { Component, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { StorageService } from "../shared/services/storage.service";
import { ShareService } from "../shared/services/share.service";
import type { Statistic } from "../shared/models/models";

@Component({
  imports: [RouterLink],
  selector: "app-dashboard",
  styleUrl: "./dashboard.component.css",
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
  private readonly storage = inject(StorageService);
  private readonly share = inject(ShareService);

  readonly statistics = signal<Statistic[]>(this.loadStatistics());

  private loadStatistics(): Statistic[] {
    return this.share.readStatisticsFromUrl() ?? this.storage.data().statistics;
  }
}
