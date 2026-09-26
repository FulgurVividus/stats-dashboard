import { Component, computed, inject } from "@angular/core";
import { StorageService } from "../shared/services/storage.service";
import { RouterLink } from "@angular/router";

@Component({
  imports: [RouterLink],
  selector: "app-dashboard",
  styleUrl: "./dashboard.component.css",
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
  private readonly storage = inject(StorageService);

  readonly statistics = computed(() => this.storage.data().statistics);
}
