import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "dashboard",
    loadComponent: () =>
      import("./dashboard/dashboard.component").then((m) => m.DashboardComponent),
  },
  {
    path: "admin",
    loadComponent: () => import("./admin/admin.component").then((m) => m.AdminComponent),
  },
  {
    path: "**",
    redirectTo: "",
  },
];
