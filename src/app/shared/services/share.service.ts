import { Injectable } from "@angular/core";
import type { Statistic } from "../models/models";

@Injectable({
  providedIn: "root",
})
export class ShareService {
  createDashboardUrl(statistics: Statistic[]) {
    const json = JSON.stringify(statistics);
    const encoded = this.encode(json);

    return `${window.location.origin}/dashboard#${encoded}`;
  }

  readStatisticsFromUrl(): Statistic[] | null {
    const hash = window.location.hash;

    if (!hash.startsWith("#")) {
      return null;
    }

    const encoded = hash.slice(1);

    if (!encoded) {
      return null;
    }

    try {
      const json = this.decode(encoded);
      const parsed: unknown = JSON.parse(json);

      if (!Array.isArray(parsed)) {
        return null;
      }

      return parsed as Statistic[];
    } catch {
      return null;
    }
  }

  private encode(value: string) {
    const bytes = new TextEncoder().encode(value);

    let binary = "";

    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
  }

  private decode(value: string) {
    const base64 = value.replaceAll("-", "+").replaceAll("_", "/");

    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

    const binary = atob(padded);

    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

    return new TextDecoder().decode(bytes);
  }
}
