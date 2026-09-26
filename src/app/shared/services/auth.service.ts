import { Injectable, signal } from "@angular/core";
import { StorageService } from "./storage.service";

@Injectable({ providedIn: "root" })
export class AuthService {
  readonly isAdmin = signal(false);

  constructor(private readonly storage: StorageService) {}

  login(password: string) {
    const valid = password === this.storage.data().adminPassword;
    this.isAdmin.set(valid);

    return valid;
  }

  logout() {
    this.isAdmin.set(false);
  }

  changePassword(currentPassword: string, newPassword: string) {
    if (currentPassword !== this.storage.data().adminPassword || newPassword.length < 6) {
      return false;
    }

    this.storage.savePassword(newPassword);
    return true;
  }
}
