// Hidden practice bank: original problems that never appear on the home page or
// in the problem bank. They feed the mock exam, the quick exam, and quick proofs.
import { BANK_PROBABILITY } from "./probability";
import { BANK_EXPECTATION } from "./expectation";
import { BANK_GRAPHS } from "./graphs";
import { BANK_TREES } from "./trees";
import { BANK_MATCHINGS } from "./matchings";
import { BANK_INDUCTION } from "./induction";

export const HIDDEN = [
  ...BANK_PROBABILITY,
  ...BANK_EXPECTATION,
  ...BANK_GRAPHS,
  ...BANK_TREES,
  ...BANK_MATCHINGS,
  ...BANK_INDUCTION,
];
