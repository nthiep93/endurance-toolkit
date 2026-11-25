import { isPos } from "./_util";

/** stride length (m) = speed (m/min) / cadence (steps/min) */
export function strideLengthM(paceSecPerKm: number, cadenceSpm: number): number | null {
  if (!isPos(paceSecPerKm) || !isPos(cadenceSpm)) return null;
  const r = 60000 / paceSecPerKm / cadenceSpm;
  return isPos(r) ? r : null;
}

/** cadence (steps/min) = speed (m/min) / stride (m) */
export function cadenceForPace(paceSecPerKm: number, strideM: number): number | null {
  if (!isPos(paceSecPerKm) || !isPos(strideM)) return null;
  const r = 60000 / paceSecPerKm / strideM;
  return isPos(r) ? r : null;
}

/** pace (s/km) = 60000 / (cadence * stride) */
export function paceFromCadenceStride(cadenceSpm: number, strideM: number): number | null {
  if (!isPos(cadenceSpm) || !isPos(strideM)) return null;
  const r = 60000 / (cadenceSpm * strideM);
  return isPos(r) ? r : null;
}
