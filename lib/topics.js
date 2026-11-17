export const TOPICS = [
  {
    slug: "probability",
    name: "Probability",
    short: "Probability",
    blurb: "Conditioning, Bayes, independence, and the big inequalities.",
    lectures: "5H, 7T, 8H, 9H, 10H",
  },
  {
    slug: "expectation",
    name: "Expectation & variance",
    short: "Expectation",
    blurb: "Linearity with indicators, stopping processes, geometric and binomial.",
    lectures: "8H, 9H, 10H",
  },
  {
    slug: "graphs",
    name: "Graphs",
    short: "Graphs",
    blurb: "Degrees, Eulerian graphs, cut edges, colouring, and Hamiltonicity.",
    lectures: "5T, 9T, 8T",
  },
  {
    slug: "trees",
    name: "Trees",
    short: "Trees",
    blurb: "Leaves, edge counts, spanning trees, and degree-counting proofs.",
    lectures: "5T, 6T, 8T",
  },
  {
    slug: "matchings",
    name: "Matchings & Hall",
    short: "Matchings",
    blurb: "Augmenting paths, maximal vs. maximum, and Hall's theorem.",
    lectures: "10T, 11T",
  },
  {
    slug: "induction",
    name: "Induction & pigeonhole",
    short: "Induction",
    blurb: "Weak and strong induction, flawed proofs, and pigeonhole tricks.",
    lectures: "3T, 4T, 4H, 5H",
  },
];

export const TOPIC_BY_SLUG = Object.fromEntries(TOPICS.map((t) => [t.slug, t]));

export const DIFFICULTY = { 1: "Warm-up", 2: "Exam-level", 3: "Stretch" };
export const KIND = { proof: "Proof", compute: "Compute", short: "Short answer", flaw: "Find the flaw" };
