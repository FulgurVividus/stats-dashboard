import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../shared/services/auth.service";

@Component({
  imports: [],
  selector: "app-home",
  styleUrl: "./home.component.css",
  templateUrl: "./home.component.html",
})
export class HomeComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  observer() {
    this.auth.logout();
    this.router.navigateByUrl("/dashboard");
  }

  admin() {
    this.router.navigateByUrl("/admin");
  }
}
