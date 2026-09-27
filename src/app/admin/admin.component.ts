import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { StorageService } from "../shared/services/storage.service";
import { AuthService } from "../shared/services/auth.service";
import { Statistic } from "../shared/models/models";
import { ShareService } from "../shared/services/share.service";

@Component({
  imports: [RouterLink],
  selector: "app-admin",
  styleUrl: "./admin.component.css",
  templateUrl: "./admin.component.html",
})
export class AdminComponent {
  private readonly storage = inject(StorageService);
  private readonly auth = inject(AuthService);
  private readonly share = inject(ShareService);
  private readonly router = inject(Router);

  readonly statistics = signal<Statistic[]>(this.storage.data().statistics);
  readonly authenticated = this.auth.isAdmin;

  readonly password = signal("");
  readonly loginError = signal(false);
  readonly showPasswordForm = signal(false);
  readonly currentPassword = signal("");
  readonly newPassword = signal("");
  readonly passwordMessage = signal("");
  readonly passwordError = signal("");

  login(event: Event) {
    event.preventDefault();

    const valid = this.auth.login(this.password());
    this.loginError.set(!valid);

    if (valid) this.password.set("");
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl("/");
  }

  addStatistic() {
    const columns = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"];

    const row = {
      id: crypto.randomUUID(),
      label: "Показатель",
      values: Object.fromEntries(columns.map((column) => [column, 0])),
    };

    this.update((stats) => [
      ...stats,
      {
        id: crypto.randomUUID(),
        title: "Новая статистика",
        columns,
        rows: [row],
      },
    ]);
  }

  deleteStatistic(id: string) {
    this.update((stats) => stats.filter((stat) => stat.id !== id));
  }

  updateTitle(id: string, title: string) {
    this.update((stats) => stats.map((stat) => (stat.id === id ? { ...stat, title } : stat)));
  }

  addColumn(id: string) {
    const name = `Колонка ${this.statistics().find((s) => s.id === id)?.columns.length ?? 1}`;

    this.update((stats) =>
      stats.map((stat) =>
        stat.id === id
          ? {
              ...stat,
              columns: [...stat.columns, name],
              rows: stat.rows.map((row) => ({
                ...row,
                values: { ...row.values, [name]: 0 },
              })),
            }
          : stat,
      ),
    );
  }

  renameColumn(id: string, index: number, name: string) {
    const cleanName = name.trim() || `Колонка ${index + 1}`;

    this.update((stats) =>
      stats.map((stat) => {
        if (stat.id !== id) return stat;

        const oldName = stat.columns[index];
        const columns = stat.columns.map((column, i) => (i === index ? cleanName : column));

        const rows = stat.rows.map((row) => {
          const values = { ...row.values };
          const oldValue = values[oldName] ?? 0;

          delete values[oldName];
          values[cleanName] = oldValue;

          return { ...row, values };
        });

        return { ...stat, columns, rows };
      }),
    );
  }

  removeColumn(id: string, index: number) {
    this.update((stats) =>
      stats.map((stat) => {
        if (stat.id !== id || stat.columns.length <= 1) return stat;

        const removed = stat.columns[index];
        const columns = stat.columns.filter((_, i) => i !== index);

        const rows = stat.rows.map((row) => {
          const values = { ...row.values };
          delete values[removed];

          return { ...row, values };
        });

        return { ...stat, columns, rows };
      }),
    );
  }

  addRow(id: string) {
    this.update((stats) =>
      stats.map((stat) =>
        stat.id === id
          ? {
              ...stat,
              rows: [
                ...stat.rows,
                {
                  id: crypto.randomUUID(),
                  label: "Новая строка",
                  values: Object.fromEntries(stat.columns.map((column) => [column, 0])),
                },
              ],
            }
          : stat,
      ),
    );
  }

  renameRow(statId: string, rowId: string, label: string) {
    this.update((stats) =>
      stats.map((stat) =>
        stat.id === statId
          ? {
              ...stat,
              rows: stat.rows.map((row) => (row.id === rowId ? { ...row, label } : row)),
            }
          : stat,
      ),
    );
  }

  setValue(statId: string, rowId: string, column: string, value: string) {
    const numeric = Number(value);

    this.update((stats) =>
      stats.map((stat) =>
        stat.id === statId
          ? {
              ...stat,
              rows: stat.rows.map((row) =>
                row.id === rowId
                  ? {
                      ...row,
                      values: {
                        ...row.values,
                        [column]: Number.isFinite(numeric) ? numeric : 0,
                      },
                    }
                  : row,
              ),
            }
          : stat,
      ),
    );
  }

  removeRow(statId: string, rowId: string) {
    this.update((stats) =>
      stats.map((stat) =>
        stat.id === statId
          ? {
              ...stat,
              rows: stat.rows.filter((row) => row.id !== rowId),
            }
          : stat,
      ),
    );
  }

  changePassword() {
    this.passwordMessage.set("");
    this.passwordError.set("");

    if (this.newPassword().length < 6) {
      this.passwordError.set("Новый пароль должен содержать минимум 6 символов.");

      return;
    }

    const changed = this.auth.changePassword(this.currentPassword(), this.newPassword());

    if (!changed) {
      this.passwordError.set("Текущий пароль введён неверно.");

      return;
    }

    this.currentPassword.set("");
    this.newPassword.set("");
    this.passwordMessage.set("Пароль изменён.");
  }

  shareDashboard() {
    const url = this.share.createDashboardUrl(this.statistics());

    navigator.clipboard.writeText(url);
    alert("Скопировано!");
  }

  private update(transform: (stats: Statistic[]) => Statistic[]) {
    const next = transform(this.statistics());

    this.statistics.set(next);
    this.storage.saveStatistics(next);
  }
}
