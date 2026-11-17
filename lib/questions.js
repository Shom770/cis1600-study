// Original practice questions in the style of CIS 1600 Midterm 2.
// Each question can have several solutions; a proof often has more than one valid route.
// kind: "proof" | "compute" | "short" | "flaw"
// difficulty: 1 (warm-up) | 2 (exam-level) | 3 (stretch)

export const QUESTIONS = [
  // ---------------- PROBABILITY ----------------
  {
    id: "P01",
    topic: "probability",
    kind: "compute",
    difficulty: 1,
    title: "Which coin did I pick?",
    prompt:
      "A bag holds a fair coin and a coin with Pr[heads] = 0.9. You pick one uniformly at random and flip it once. The flip is heads. What is the probability you picked the biased coin?",
    hints: [
      "Write the condition as an event: you want Pr[biased | heads].",
      "Bayes' rule: divide the joint probability of biased-and-heads by the total probability of heads.",
    ],
    solutions: [
      {
        approach: "Bayes' rule",
        text:
          "Let B = biased coin, H = heads.\nPr[H] = (1/2)(1/2) + (1/2)(0.9) = 0.25 + 0.45 = 0.7.\nPr[B | H] = Pr[B]·Pr[H|B] / Pr[H] = (0.5 · 0.9) / 0.7 = 0.45 / 0.7 = 9/14.",
      },
      {
        approach: "Frequency counting",
        text:
          "Imagine 20 equally likely runs. 10 use the fair coin, giving 5 heads. 10 use the biased coin, giving 9 heads.\nThere are 14 heads in total, and 9 of them came from the biased coin.\nAnswer: 9/14.",
      },
    ],
    tags: ["Bayes", "conditional"],
  },
  {
    id: "P02",
    topic: "probability",
    kind: "short",
    difficulty: 2,
    title: "Pairwise but not mutually independent",
    prompt:
      "Give three events A, B, C on a finite uniform sample space so that every pair is independent but A, B, C are not mutually independent. Justify with probabilities.",
    hints: [
      "Two fair coin flips make a good sample space with four equally likely outcomes.",
      "Mutual independence also needs the triple product rule to hold.",
    ],
    solutions: [
      {
        approach: "Two coin flips",
        text:
          "Ω = {HH, HT, TH, TT}, each with probability 1/4.\nA = first flip is H = {HH, HT}\nB = second flip is H = {HH, TH}\nC = exactly one H = {HT, TH}\nEach event has probability 1/2, and each pairwise intersection has probability 1/4 (for example A∩B = {HH}). So every pair is independent.\nBut A∩B∩C = ∅, which has probability 0 ≠ (1/2)³ = 1/8. Not mutually independent.",
      },
      {
        approach: "Four-outcome shared point",
        text:
          "Ω = {a, b, c, d} uniform. A = {a, b}, B = {a, c}, C = {a, d}.\nEach pair intersects only in {a}, probability 1/4 = (1/2)(1/2). Pairwise independent.\nA∩B∩C = {a} has probability 1/4 ≠ 1/8. Not mutually independent.",
      },
    ],
    tags: ["independence", "counterexample"],
  },
  {
    id: "P03",
    topic: "probability",
    kind: "short",
    difficulty: 1,
    title: "Third card a spade?",
    prompt:
      "A standard 52-card deck is shuffled uniformly. Given that the top card is a spade with probability 1/4, compare the probability that the third card is a spade. Justify.",
    hints: [
      "Symmetry: does the position of the card matter?",
      "Try counting arrangements where the 13 spades sit in a fixed slot.",
    ],
    solutions: [
      {
        approach: "Symmetry",
        text:
          "A uniform shuffle treats every position the same, so the card in position 3 is equally likely to be any card in the deck. Its chance of being a spade is 13/52 = 1/4, the same as for the top card.",
      },
      {
        approach: "Counting permutations",
        text:
          "Count permutations where position 3 holds a spade: pick the spade (13 ways), then arrange the other 51 cards (51! ways). Total permutations are 52!.\nProbability = 13·51! / 52! = 13/52 = 1/4.",
      },
    ],
    tags: ["symmetry", "uniform"],
  },
  {
    id: "P04",
    topic: "probability",
    kind: "compute",
    difficulty: 2,
    title: "Flip until two tails, but at most six times",
    prompt:
      "A fair coin is flipped until it lands tails twice or until it has been flipped six times, whichever comes first. Let F be the number of flips. Find E[F].",
    hints: [
      "List the probability of each value of F, then sum.",
      "Or use the tail-sum formula E[F] = Σ_{i≥0} Pr[F > i].",
    ],
    solutions: [
      {
        approach: "PMF",
        text:
          "Pr[F=2] = 1/4 (TT).\nFor f = 3, 4, 5 the second tail lands on flip f, with exactly one tail before: (f−1)/2^f. So Pr[F=3] = 2/8 = 1/4, Pr[F=4] = 3/16, Pr[F=5] = 4/32 = 1/8.\nPr[F=6] = P(at most one tail in the first 5 flips) = 6/32 = 3/16.\nCheck: 1/4 + 1/4 + 3/16 + 1/8 + 3/16 = 1.\nE[F] = 2(1/4) + 3(1/4) + 4(3/16) + 5(1/8) + 6(3/16) = 15/4.",
      },
      {
        approach: "Tail sums",
        text:
          "E[F] = Σ_{i≥0} Pr[F > i].\nPr[F>0] = Pr[F>1] = 1. Pr[F>2] = 3/4. Pr[F>3] = 1/2. Pr[F>4] = 5/16. Pr[F>5] = 3/16. Pr[F>6] = 0.\nSum = 1 + 1 + 3/4 + 1/2 + 5/16 + 3/16 = 15/4.",
      },
    ],
    tags: ["stopping time", "expectation"],
  },
  {
    id: "P05",
    topic: "probability",
    kind: "compute",
    difficulty: 1,
    title: "Monty Hall, the switch",
    prompt:
      "Three doors hide one prize. You pick a door, and the host opens a different door that hides a goat. Should you switch, and what is the winning probability if you do?",
    hints: [
      "Compare the probability of your first pick being right with the probability it's wrong.",
    ],
    solutions: [
      {
        approach: "Enumeration",
        text:
          "Your first pick is right with probability 1/3. If it's wrong (2/3), the host is forced to reveal the other goat, so switching lands on the prize.\nSwitch: success probability 2/3.",
      },
      {
        approach: "Sample space",
        text:
          "Uniform over (prize door, your pick, host's reveal). Nine equally likely configurations. Switching wins in 6 of them (the prize is not your pick). Probability 6/9 = 2/3.",
      },
    ],
    tags: ["Monty Hall", "conditional"],
  },
  {
    id: "P06",
    topic: "probability",
    kind: "compute",
    difficulty: 2,
    title: "Birthday threshold",
    prompt:
      "With 365 equally likely birthdays, how many people do you need for the probability of a shared birthday to be at least 1/2?",
    hints: [
      "Compute the complement: the probability that all k birthdays are distinct.",
    ],
    solutions: [
      {
        approach: "Complement counting",
        text:
          "Pr[no shared birthday] = P(365, k) / 365^k = (365·364·…·(365−k+1)) / 365^k.\nWorking down: k = 22 gives a shared-birthday probability of about 0.476, and k = 23 gives about 0.507. So k = 23.",
      },
    ],
    tags: ["birthday", "complement"],
  },
  {
    id: "P07",
    topic: "probability",
    kind: "proof",
    difficulty: 2,
    title: "Total probability with a partition",
    prompt:
      "Prove that if A₁, …, Aₙ partition Ω with each Pr[Aᵢ] > 0, then for any event B, Pr[B] = Σᵢ Pr[Aᵢ]·Pr[B | Aᵢ].",
    hints: [
      "Write B as a disjoint union of B ∩ Aᵢ.",
    ],
    solutions: [
      {
        approach: "Disjoint decomposition",
        text:
          "Since the Aᵢ partition Ω, the sets B ∩ Aᵢ are disjoint and their union is B.\nSo Pr[B] = Σᵢ Pr[B ∩ Aᵢ].\nEach term equals Pr[Aᵢ]·Pr[B | Aᵢ] by the definition of conditional probability, since Pr[Aᵢ] > 0.",
      },
    ],
    tags: ["total probability"],
  },
  {
    id: "P08",
    topic: "probability",
    kind: "compute",
    difficulty: 2,
    title: "Two cards: same value and an ace",
    prompt:
      "Two cards are drawn without replacement from a standard deck. Let A = the two cards have the same value, and B = the first card is an ace. Are A and B independent?",
    hints: [
      "Compute Pr[A], Pr[B], and Pr[A∩B] separately, then compare.",
    ],
    solutions: [
      {
        approach: "Direct calculation",
        text:
          "Pr[A] = 3/51 = 1/17 (after the first card, 3 cards match its value).\nPr[B] = 4/52 = 1/13.\nPr[A∩B] = Pr[B]·Pr[A | B] = (4/52)(3/51) = 1/221.\nPr[A]·Pr[B] = (1/17)(1/13) = 1/221.\nEqual, so independent.",
      },
    ],
    tags: ["independence", "cards"],
  },
  {
    id: "P09",
    topic: "probability",
    kind: "compute",
    difficulty: 2,
    title: "Conditioning on a tie in the draw",
    prompt:
      "Two fair dice are rolled. Given that at least one die shows a 6, what is the probability that both show a 6?",
    hints: [
      "The conditioning event has 11 outcomes, not 36.",
    ],
    solutions: [
      {
        approach: "Restrict the sample space",
        text:
          "At least one 6: 36 − 25 = 11 outcomes, each equally likely in the restricted space.\nBoth 6s: 1 outcome.\nAnswer: 1/11.",
      },
      {
        approach: "Formula",
        text:
          "Pr[both 6 | at least one 6] = Pr[both 6] / Pr[at least one 6] = (1/36)/(11/36) = 1/11.",
      },
    ],
    tags: ["conditional", "dice"],
  },
  {
    id: "P10",
    topic: "probability",
    kind: "compute",
    difficulty: 3,
    title: "Mutual independence of three coin events",
    prompt:
      "Eight fair coin flips are made. Let A = first flip is tails, B = fourth flip is heads, C = exactly four heads in total. Determine whether A, B, and C are mutually independent.",
    hints: [
      "Check every pair, then the triple.",
      "Pr[C] = C(8,4)/2⁸ = 70/256.",
    ],
    solutions: [
      {
        approach: "Pairs and triple",
        text:
          "Pr[A] = 1/2, Pr[B] = 1/2, Pr[C] = 70/256 = 35/128.\nA and B use different flips, so they are independent.\nFor A and C: the number of ways with first tails and four heads total is C(7,4) = 35, so Pr[A∩C] = 35/256 = (1/2)(35/128). Independent.\nB and C by symmetry: Pr[B∩C] = C(7,3)/256 = 35/256 = (1/2)(35/128). Independent.\nFor the triple, Pr[A∩B∩C] = C(6,3)/256 = 20/256 = 5/64. Product rule needs (1/2)(1/2)(35/128) = 35/512 ≈ 0.068. Since 5/64 = 40/512 ≠ 35/512, not mutually independent, even though all pairs are independent.",
      },
    ],
    tags: ["mutual independence"],
  },

  // ---------------- EXPECTATION ----------------
  {
    id: "E01",
    topic: "expectation",
    kind: "proof",
    difficulty: 1,
    title: "Linearity: the hat check",
    prompt:
      "n people drop their hats and receive a uniformly random hat back. Show that the expected number of people who get their own hat is 1.",
    hints: [
      "Use indicator variables Xᵢ for person i getting their own hat.",
    ],
    solutions: [
      {
        approach: "Indicators and linearity",
        text:
          "Let Xᵢ = 1 if person i gets their own hat, else 0. Pr[Xᵢ = 1] = 1/n.\nX = X₁ + … + Xₙ, so E[X] = Σ E[Xᵢ] = n·(1/n) = 1.\nNo independence was needed.",
      },
    ],
    tags: ["linearity", "indicators"],
  },
  {
    id: "E02",
    topic: "expectation",
    kind: "compute",
    difficulty: 2,
    title: "Expected maximum of four dice",
    prompt:
      "Four fair six-sided dice are rolled. Let M be the largest value. Find E[M].",
    hints: [
      "For a non-negative integer variable, E[M] = Σ_{k≥1} Pr[M ≥ k].",
      "Pr[M < k] = ((k−1)/6)⁴.",
    ],
    solutions: [
      {
        approach: "Tail sum",
        text:
          "E[M] = Σ_{k=1}^{6} Pr[M ≥ k] = Σ_{k=1}^{6} (1 − ((k−1)/6)⁴)\n= 6 − (0 + 1 + 16 + 81 + 256 + 625)/1296\n= 6 − 979/1296\n= 6797/1296 ≈ 5.245.",
      },
    ],
    tags: ["max", "tail sum"],
  },
  {
    id: "E03",
    topic: "expectation",
    kind: "proof",
    difficulty: 2,
    title: "Geometric expectation",
    prompt:
      "Let X be geometric with parameter p (the number of trials up to and including the first success). Prove E[X] = 1/p.",
    hints: [
      "Use first-step analysis: condition on whether the first trial succeeds.",
      "Alternatively, use E[X] = Σ Pr[X ≥ i].",
    ],
    solutions: [
      {
        approach: "First-step analysis",
        text:
          "With probability p, X = 1. Otherwise, the process restarts, so X = 1 + X′ with X′ identically distributed.\nE[X] = p·1 + (1−p)(1 + E[X]).\nSolving: E[X] = p + (1−p) + (1−p)E[X] ⇒ pE[X] = 1 ⇒ E[X] = 1/p.",
      },
      {
        approach: "Tail sum",
        text:
          "Pr[X ≥ i] = (1−p)^{i−1}. So E[X] = Σ_{i≥1} (1−p)^{i−1} = 1/p.",
      },
    ],
    tags: ["geometric"],
  },
  {
    id: "E04",
    topic: "expectation",
    kind: "compute",
    difficulty: 2,
    title: "Variance of a geometric",
    prompt:
      "Let X be geometric with parameter p. Find Var[X].",
    hints: [
      "Start from first-step analysis for E[X²].",
      "Var[X] = E[X²] − E[X]².",
    ],
    solutions: [
      {
        approach: "First-step analysis for the second moment",
        text:
          "E[X²] = p·1 + (1−p)·E[(1+X′)²] = p + (1−p)(1 + 2E[X] + E[X²]).\nWith E[X] = 1/p, solve: E[X²] = (2 − p)/p².\nVar[X] = (2 − p)/p² − 1/p² = (1 − p)/p².",
      },
    ],
    tags: ["geometric", "variance"],
  },
  {
    id: "E05",
    topic: "expectation",
    kind: "proof",
    difficulty: 2,
    title: "Variance of a binomial",
    prompt:
      "Let X be binomial with n trials and success probability p. Prove that Var[X] = np(1 − p).",
    hints: [
      "Write X as a sum of independent indicators.",
    ],
    solutions: [
      {
        approach: "Sum of independent indicators",
        text:
          "X = Y₁ + … + Yₙ with Yᵢ independent Bernoulli(p). Each Var[Yᵢ] = p(1−p).\nVariance of a sum of independent variables is the sum of variances, so Var[X] = np(1−p).",
      },
      {
        approach: "Direct from the definition",
        text:
          "E[X] = np. Compute E[X(X−1)] = n(n−1)p² by counting ordered pairs of successes. Then E[X²] = E[X(X−1)] + E[X] = n(n−1)p² + np.\nVar[X] = n(n−1)p² + np − (np)² = np − np² = np(1−p).",
      },
    ],
    tags: ["binomial", "variance"],
  },
  {
    id: "E06",
    topic: "expectation",
    kind: "proof",
    difficulty: 3,
    title: "Coupon collector",
    prompt:
      "There are n coupon types, and each box contains one uniformly random type. Show that the expected number of boxes needed to collect all types is n·H(n), where H(n) = 1 + 1/2 + … + 1/n.",
    hints: [
      "Let Xᵢ be the number of additional boxes needed after you already have i−1 types.",
      "Each Xᵢ is geometric.",
    ],
    solutions: [
      {
        approach: "Phase decomposition",
        text:
          "Let Xᵢ be the boxes needed to get the i-th new type after i−1 are collected. Then Xᵢ is geometric with p = (n − i + 1)/n, so E[Xᵢ] = n/(n − i + 1).\nBy linearity, E[X] = Σ_{i=1}^{n} n/(n−i+1) = n·Σ_{j=1}^{n} 1/j = n·H(n).",
      },
    ],
    tags: ["coupon collector", "linearity"],
  },
  {
    id: "E07",
    topic: "expectation",
    kind: "compute",
    difficulty: 2,
    title: "Shifted Markov",
    prompt:
      "A random variable Z satisfies Z ≥ −8 always and E[Z] = 0. Using only Markov's inequality and basic facts about expectation, show that Pr[Z ≥ 16] ≤ 1/3.",
    hints: [
      "Markov needs a non-negative variable, so shift Z.",
    ],
    solutions: [
      {
        approach: "Shift and apply Markov",
        text:
          "Let W = Z + 8 ≥ 0. Then E[W] = 0 + 8 = 8.\nZ ≥ 16 exactly when W ≥ 24.\nMarkov: Pr[W ≥ 24] ≤ E[W]/24 = 8/24 = 1/3.",
      },
    ],
    tags: ["Markov", "shift"],
  },
  {
    id: "E08",
    topic: "expectation",
    kind: "compute",
    difficulty: 3,
    title: "Chebyshev for a coin count",
    prompt:
      "Flip a fair coin n times, and let X be the number of heads. Bound Pr[X ≥ 3n/4] using Chebyshev's inequality and symmetry.",
    hints: [
      "E[X] = n/2 and Var[X] = n/4.",
      "Use the two-sided event |X − n/2| ≥ n/4.",
    ],
    solutions: [
      {
        approach: "Two-sided Chebyshev plus symmetry",
        text:
          "Pr[|X − n/2| ≥ n/4] ≤ Var[X]/(n/4)² = (n/4)/(n²/16) = 4/n.\nBy symmetry, the upper tail is half of the two-sided event, so Pr[X ≥ 3n/4] ≤ 2/n.",
      },
    ],
    tags: ["Chebyshev", "binomial"],
  },
  {
    id: "E09",
    topic: "expectation",
    kind: "proof",
    difficulty: 2,
    title: "Expected birthday pairs",
    prompt:
      "k people each have a birthday uniform over n days, independently. Let X count pairs sharing a birthday. Show E[X] = k(k−1)/(2n), and find the smallest k with E[X] ≥ 1 when n = 365.",
    hints: [
      "Use an indicator for each of the C(k,2) pairs.",
    ],
    solutions: [
      {
        approach: "Pair indicators",
        text:
          "For each pair, the probability they share a birthday is 1/n. There are C(k,2) = k(k−1)/2 pairs.\nE[X] = k(k−1)/2 · (1/n) = k(k−1)/(2n).\nFor n = 365, k(k−1) ≥ 730 gives k = 28 (28·27 = 756; 27·26 = 702).",
      },
    ],
    tags: ["birthday", "linearity"],
  },
  {
    id: "E10",
    topic: "expectation",
    kind: "compute",
    difficulty: 1,
    title: "Expected adjacent pairs from different groups",
    prompt:
      "A list has 10 tasks for Walter and 8 for Kate, in a uniformly random order. Find the expected number of adjacent positions holding tasks of different people.",
    hints: [
      "There are 17 adjacent pairs of positions.",
      "Each pair's chance of being mixed is 2·(10·8)/(18·17).",
    ],
    solutions: [
      {
        approach: "Indicators per adjacent position",
        text:
          "There are 17 adjacent position pairs. For a given pair, the two tasks are a random pair of distinct tasks from 18. Probability they belong to different people: 2·10·8/(18·17) = 160/306 = 80/153.\nExpected count = 17 · 80/153 = 1360/153 = 80/9 ≈ 8.89.",
      },
    ],
    tags: ["linearity", "random permutation"],
  },

  // ---------------- GRAPHS ----------------
  {
    id: "G01",
    topic: "graphs",
    kind: "proof",
    difficulty: 1,
    title: "Odd vertices come in pairs",
    prompt:
      "Prove that every graph has an even number of vertices of odd degree.",
    hints: [
      "Sum all degrees and count each edge twice.",
    ],
    solutions: [
      {
        approach: "Handshake lemma",
        text:
          "The sum of degrees equals 2|E|, which is even.\nThe even-degree vertices contribute an even sum. So the odd-degree vertices must contribute an even sum too. A sum of odd numbers is even only if there are an even number of them.",
      },
      {
        approach: "Induction on edges",
        text:
          "Base case: no edges, zero odd-degree vertices.\nAdd an edge uv: the degree parity of u and v flips. The number of odd-degree vertices changes by −2, 0, or +2, so it stays even.",
      },
    ],
    tags: ["handshake"],
  },
  {
    id: "G02",
    topic: "graphs",
    kind: "proof",
    difficulty: 2,
    title: "No cut edge in an even graph",
    prompt:
      "Let G be a connected graph in which every vertex has even degree. Prove G has no cut edge, meaning an edge whose removal increases the number of components.",
    hints: [
      "Suppose e = uv is a cut edge. Look at one side of the cut.",
      "Or use an Eulerian circuit and count how often it crosses the cut.",
    ],
    solutions: [
      {
        approach: "Parity on one side",
        text:
          "Suppose e = {u, v} is a cut edge. Removing it leaves two components, C_u containing u and C_v containing v.\nIn C_u, every vertex keeps its original degree except u, which loses 1. So exactly one vertex in C_u has odd degree.\nBut every graph has an even number of odd-degree vertices, and C_u is a graph. Contradiction.",
      },
      {
        approach: "Eulerian circuit crossing count",
        text:
          "G is connected with all even degrees, so it has an Eulerian circuit using every edge exactly once.\nThe circuit must cross between the two sides of the cut an even number of times, since it starts and ends on the same side.\nThe only edge crossing that cut is e, and the circuit uses e exactly once. An odd number of crossings. Contradiction.",
      },
    ],
    tags: ["cut edge", "Euler"],
  },
  {
    id: "G03",
    topic: "graphs",
    kind: "proof",
    difficulty: 2,
    title: "Minimum degree 3 gives a chord",
    prompt:
      "Prove that a simple graph with minimum degree at least 3 contains a cycle with a chord. (A chord is an edge between two vertices of the cycle that is not itself a cycle edge.)",
    hints: [
      "Take a longest path and look at its endpoint.",
    ],
    solutions: [
      {
        approach: "Longest path",
        text:
          "Take a longest path v₁, …, v_k. The endpoint v_k has degree at least 3, and every neighbor of v_k lies on the path (otherwise the path could be extended).\nSo v_k has at least two neighbors other than its predecessor, say v_p and v_q with p < q < k−1 (choose indices so both exist).\nThe segment v_p … v_k together with the edge {v_p, v_k} forms a cycle. The edge {v_k, v_q} is a chord, since v_q is on this cycle and is not adjacent to v_k along it.",
      },
    ],
    tags: ["longest path", "chord"],
  },
  {
    id: "G04",
    topic: "graphs",
    kind: "proof",
    difficulty: 2,
    title: "Greedy colouring with max degree k",
    prompt:
      "Prove that every graph with maximum degree at most k can be properly coloured with k + 1 colours.",
    hints: [
      "Colour the vertices one at a time, choosing any colour not used by already-coloured neighbours.",
    ],
    solutions: [
      {
        approach: "Greedy ordering",
        text:
          "Order the vertices arbitrarily. Colour them one by one, giving each vertex the smallest colour among 1,…,k+1 not used by its already-coloured neighbours.\nA vertex has at most k neighbours in total, so at most k colours are blocked. One of the k+1 colours is free.\nThe colouring is proper because each edge's later endpoint avoids the earlier endpoint's colour.",
      },
      {
        approach: "Induction on vertices",
        text:
          "Remove a vertex v. The rest has max degree at most k, so it has a proper (k+1)-colouring by induction.\nv has at most k neighbours, which block at most k colours. Give v a free colour.",
      },
    ],
    tags: ["coloring", "greedy"],
  },
  {
    id: "G05",
    topic: "graphs",
    kind: "proof",
    difficulty: 3,
    title: "Triangle-free graphs have at most n²/4 edges",
    prompt:
      "Prove that a simple triangle-free graph on n vertices has at most n²/4 edges.",
    hints: [
      "For an edge uv, the neighbourhoods of u and v must be disjoint.",
      "Sum deg(u) + deg(v) over all edges and use Cauchy–Schwarz on the degrees.",
    ],
    solutions: [
      {
        approach: "Edge degree sum and Cauchy–Schwarz",
        text:
          "For any edge uv, N(u) and N(v) are disjoint (a common neighbour would form a triangle), and both lie within the n vertices, so deg(u) + deg(v) ≤ n.\nSum over all m edges: Σ_{uv∈E} (deg u + deg v) = Σ_v deg(v)² ≤ n·m.\nBy Cauchy–Schwarz, Σ deg(v)² ≥ (Σ deg(v))²/n = (2m)²/n = 4m²/n.\nSo 4m²/n ≤ nm, giving m ≤ n²/4.",
      },
    ],
    tags: ["Mantel", "Cauchy-Schwarz"],
  },
  {
    id: "G06",
    topic: "graphs",
    kind: "proof",
    difficulty: 2,
    title: "Components after removing a vertex",
    prompt:
      "Let G be a connected graph where every vertex has even degree. Prove that removing a vertex v leaves at most deg(v)/2 connected components.",
    hints: [
      "After deleting v, which vertices have odd degree?",
      "Each component must contain an even number of odd-degree vertices.",
    ],
    solutions: [
      {
        approach: "Odd-degree neighbours",
        text:
          "In G − v, the only vertices whose degree changed are the neighbours of v, each losing 1. So the odd-degree vertices of G − v are exactly the neighbours of v.\nEach component of G − v is a graph, so it has an even number of odd-degree vertices. A component that contains a neighbour of v must therefore contain at least two neighbours.\nCounting: components ≤ (number of neighbours)/2 = deg(v)/2.",
      },
    ],
    tags: ["vertex removal"],
  },
  {
    id: "G07",
    topic: "graphs",
    kind: "short",
    difficulty: 1,
    title: "Eulerian or not?",
    prompt:
      "A connected graph has degrees 2, 2, 3, 3, 4. Does it have an Eulerian circuit? Explain.",
    hints: [
      "Check every vertex's degree.",
    ],
    solutions: [
      {
        approach: "Degree test",
        text:
          "Two vertices have odd degree (3, 3). An Eulerian circuit needs every vertex to have even degree, so no Eulerian circuit exists.\n(The graph does have an Euler trail, since exactly two vertices are odd.)",
      },
    ],
    tags: ["Euler"],
  },
  {
    id: "G08",
    topic: "graphs",
    kind: "proof",
    difficulty: 3,
    title: "Ore's condition gives a Hamiltonian cycle",
    prompt:
      "Let G be a simple graph on n ≥ 3 vertices such that every pair of non-adjacent vertices x, y satisfies deg(x) + deg(y) ≥ n. Prove G has a Hamiltonian cycle.",
    hints: [
      "Add edges one at a time while the degree condition still holds, and look at a maximal such graph.",
      "Show the closure is complete or Hamiltonian.",
    ],
    solutions: [
      {
        approach: "Maximal counterexample",
        text:
          "Suppose G is a counterexample, and add edges as long as the graph stays non-Hamiltonian. Take a maximal non-Hamiltonian supergraph H. It still satisfies the degree condition for non-adjacent pairs, because adding edges only raises degrees.\nIf H were complete, it would be Hamiltonian, so some pair x, y is non-adjacent in H.\nAdding xy makes H Hamiltonian, so H has a Hamiltonian path from x to y: x = v₁, …, v_n = y.\nLet S = {i ∈ {1,…,n−1} : x ~ v_{i+1}} and T = {i ∈ {1,…,n−1} : y ~ v_i}. Then |S| = deg(x) and |T| = deg(y), so |S| + |T| ≥ n > n − 1, and S ∩ T is nonempty. Pick i in it: x ~ v_{i+1} and y ~ v_i.\nThen v₁, v₂, …, v_i, v_n, v_{n−1}, …, v_{i+1}, back to v₁ is a Hamiltonian cycle in H (every consecutive pair is an edge: the path edges, v_i v_n = y v_i, and x v_{i+1}). Contradiction.",
      },
    ],
    tags: ["Ore", "Hamiltonian"],
  },
  {
    id: "G09",
    topic: "graphs",
    kind: "short",
    difficulty: 1,
    title: "Cut edges in a tree",
    prompt:
      "Explain why every edge of a tree is a cut edge.",
    hints: [
      "Use the definition of a tree: connected and acyclic.",
    ],
    solutions: [
      {
        approach: "Acyclicity",
        text:
          "Take an edge uv of a tree. If removing uv left u and v connected, there would be a u–v path not using uv, and adding uv back would create a cycle. The tree is acyclic, so no such path exists. Removing uv therefore disconnects the graph.",
      },
    ],
    tags: ["trees", "cut edge"],
  },

  // ---------------- TREES ----------------
  {
    id: "T01",
    topic: "trees",
    kind: "proof",
    difficulty: 1,
    title: "Two leaves in every tree",
    prompt:
      "Prove that every tree with at least two vertices has at least two leaves.",
    hints: [
      "Use a longest path, or use the degree sum.",
    ],
    solutions: [
      {
        approach: "Longest path",
        text:
          "Take a longest path v₁, …, v_k (k ≥ 2 because the tree has an edge). If v₁ had a neighbour other than v₂, that neighbour is either off the path (a longer path) or on the path (a cycle). Both are impossible. So v₁ is a leaf, and likewise v_k.",
      },
      {
        approach: "Degree sum",
        text:
          "A tree on n vertices has n − 1 edges, so the degree sum is 2(n − 1).\nIf there were at most one leaf, every other vertex has degree at least 2, so the sum is at least 1 + 2(n − 1) = 2n − 1 > 2n − 2. Contradiction.",
      },
    ],
    tags: ["leaves"],
  },
  {
    id: "T02",
    topic: "trees",
    kind: "proof",
    difficulty: 2,
    title: "Leaves versus degree-three vertices",
    prompt:
      "Let T be a tree on n ≥ 2 vertices in which every vertex has degree 1 or 3. Let n₁ and n₃ be the numbers of vertices of degree 1 and 3. Prove n₁ = n₃ + 2.",
    hints: [
      "Count the edges in two ways: n − 1 edges and the degree sum.",
    ],
    solutions: [
      {
        approach: "Handshake and edge count",
        text:
          "Let n = n₁ + n₃. A tree has n − 1 edges, so the degree sum is 2(n − 1).\nThe degree sum is n₁·1 + n₃·3 = n₁ + 3n₃.\nSo n₁ + 3n₃ = 2(n₁ + n₃) − 2, which simplifies to n₁ = n₃ + 2.",
      }
    ],
    tags: ["degree counting"],
  },
  {
    id: "T03",
    topic: "trees",
    kind: "proof",
    difficulty: 2,
    title: "Spanning tree by adding edges",
    prompt:
      "Let G be connected with vertex set V. Start with H having V and no edges. While H has more than one component, add an edge of G joining two different components of H. Prove that the procedure ends with a spanning tree of G.",
    hints: [
      "Show an edge joining different components always exists while H is disconnected.",
      "Show adding such an edge never creates a cycle.",
    ],
    solutions: [
      {
        approach: "Three claims",
        text:
          "(A) If H is disconnected, some edge of G joins two different components of H. Otherwise no G-path leaves a component, contradicting that G is connected.\n(B) H stays acyclic. Induct on the number of added edges. A new edge uv joining different components cannot close a cycle, since that would need a u–v path in H already, which crosses no components.\n(C) The procedure stops only when H is connected. H is connected, acyclic and spans V, so it is a spanning tree.",
      },
    ],
    tags: ["spanning tree"],
  },
  {
    id: "T04",
    topic: "trees",
    kind: "proof",
    difficulty: 2,
    title: "Sum of distances in a tree",
    prompt:
      "Let T be a tree with n ≥ 2 vertices and let u be any vertex. Prove that the sum of distances from u to all vertices is at most C(n, 2).",
    hints: [
      "Induct on n by removing a leaf.",
      "Consider whether u is the removed leaf or not.",
    ],
    solutions: [
      {
        approach: "Leaf removal induction",
        text:
          "Base: n = 2, the sum is 0 + 1 = 1 = C(2,2).\nStep: remove a leaf x from a tree on k + 1 vertices, leaving k vertices.\nIf u ≠ x, then d(u, x) ≤ k (a path has at most k edges within k+1 vertices), so the sum is at most (old sum) + k ≤ C(k,2) + k = C(k+1,2).\nIf u = x, with unique neighbour y, then d(x, v) = 1 + d(y, v) for every v ≠ x. The sum equals k + Σ_{v≠x} d(y,v). By the hypothesis, Σ d(y,v) ≤ C(k,2). Total ≤ k + C(k,2) = C(k+1,2).",
      },
    ],
    tags: ["distance", "induction"],
  },
  {
    id: "T05",
    topic: "trees",
    kind: "proof",
    difficulty: 2,
    title: "Tree with a fixed leaf count",
    prompt:
      "Prove that a tree with n vertices has exactly n − 1 edges.",
    hints: [
      "Induct on n and remove a leaf.",
    ],
    solutions: [
      {
        approach: "Leaf removal",
        text:
          "Base: a single vertex has 0 edges.\nStep: a tree on n ≥ 2 vertices has a leaf (see T01). Removing that leaf leaves a tree on n − 1 vertices, with (n − 2) edges by hypothesis. Adding the leaf back adds exactly one edge, giving n − 1.",
      },
    ],
    tags: ["edge count", "induction"],
  },
  {
    id: "T06",
    topic: "trees",
    kind: "proof",
    difficulty: 3,
    title: "Trees with maximum degree 3",
    prompt:
      "Let T be a tree on n ≥ 2 vertices. Prove that the number of leaves equals 2 + Σ over vertices v with deg(v) ≥ 3 of (deg(v) − 2).",
    hints: [
      "Count the degree sum of the tree in two ways.",
    ],
    solutions: [
      {
        approach: "Degree sum",
        text:
          "Let L be the number of leaves. The degree sum is 2(n − 1) = Σ_v deg(v).\nWrite Σ_v deg(v) = Σ_v (deg(v) − 2) + 2n. Then 2n − 2 = Σ (deg − 2) + 2n, so Σ_v (deg(v) − 2) = −2.\nLeaves contribute −1 each, degree-two vertices contribute 0, and vertices of degree ≥ 3 contribute deg − 2. So −L + Σ_{deg≥3}(deg − 2) = −2, i.e., L = 2 + Σ_{deg≥3}(deg − 2).",
      },
    ],
    tags: ["degree counting", "leaves"],
  },
  {
    id: "T07",
    topic: "trees",
    kind: "short",
    difficulty: 1,
    title: "Tree or not?",
    prompt:
      "A graph has 6 vertices and 5 edges. Is it necessarily a tree? Give a reason or a counterexample.",
    hints: [
      "A tree on 6 vertices has 5 edges, but the converse needs connectivity.",
    ],
    solutions: [
      {
        approach: "Counterexample",
        text:
          "No. Take vertices a, b, c, d, e, f with edges ab, bc, ca (a triangle), cd, and de. That is 5 edges on 6 vertices. But f is isolated and the triangle is a cycle, so the graph is neither connected nor acyclic, and it is not a tree.\nThe lesson: n − 1 edges is necessary for a tree, but not sufficient without connectivity or acyclicity.",
      },
    ],
    tags: ["characterization"],
  },

  // ---------------- MATCHINGS ----------------
  {
    id: "M01",
    topic: "matchings",
    kind: "short",
    difficulty: 1,
    title: "Maximal is not maximum",
    prompt:
      "Give a graph with a maximal matching that is not a maximum matching.",
    hints: [
      "A path on four vertices is enough.",
    ],
    solutions: [
      {
        approach: "Path P₄",
        text:
          "Path a–b–c–d. The matching {bc} is maximal: adding ab shares b, adding cd shares c. But {ab, cd} is a larger matching, so {bc} is not maximum.",
      },
    ],
    tags: ["maximal", "maximum"],
  },
  {
    id: "M02",
    topic: "matchings",
    kind: "proof",
    difficulty: 2,
    title: "Augmenting paths",
    prompt:
      "Prove that a matching M is maximum if and only if the graph has no M-augmenting path.",
    hints: [
      "Prove each direction by contrapositive.",
      "For the hard direction, compare with a larger matching M′ and look at M ⊕ M′.",
    ],
    solutions: [
      {
        approach: "Both directions",
        text:
          "(⇐) If M has an augmenting path P, swapping its edges (remove M-edges, add non-M-edges) gives a matching one larger. So M is not maximum. Contrapositive: M maximum ⇒ no augmenting path.\n(⇒) Suppose M is not maximum, and take a larger M′. In H = M ⊕ M′, every vertex has degree at most 2, so components are even alternating cycles or paths. Since |M′| > |M|, some path component has more M′-edges than M-edges. Its two endpoints are unsaturated by M, so it is an M-augmenting path.",
      },
    ],
    tags: ["augmenting", "symmetric difference"],
  },
  {
    id: "M03",
    topic: "matchings",
    kind: "compute",
    difficulty: 2,
    title: "Can every girl get a boy?",
    prompt:
      "Girls X = {x₁, x₂, x₃}, boys Y = {y₁, y₂, y₃}. Edges: x₁y₁, x₁y₂, x₂y₁, x₃y₁, x₃y₂, x₃y₃. Does a matching saturate all of X? Use Hall's theorem.",
    hints: [
      "Check Hall's condition for every subset of X, or at least the risky ones.",
    ],
    solutions: [
      {
        approach: "Hall check",
        text:
          "N({x₁}) = {y₁,y₂}, N({x₂}) = {y₁}, N({x₃}) = {y₁,y₂,y₃}.\nN({x₁,x₂}) = {y₁,y₂} (size 2 ≥ 2). N({x₁,x₃}) = {y₁,y₂,y₃} (3 ≥ 2). N({x₂,x₃}) = {y₁,y₂,y₃} (3 ≥ 2). N(X) = Y (3 ≥ 3).\nHall holds, so there is a matching saturating X. Example: x₂y₁, x₁y₂, x₃y₃.",
      },
    ],
    tags: ["Hall"],
  },
  {
    id: "M04",
    topic: "matchings",
    kind: "proof",
    difficulty: 3,
    title: "Hall's theorem",
    prompt:
      "Let G be bipartite with parts X and Y. Prove that G has a matching saturating X if and only if |N(S)| ≥ |S| for every S ⊆ X.",
    hints: [
      "Necessity is easy. For sufficiency, induct on |X| and split into cases on whether some proper subset is tight.",
    ],
    solutions: [
      {
        approach: "Induction with two cases",
        text:
          "(⇒) A saturating matching sends S injectively into N(S), so |N(S)| ≥ |S|.\n(⇐) Induct on |X|. Base |X| = 1 is immediate.\nCase I: every nonempty proper S ⊂ X has |N(S)| > |S|. Match any x to a neighbour y. Remove x and y. Every remaining S′ ⊆ X∖{x} still has |N(S′) ∖ {y}| ≥ |S′|, because it lost at most one neighbour and had slack. Apply induction.\nCase II: some nonempty proper W has |N(W)| = |W|. Match W into N(W) by induction. Then for the rest, show Hall's condition holds in G minus W and N(W): any S′ ⊆ X∖W has |N(S′)∖N(W)| ≥ |S′|, since otherwise S′ ∪ W would violate Hall in G. Apply induction to the rest.",
      },
    ],
    tags: ["Hall", "proof"],
  },
  {
    id: "M05",
    topic: "matchings",
    kind: "proof",
    difficulty: 2,
    title: "Two maximal matchings",
    prompt:
      "Let M₁ and M₂ be two maximal matchings in a simple graph. Prove |M₁| ≥ |M₂|/2.",
    hints: [
      "Each edge of M₂ must share an endpoint with some edge of M₁.",
      "Each edge of M₁ can cover at most two edges of M₂.",
    ],
    solutions: [
      {
        approach: "Charging argument",
        text:
          "Since M₁ is maximal, every edge of M₂ shares a vertex with some edge of M₁ (otherwise it could be added to M₁).\nEach edge of M₁ has two endpoints, and each endpoint is in at most one edge of M₂ (since M₂ is a matching). So each edge of M₁ is charged by at most 2 edges of M₂.\nHence |M₂| ≤ 2|M₁|, i.e., |M₁| ≥ |M₂|/2.",
      },
    ],
    tags: ["maximal", "charging"],
  },

  // ---------------- INDUCTION & PIGEONHOLE ----------------
  {
    id: "I01",
    topic: "induction",
    kind: "flaw",
    difficulty: 1,
    title: "The horse that wasn't",
    prompt:
      "Claim: in any group of n ≥ 1 horses, all horses have the same colour.\nProof: Induction on n. Base n = 1 is trivial. Assume true for n = k. For k + 1 horses, remove one horse to get a group of k horses that all match. Remove a different horse to get another group of k horses. The two groups overlap, so all k+1 horses match. Find the flaw.",
    hints: [
      "The overlap argument needs at least one horse in the intersection of the two groups.",
      "Check what happens at k = 1.",
    ],
    solutions: [
      {
        approach: "Overlap fails at k = 1",
        text:
          "The flaw is that the two groups overlap. When k = 1, each group is a single horse. Removing different horses from a pair of horses leaves two single horses with nothing in common, so nothing links their colours. The step from n = 2 to n = 3 is fine, but the step from k = 1 to k + 1 = 2 breaks.\nThe fix: check n = 2 directly. The overlap argument is valid only for k ≥ 2.",
      },
    ],
    tags: ["flawed induction"],
  },
  {
    id: "I02",
    topic: "induction",
    kind: "flaw",
    difficulty: 2,
    title: "Strong induction that gives 5n = 0",
    prompt:
      "Claim: for every non-negative integer n, 5n = 0.\nProof: Strong induction. Base n = 0 holds. Assume 5i = 0 for all i ≤ k. For k + 1, write k + 1 = i + j with i, j < k + 1. By hypothesis 5i = 0 and 5j = 0, so 5(k+1) = 5i + 5j = 0.\nFind the flaw.",
    hints: [
      "Which values of k allow writing k+1 as a sum of two smaller non-negative integers?",
    ],
    solutions: [
      {
        approach: "The step fails at k = 0",
        text:
          "The decomposition k+1 = i + j with i, j < k+1 needs k+1 ≥ 2, so it fails for k = 0 (we need 1 = i + j with i, j < 1, impossible for non-negative integers).\nThe induction step for n = 1 is never justified, so the argument proves nothing about 5·1.",
      },
    ],
    tags: ["strong induction", "flaw"],
  },
  {
    id: "I03",
    topic: "induction",
    kind: "proof",
    difficulty: 1,
    title: "Sum of cubes",
    prompt:
      "Prove by induction that 1³ + 2³ + … + n³ = (1 + 2 + … + n)² for all n ≥ 1.",
    hints: [
      "Use the formula 1 + … + n = n(n+1)/2 as a known fact, or prove it too.",
    ],
    solutions: [
      {
        approach: "Weak induction",
        text:
          "Base n = 1: 1 = 1.\nStep: assume the identity for n. Then the sum for n+1 is (n(n+1)/2)² + (n+1)³ = (n+1)²[n²/4 + (n+1)] = (n+1)²(n+2)²/4 = ((n+1)(n+2)/2)².\nThat is exactly (1 + … + (n+1))².",
      },
    ],
    tags: ["weak induction"],
  },
  {
    id: "I04",
    topic: "induction",
    kind: "proof",
    difficulty: 2,
    title: "Regions cut by lines",
    prompt:
      "Prove that n lines in the plane, no two parallel and no three concurrent, divide the plane into (n² + n + 2)/2 regions.",
    hints: [
      "Adding a new line adds one region for each piece it cuts.",
    ],
    solutions: [
      {
        approach: "Induction on lines",
        text:
          "Base n = 1: 2 regions, and (1 + 1 + 2)/2 = 2.\nStep: add a line ℓ to k lines. ℓ crosses each of them once, at k distinct points (no three concurrent), so ℓ splits into k+1 pieces.\nEach piece splits an existing region into two, adding k+1 regions. Then the count is (k² + k + 2)/2 + (k+1) = ((k+1)² + (k+1) + 2)/2.",
      },
    ],
    tags: ["induction", "geometry"],
  },
  {
    id: "I05",
    topic: "induction",
    kind: "proof",
    difficulty: 2,
    title: "Winning NIM with 1, 2, or 3 sticks",
    prompt:
      "Players alternately remove 1, 2, or 3 sticks. The player who takes the last stick loses. Show that the first player has a winning strategy unless the number of sticks is of the form 4k + 1.",
    hints: [
      "Strong induction on n, with cases n mod 4.",
      "Work out small cases first: n = 1, 2, 3, 4, 5.",
    ],
    solutions: [
      {
        approach: "Strong induction on residues",
        text:
          "If n = 4k + 1, any move of 1, 2, or 3 leaves 4k, 4k−1, or 4k−2. In each case the opponent can leave a position of the form 4j + 1 (taking 3, 2, or 1 respectively), so the opponent wins. (Base: n = 1 is a loss for the first player.)\nIf n is not 4k+1, the first player moves to 4j+1 by taking n mod 4 sticks (taking 1, 2, or 3 when n mod 4 is 2, 3, or 0 respectively, which means 4j+1 is reached). By strong induction, the opponent is now in a losing position.",
      },
    ],
    tags: ["strong induction", "game"],
  },
  {
    id: "I06",
    topic: "induction",
    kind: "proof",
    difficulty: 2,
    title: "Tiling with L-shapes",
    prompt:
      "Show that a 2ⁿ × 2ⁿ board with one square removed can be tiled by L-shaped trominoes, for every n ≥ 1, no matter which square is removed.",
    hints: [
      "Split the board into four quadrants. Place one tromino in the centre to cover one corner of each of the three quadrants without the missing square.",
    ],
    solutions: [
      {
        approach: "Quadrant induction",
        text:
          "Base n = 1: a 2×2 board with one square removed is exactly one L-tromino.\nStep: split the 2^{n+1} board into four 2ⁿ quadrants. The removed square lies in one quadrant, which by induction tiles. For the other three quadrants, place one L-tromino covering the corner square nearest the centre in each. Those three squares form an L, so one tromino covers them, and each quadrant now has one 'removed' square, so each is tiled by induction.",
      },
    ],
    tags: ["tiling", "induction"],
  },
  {
    id: "I07",
    topic: "induction",
    kind: "proof",
    difficulty: 2,
    title: "Friends or strangers",
    prompt:
      "Among any six people, prove that there are three who are all mutual friends or three who are all mutual strangers.",
    hints: [
      "Pick one person and look at the other five.",
    ],
    solutions: [
      {
        approach: "Pigeonhole on one person",
        text:
          "Pick a person P. P has five others, each either a friend or stranger. By pigeonhole, at least three are friends, or at least three are strangers. Say A, B, C are friends of P.\nIf any two of A, B, C are friends, they form a triple of friends with P. Otherwise A, B, C are mutual strangers. Either way we have a triple.",
      },
    ],
    tags: ["pigeonhole", "Ramsey"],
  },
  {
    id: "I08",
    topic: "induction",
    kind: "compute",
    difficulty: 1,
    title: "Pigeonhole on 25 days",
    prompt:
      "Any 25 days are chosen from a year. Prove that at least three of them fall in the same month.",
    hints: [
      "Assume each month has at most two chosen days and count.",
    ],
    solutions: [
      {
        approach: "Contradiction",
        text:
          "If each of the 12 months had at most two chosen days, at most 24 days could be chosen, contradicting 25 chosen days. So some month has at least three.",
      },
    ],
    tags: ["pigeonhole"],
  },
  {
    id: "I09",
    topic: "induction",
    kind: "proof",
    difficulty: 3,
    title: "Monotone subsequence",
    prompt:
      "Prove that any sequence of n² + 1 distinct real numbers contains a strictly increasing subsequence of length n + 1 or a strictly decreasing subsequence of length n + 1.",
    hints: [
      "For each index k, let m_k be the length of the longest increasing subsequence starting at x_k.",
    ],
    solutions: [
      {
        approach: "Pigeonhole on lengths",
        text:
          "Let m_k be the length of the longest increasing subsequence starting at x_k. If some m_k ≥ n + 1, we are done.\nOtherwise each m_k is in {1, …, n}, which is n values for n² + 1 indices. By the generalized pigeonhole principle, some value is taken by at least n + 1 indices.\nTake n + 1 such indices i₁ < … < i_{n+1}. For any two of them, if x_{i_a} < x_{i_b} with a < b then m_{i_a} ≥ m_{i_b} + 1, contradicting equal values. So x_{i_a} > x_{i_b}, giving a strictly decreasing subsequence of length n + 1.",
      },
    ],
    tags: ["pigeonhole", "Erdős–Szekeres"],
  },
  {
    id: "I10",
    topic: "induction",
    kind: "proof",
    difficulty: 2,
    title: "Divisibility by 3",
    prompt:
      "Prove by induction that 2^{2n} − 1 is divisible by 3 for all n ≥ 0.",
    hints: [
      "Rewrite 2^{2(n+1)} − 1 = 4·2^{2n} − 1 = 3·2^{2n} + (2^{2n} − 1).",
    ],
    solutions: [
      {
        approach: "Algebraic step",
        text:
          "Base: 2⁰ − 1 = 0, divisible by 3.\nStep: assume 2^{2n} − 1 = 3k. Then 2^{2n+2} − 1 = 4·2^{2n} − 1 = 3·2^{2n} + (2^{2n} − 1) = 3·2^{2n} + 3k = 3(2^{2n} + k), divisible by 3.",
      },
      {
        approach: "Modular arithmetic",
        text:
          "4 ≡ 1 (mod 3), so 4^n ≡ 1 (mod 3), and 2^{2n} = 4^n. Hence 4^n − 1 ≡ 0 (mod 3). No induction needed.",
      },
    ],
    tags: ["divisibility"],
  },
];

export const QUESTIONS_BY_ID = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));
