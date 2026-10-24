/**
 * Energy, Cost and Telemetry Formatting Helpers
 * Strictly handles domain units: kW, kWh, %, NGN/kWh, and timestamps.
 */

/**
 * Format active power demand or generation in kilowatts (kW)
 */
export function formatPower(valInKw: number, fractionDigits = 1): string {
  return `${valInKw.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })} kW`;
}

/**
 * Format accumulated or battery capacity in kilowatt-hours (kWh)
 */
export function formatEnergy(valInKwh: number, fractionDigits = 1): string {
  return `${valInKwh.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })} kWh`;
}

/**
 * Format currency in Nigerian Naira (NGN)
 */
export function formatCurrency(amount: number, currency: string = "NGN", fractionDigits = 0): string {
  if (currency === "NGN") {
    return `₦${amount.toLocaleString(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })}`;
  }
  return `${currency} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

/**
 * Format cost per unit energy (e.g. ₦/kWh)
 */
export function formatTariff(amountPerKwh: number, currency: string = "NGN"): string {
  return `${formatCurrency(amountPerKwh, currency, 2)}/kWh`;
}

/**
 * Format battery state of charge or percentage metric
 */
export function formatPercentage(val: number, fractionDigits = 0): string {
  return `${val.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}%`;
}

/**
 * Format human-readable timestamps for telemetry and events
 */
export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Format full date and time for audits and records
 */
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
