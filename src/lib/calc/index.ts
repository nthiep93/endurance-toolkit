/**
 * Calculation library — pure functions, no React, no DOM.
 * CONTRACT: UI components import ONLY from "@/lib/calc". Signatures below are fixed;
 * the calc agent implements the bodies in the sibling modules and re-exports here.
 *
 * Units convention: distances in KM, durations in SECONDS, pace in SECONDS PER KM
 * unless a name says otherwise (…PerMile, …Mph).
 */
export * from "./units";
export * from "./time";
export * from "./pace";
export * from "./predictor";
export * from "./vdot";
export * from "./hr";
export * from "./splits";
export * from "./fueling";
export * from "./cadence";
export * from "./vo2max";
export * from "./calories";
