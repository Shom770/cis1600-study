// Original practice problems on expectation, variance, and tail bounds (CIS 1600 Midterm 2 style).
// Every numeric answer was checked by exact enumeration with fractions.

export const BANK_EXPECTATION = [
  {
    id: "XE01",
    topic: "expectation",
    kind: "compute",
    difficulty: 1,
    title: "Gap between two dice",
    prompt:
      "Roll two fair six-sided dice and let D = |a − b| be the absolute difference of the two values. Write down the PMF of D and compute E[D].",
    hints: [
      "There are 36 equally likely outcomes. Count the outcomes with D = 0, 1, …, 5.",
      "For d ≥ 1, the number of ordered pairs with |a − b| = d is 2(6 − d). For d = 0 it is 6.",
      "E[D] = Σ d · Pr[D = d].",
    ],
    solutions: [
      {
        approach: "Build the PMF, then sum",
        text:
          "Pr[D = 0] = 6/36 (the doubles).\nFor d ≥ 1, the ordered pairs with |a − b| = d are (a, a + d) and (a + d, a) with 1 ≤ a ≤ 6 − d, giving 2(6 − d) pairs.\nPMF: Pr[D = 0] = 6/36, Pr[D = 1] = 10/36, Pr[D = 2] = 8/36, Pr[D = 3] = 6/36, Pr[D = 4] = 4/36, Pr[D = 5] = 2/36. (Check: 6 + 10 + 8 + 6 + 4 + 2 = 36.)\nE[D] = (0·6 + 1·10 + 2·8 + 3·6 + 4·4 + 5·2)/36 = (10 + 16 + 18 + 16 + 10)/36 = 70/36 = 35/18.",
      },
      {
        approach: "Tail sum",
        text:
          "D is a non-negative integer, so E[D] = Σ_{k≥1} Pr[D ≥ k].\nThe number of ordered pairs with |a − b| ≥ k is 2·(1 + 2 + … + (6 − k)) = (6 − k)(7 − k), so Pr[D ≥ k] = (6 − k)(7 − k)/36.\nk = 1..5 gives (30 + 20 + 12 + 6 + 2)/36 = 70/36 = 35/18.",
      },
    ],
    tags: ["PMF", "random variables", "tail sum"],
  },
  {
    id: "XE02",
    topic: "expectation",
    kind: "compute",
    difficulty: 1,
    title: "Four letters, four mailboxes",
    prompt:
      "Four letters are each dropped into one of four mailboxes, uniformly at random and independently. Find the expected number of mailboxes that stay empty.",
    hints: [
      "Let I_j be the indicator that mailbox j is empty.",
      "Mailbox j is empty when all four letters miss it; each letter misses it with probability 3/4.",
    ],
    solutions: [
      {
        approach: "Indicators and linearity",
        text:
          "Let I_j = 1 if mailbox j is empty. Pr[I_j = 1] = (3/4)^4 = 81/256, since each of the 4 letters independently avoids mailbox j with probability 3/4.\nThe number of empty mailboxes is E = I_1 + I_2 + I_3 + I_4, so by linearity E[E] = 4 · 81/256 = 81/64 ≈ 1.27.\n(The I_j are not independent, but linearity does not need independence.)",
      },
    ],
    tags: ["linearity", "indicators", "empty bins"],
  },
  {
    id: "XE03",
    topic: "expectation",
    kind: "compute",
    difficulty: 1,
    title: "Guessing on a multiple-choice quiz",
    prompt:
      "A quiz has 20 multiple-choice questions, each with 4 options, exactly one correct. A student guesses every answer uniformly at random, independently. Let X be the number of correct answers. Find E[X] and Var[X].",
    hints: [
      "X is binomial. Identify n and p.",
      "For a binomial, E = np and Var = np(1 − p).",
    ],
    solutions: [
      {
        approach: "Binomial formulas",
        text:
          "Each question is an independent trial with success probability p = 1/4, and there are n = 20 trials, so X ~ Bin(20, 1/4).\nE[X] = np = 20 · 1/4 = 5.\nVar[X] = np(1 − p) = 20 · 1/4 · 3/4 = 15/4.",
      },
      {
        approach: "Sum of independent indicators",
        text:
          "Write X = Y_1 + … + Y_20 where Y_i = 1 if question i is correct. E[Y_i] = 1/4, so E[X] = 20/4 = 5.\nVar[Y_i] = E[Y_i^2] − E[Y_i]^2 = 1/4 − 1/16 = 3/16. The Y_i are independent, so variances add: Var[X] = 20 · 3/16 = 15/4.",
      },
    ],
    tags: ["binomial", "variance"],
  },
  {
    id: "XE04",
    topic: "expectation",
    kind: "compute",
    difficulty: 1,
    title: "Waiting for a six",
    prompt:
      "You roll a fair die until a 6 appears; let X be the number of rolls, including the final one. (a) Find E[X] and Var[X]. (b) Find Pr[X > 3].",
    hints: [
      "X is geometric with p = 1/6.",
      "X > 3 means the first three rolls all fail.",
    ],
    solutions: [
      {
        approach: "Geometric formulas",
        text:
          "(a) X is geometric with p = 1/6. E[X] = 1/p = 6. Var[X] = (1 − p)/p^2 = (5/6)/(1/36) = 30.\n(b) X > 3 exactly when rolls 1, 2, 3 are all non-sixes, so Pr[X > 3] = (5/6)^3 = 125/216.",
      },
    ],
    tags: ["geometric", "variance"],
  },
  {
    id: "XE05",
    topic: "expectation",
    kind: "short",
    difficulty: 1,
    title: "Markov on exam scores",
    prompt:
      "Scores on an exam are non-negative and the class average is 60. (a) What does Markov's inequality say about the fraction of students who scored at least 90? (b) Is this bound achievable? Give an example or explain why not.",
    hints: [
      "Markov: for X ≥ 0 and a > 0, Pr[X ≥ a] ≤ E[X]/a.",
      "To make Markov tight, put all the mass at 0 and at exactly a.",
    ],
    solutions: [
      {
        approach: "Apply Markov, then build a tight example",
        text:
          "(a) Let X be the score of a uniformly random student. X ≥ 0 and E[X] = 60, so Pr[X ≥ 90] ≤ 60/90 = 2/3. At most two thirds of the class scored 90 or more.\n(b) Yes. If 2/3 of the class scores exactly 90 and 1/3 scores 0, the average is (2/3)·90 = 60 and exactly 2/3 scored at least 90. So the bound cannot be improved using only non-negativity and the mean.",
      },
    ],
    tags: ["Markov", "tightness"],
  },
  {
    id: "XE06",
    topic: "expectation",
    kind: "compute",
    difficulty: 1,
    title: "Counting HH in ten flips",
    prompt:
      "Flip a fair coin 10 times. Let X be the number of indices i (1 ≤ i ≤ 9) such that flips i and i+1 are both heads. (So HHH contains two occurrences.) Find E[X].",
    hints: [
      "Use one indicator per adjacent pair of positions. How many such pairs are there?",
      "Each indicator equals 1 with probability 1/4, even though neighboring indicators are dependent.",
    ],
    solutions: [
      {
        approach: "Indicators per adjacent pair",
        text:
          "For i = 1, …, 9 let I_i = 1 if flips i and i+1 are both heads. Pr[I_i = 1] = 1/2 · 1/2 = 1/4.\nX = I_1 + … + I_9, so E[X] = 9 · 1/4 = 9/4.\nI_i and I_{i+1} share flip i+1 and are dependent, but linearity of expectation holds regardless.",
      },
    ],
    tags: ["linearity", "indicators", "runs"],
  },
  {
    id: "XE07",
    topic: "expectation",
    kind: "short",
    difficulty: 1,
    title: "Does E[XY] split?",
    prompt:
      "True or false: for any random variables X and Y, E[XY] = E[X]·E[Y]. Justify with a proof or a counterexample. Then state a condition under which it is true.",
    hints: [
      "Try X = Y.",
      "With X = Y an indicator of a fair coin, compare E[X^2] with E[X]^2.",
    ],
    solutions: [
      {
        approach: "Counterexample with X = Y",
        text:
          "False. Let X be 1 if a fair coin lands heads and 0 otherwise, and let Y = X.\nThen XY = X^2 = X, so E[XY] = 1/2, while E[X]·E[Y] = 1/2 · 1/2 = 1/4.\nThe identity holds when X and Y are independent: E[XY] = Σ_{x,y} xy·Pr[X = x]Pr[Y = y] = (Σ x Pr[X = x])(Σ y Pr[Y = y]).\nContrast with linearity: E[X + Y] = E[X] + E[Y] always holds, with no independence needed.",
      },
    ],
    tags: ["independence", "product of expectations"],
  },
  {
    id: "XE08",
    topic: "expectation",
    kind: "compute",
    difficulty: 2,
    title: "Runs with a biased coin",
    prompt:
      "A coin lands heads with probability p. It is flipped n times. A run is a maximal block of consecutive equal outcomes (e.g. HHTHH has 3 runs). (a) Find the expected number of runs as a function of n and p. (b) Evaluate it for n = 10 and p = 1/3.",
    hints: [
      "The number of runs is 1 plus the number of positions where the outcome changes.",
      "Let C_i indicate that flip i differs from flip i+1, for i = 1, …, n−1.",
      "Pr[flips i and i+1 differ] = p(1 − p) + (1 − p)p.",
    ],
    solutions: [
      {
        approach: "Count the switches",
        text:
          "Every run after the first starts at a switch, a position i with flip i ≠ flip i+1. So R = 1 + C_1 + … + C_{n−1}, where C_i indicates a switch at i.\nPr[C_i = 1] = Pr[HT] + Pr[TH] = 2p(1 − p).\nBy linearity, E[R] = 1 + (n − 1)·2p(1 − p).\nFor n = 10, p = 1/3: E[R] = 1 + 9 · 2 · (1/3)(2/3) = 1 + 9 · 4/9 = 5.",
      },
      {
        approach: "Count run starts",
        text:
          "Let S_i = 1 if a run starts at position i. S_1 = 1 always. For i ≥ 2, a run starts at i exactly when flip i ≠ flip i−1, which has probability 2p(1 − p).\nE[R] = Σ E[S_i] = 1 + (n − 1)·2p(1 − p), which is 5 for n = 10, p = 1/3.\nNote the answer is largest at p = 1/2, where it is (n + 1)/2.",
      },
    ],
    tags: ["linearity", "indicators", "runs"],
  },
  {
    id: "XE09",
    topic: "expectation",
    kind: "proof",
    difficulty: 2,
    title: "Expected number of records",
    prompt:
      "The numbers 1, 2, …, n are put in uniformly random order. Position k is a record if its number is larger than every number before it (position 1 is always a record). Prove that the expected number of records is H(n) = 1 + 1/2 + … + 1/n, and give the value for n = 4.",
    hints: [
      "Let R_k indicate that position k is a record.",
      "Position k is a record exactly when it holds the largest of the first k numbers.",
      "By symmetry, each of the first k positions is equally likely to hold the largest of those k values.",
    ],
    solutions: [
      {
        approach: "Indicators and symmetry",
        text:
          "Let R_k = 1 if position k is a record. Then R_k = 1 exactly when the largest of the first k entries is in position k.\nThe first k entries form a uniformly random arrangement of some k-element set, so the maximum among them is equally likely to be in any of those k positions. Hence Pr[R_k = 1] = 1/k.\nThe number of records is R = R_1 + … + R_n, so E[R] = Σ_{k=1}^{n} 1/k = H(n).\nFor n = 4: 1 + 1/2 + 1/3 + 1/4 = 25/12.",
      },
      {
        approach: "Counting permutations",
        text:
          "Count permutations in which position k is a record. Choose which k values occupy the first k positions: C(n, k) ways. The largest of them must be in position k; the other k − 1 can be arranged in (k − 1)! ways, and the remaining n − k values in (n − k)! ways.\nTotal: C(n, k)(k − 1)!(n − k)! = n!/k. So Pr[R_k = 1] = 1/k, and E[R] = H(n) by linearity. For n = 4 this is 25/12.",
      },
    ],
    tags: ["linearity", "records", "random permutation"],
  },
  {
    id: "XE10",
    topic: "expectation",
    kind: "compute",
    difficulty: 2,
    title: "Couples around a round table",
    prompt:
      "Five couples (10 people) sit in a uniformly random arrangement around a round table with 10 seats. Find the expected number of couples who sit next to each other.",
    hints: [
      "Use one indicator per couple.",
      "Fix one partner's seat. The other partner is equally likely to be in any of the remaining 9 seats.",
      "Two of those 9 seats are adjacent to the first partner.",
    ],
    solutions: [
      {
        approach: "One indicator per couple",
        text:
          "Let A_i = 1 if couple i sits together. Given the seat of one partner, the other partner is uniformly distributed over the other 9 seats, and exactly 2 of them are adjacent (the table is round, so every seat has two neighbors).\nPr[A_i = 1] = 2/9, so the expected number of adjacent couples is 5 · 2/9 = 10/9.",
      },
      {
        approach: "One indicator per pair of neighboring seats",
        text:
          "There are 10 pairs of neighboring seats around the table. For a fixed pair, the person in the first seat has exactly one partner among the 9 others, and the second seat is equally likely to hold any of them, so the pair is a couple with probability 1/9.\nNo couple can occupy two different neighboring pairs, so the count of adjacent couples equals the count of neighboring seat pairs holding a couple.\nExpected value: 10 · 1/9 = 10/9.",
      },
    ],
    tags: ["linearity", "indicators", "matching pairs"],
  },
  {
    id: "XE11",
    topic: "expectation",
    kind: "compute",
    difficulty: 2,
    title: "Expected minimum of three dice",
    prompt:
      "Roll three fair six-sided dice and let m be the smallest value showing. Find E[m].",
    hints: [
      "m ≥ k exactly when all three dice show at least k.",
      "Use the tail-sum formula E[m] = Σ_{k≥1} Pr[m ≥ k].",
      "Pr[m ≥ k] = ((7 − k)/6)^3.",
    ],
    solutions: [
      {
        approach: "Tail sum",
        text:
          "m is a positive integer, so E[m] = Σ_{k=1}^{6} Pr[m ≥ k].\nm ≥ k means every die is in {k, …, 6}, which has 7 − k values, so Pr[m ≥ k] = (7 − k)^3/216.\nE[m] = (6^3 + 5^3 + 4^3 + 3^3 + 2^3 + 1^3)/216 = (216 + 125 + 64 + 27 + 8 + 1)/216 = 441/216 = 49/24 ≈ 2.04.",
      },
      {
        approach: "PMF from the tails",
        text:
          "Pr[m = k] = Pr[m ≥ k] − Pr[m ≥ k + 1] = ((7 − k)^3 − (6 − k)^3)/216.\nThis gives 91, 61, 37, 19, 7, 1 (over 216) for k = 1, …, 6.\nE[m] = (1·91 + 2·61 + 3·37 + 4·19 + 5·7 + 6·1)/216 = (91 + 122 + 111 + 76 + 35 + 6)/216 = 441/216 = 49/24.",
      },
    ],
    tags: ["tail sum", "min"],
  },
  {
    id: "XE12",
    topic: "expectation",
    kind: "compute",
    difficulty: 2,
    title: "Dealing until the first ace",
    prompt:
      "A standard 52-card deck is shuffled uniformly at random, and cards are turned over one at a time until the first ace appears. Find the expected number of cards turned over, including the ace.",
    hints: [
      "Count the non-aces that come before the first ace, then add 1.",
      "For a fixed non-ace card, look only at its relative order with the 4 aces.",
      "That card is first among those 5 cards with probability 1/5.",
    ],
    solutions: [
      {
        approach: "Indicators for each non-ace",
        text:
          "Let N be the number of cards turned over. Then N = 1 + Σ_c I_c, summing over the 48 non-aces c, where I_c = 1 if c comes before every ace.\nAmong c and the 4 aces, each of the 5 is equally likely to be first, so Pr[I_c = 1] = 1/5.\nE[N] = 1 + 48/5 = 53/5 = 10.6.",
      },
      {
        approach: "Symmetry of the gaps",
        text:
          "The 4 aces split the 48 non-aces into 5 gaps: before the first ace, between consecutive aces, and after the last ace. By symmetry each non-ace is equally likely to fall in each gap, so every gap has the same expected size, and the 5 sizes add to 48. So each has expected size 48/5.\nThe first ace sits right after the first gap, so E[N] = 48/5 + 1 = 53/5.",
      },
    ],
    tags: ["linearity", "stopping process", "symmetry"],
  },
  {
    id: "XE13",
    topic: "expectation",
    kind: "short",
    difficulty: 2,
    title: "Four misses so far",
    prompt:
      "You roll a fair die until the first 6. You have already rolled 4 times and seen no 6. (a) Given this, what is the expected total number of rolls (counting the 4 already made)? (b) Given this, what is the probability that you will need more than 7 rolls in total? Justify each answer with memorylessness.",
    hints: [
      "Let X be geometric with p = 1/6. You are conditioning on X > 4.",
      "Memorylessness: Pr[X > s + t | X > s] = Pr[X > t].",
      "The future rolls do not know about the past ones, so the remaining count is again geometric with p = 1/6.",
    ],
    solutions: [
      {
        approach: "Memorylessness",
        text:
          "Let X be the total number of rolls, geometric with p = 1/6.\n(a) Given X > 4, rolls 5, 6, … are fresh independent rolls, so the number of further rolls X − 4 is again geometric with p = 1/6. Hence E[X | X > 4] = 4 + 6 = 10.\n(b) Pr[X > 7 | X > 4] = Pr[X > 7]/Pr[X > 4] = (5/6)^7/(5/6)^4 = (5/6)^3 = 125/216, which equals Pr[X > 3].",
      },
      {
        approach: "Direct computation for (a)",
        text:
          "Pr[X = k | X > 4] = (5/6)^{k−1}(1/6)/(5/6)^4 = (5/6)^{k−5}(1/6) for k ≥ 5.\nSubstituting j = k − 4: this is the geometric PMF in j, so E[X | X > 4] = 4 + E[geometric(1/6)] = 4 + 6 = 10.",
      },
    ],
    tags: ["geometric", "memorylessness", "conditional expectation"],
  },
  {
    id: "XE14",
    topic: "expectation",
    kind: "proof",
    difficulty: 2,
    title: "Variance of fixed points",
    prompt:
      "Let σ be a uniformly random permutation of {1, …, n} with n ≥ 2, and let F be the number of fixed points (i with σ(i) = i). Prove that Var[F] = 1.",
    hints: [
      "F = I_1 + … + I_n where I_i indicates σ(i) = i. You already know E[F] = 1.",
      "Expand E[F^2] = Σ_i E[I_i^2] + Σ_{i≠j} E[I_i I_j].",
      "Pr[σ(i) = i and σ(j) = j] = (n − 2)!/n! = 1/(n(n − 1)).",
    ],
    solutions: [
      {
        approach: "Second moment",
        text:
          "Write F = Σ I_i with Pr[I_i = 1] = 1/n, so E[F] = 1.\nE[F^2] = Σ_i E[I_i^2] + Σ_{i≠j} E[I_i I_j].\nSince I_i^2 = I_i, the first sum is n · 1/n = 1.\nFor i ≠ j, I_i I_j = 1 when both i and j are fixed; the other n − 2 values can be permuted arbitrarily, so the probability is (n − 2)!/n! = 1/(n(n − 1)). There are n(n − 1) ordered pairs, so the second sum is 1.\nE[F^2] = 2, so Var[F] = 2 − 1^2 = 1.",
      },
      {
        approach: "Variances plus covariances",
        text:
          "Var[F] = Σ Var[I_i] + Σ_{i≠j} Cov(I_i, I_j).\nVar[I_i] = (1/n)(1 − 1/n), so the first sum is 1 − 1/n.\nCov(I_i, I_j) = 1/(n(n − 1)) − 1/n^2 = 1/(n^2(n − 1)). Over n(n − 1) ordered pairs this sums to 1/n.\nVar[F] = 1 − 1/n + 1/n = 1.\nThe indicators are positively correlated; ignoring that (pretending independence) would give the wrong answer 1 − 1/n.",
      },
    ],
    tags: ["variance", "indicators", "fixed points"],
  },
  {
    id: "XE15",
    topic: "expectation",
    kind: "compute",
    difficulty: 3,
    title: "Variance of overlapping HH counts",
    prompt:
      "Flip a fair coin n ≥ 2 times and let X be the number of i in {1, …, n−1} with flips i and i+1 both heads. (a) Find Var[X] as a function of n. (b) Evaluate it for n = 10.",
    hints: [
      "X = I_1 + … + I_{n−1}; each I_i is Bernoulli(1/4), so Var[I_i] = 3/16.",
      "I_i and I_j are independent when |i − j| ≥ 2, since they use disjoint flips. Only neighbors are correlated.",
      "E[I_i I_{i+1}] = Pr[flips i, i+1, i+2 all heads] = 1/8.",
    ],
    solutions: [
      {
        approach: "Variances plus neighbor covariances",
        text:
          "Var[X] = Σ_i Var[I_i] + 2 Σ_{i<j} Cov(I_i, I_j).\nEach Var[I_i] = 1/4 − 1/16 = 3/16, giving (n − 1)·3/16.\nIf j ≥ i + 2, I_i and I_j depend on disjoint flips, so they are independent and Cov = 0.\nIf j = i + 1: Cov = E[I_i I_{i+1}] − 1/16 = 1/8 − 1/16 = 1/16. There are n − 2 such pairs.\nVar[X] = 3(n − 1)/16 + 2(n − 2)/16 = (5n − 7)/16.\n(b) n = 10: Var[X] = 43/16. (Sanity check n = 2: 3/16, the variance of one Bernoulli(1/4).)",
      },
      {
        approach: "Second moment directly",
        text:
          "E[X] = (n − 1)/4. E[X^2] = Σ_{i,j} E[I_i I_j], over ordered pairs:\n• i = j: n − 1 terms, each 1/4.\n• |i − j| = 1: 2(n − 2) terms, each 1/8 (three heads needed).\n• |i − j| ≥ 2: the remaining (n − 1)^2 − (n − 1) − 2(n − 2) terms, each 1/16.\nFor n = 10: 9/4 + 16/8 + (81 − 9 − 16)/16 = 9/4 + 2 + 56/16 = 31/4.\nVar[X] = 31/4 − (9/4)^2 = 124/16 − 81/16 = 43/16.",
      },
    ],
    tags: ["variance", "indicators", "covariance"],
  },
  {
    id: "XE16",
    topic: "expectation",
    kind: "compute",
    difficulty: 2,
    title: "Chebyshev for a hundred dice",
    prompt:
      "Roll 100 fair six-sided dice and let S be the total. Use Chebyshev's inequality to bound Pr[|S − 350| ≥ 50]. (You may use that one die has variance 35/12.)",
    hints: [
      "E[S] = 100 · 7/2 = 350.",
      "The dice are independent, so Var[S] = 100 · 35/12.",
      "Chebyshev: Pr[|S − E[S]| ≥ c] ≤ Var[S]/c^2.",
    ],
    solutions: [
      {
        approach: "Variance of an independent sum, then Chebyshev",
        text:
          "One die: E = 7/2, E[X^2] = (1 + 4 + 9 + 16 + 25 + 36)/6 = 91/6, Var = 91/6 − 49/4 = 35/12.\nS is a sum of 100 independent dice: E[S] = 350 and Var[S] = 100 · 35/12 = 875/3.\nChebyshev: Pr[|S − 350| ≥ 50] ≤ (875/3)/50^2 = 875/7500 = 7/60 ≈ 0.117.",
      },
    ],
    tags: ["Chebyshev", "variance", "independence"],
  },
  {
    id: "XE17",
    topic: "expectation",
    kind: "compute",
    difficulty: 2,
    title: "How many flips for a good estimate?",
    prompt:
      "You flip a fair coin n times and use the fraction of heads, X/n, to estimate 1/2. Using Chebyshev's inequality, find the smallest n that guarantees Pr[|X/n − 1/2| ≥ 1/10] ≤ 1/20.",
    hints: [
      "X ~ Bin(n, 1/2), so Var[X] = n/4 and Var[X/n] = 1/(4n).",
      "Chebyshev gives Pr[|X/n − 1/2| ≥ 1/10] ≤ (1/(4n))/(1/100) = 25/n.",
    ],
    solutions: [
      {
        approach: "Chebyshev on the sample mean",
        text:
          "X ~ Bin(n, 1/2) has Var[X] = n/4. Scaling by 1/n multiplies the variance by 1/n^2, so Var[X/n] = 1/(4n), and E[X/n] = 1/2.\nChebyshev: Pr[|X/n − 1/2| ≥ 1/10] ≤ (1/(4n))/(1/10)^2 = 100/(4n) = 25/n.\nWe need 25/n ≤ 1/20, i.e. n ≥ 500. So n = 500 flips suffice by this argument.",
      },
      {
        approach: "Chebyshev on the count",
        text:
          "|X/n − 1/2| ≥ 1/10 is the same event as |X − n/2| ≥ n/10.\nChebyshev: Pr[|X − n/2| ≥ n/10] ≤ (n/4)/(n^2/100) = 25/n.\nSet 25/n ≤ 1/20 to get n ≥ 500.",
      },
    ],
    tags: ["Chebyshev", "binomial", "sample size"],
  },
  {
    id: "XE18",
    topic: "expectation",
    kind: "compute",
    difficulty: 2,
    title: "Markov for a lower tail",
    prompt:
      "Quiz scores X lie between 0 and 10, and the mean score is 7. Use Markov's inequality to bound Pr[X ≤ 4]. Show that your bound is tight. Why does applying Markov to X directly not help here?",
    hints: [
      "Markov bounds upper tails of a non-negative variable. You want a lower tail of X.",
      "Look at Y = 10 − X. It is non-negative because X ≤ 10.",
      "X ≤ 4 exactly when Y ≥ 6.",
    ],
    solutions: [
      {
        approach: "Flip the variable, then Markov",
        text:
          "Let Y = 10 − X. Since X ≤ 10, Y ≥ 0, and E[Y] = 10 − 7 = 3.\nX ≤ 4 exactly when Y ≥ 6. By Markov, Pr[Y ≥ 6] ≤ E[Y]/6 = 3/6 = 1/2.\nSo Pr[X ≤ 4] ≤ 1/2.\nTight: let X = 10 with probability 1/2 and X = 4 with probability 1/2. The mean is 7 and Pr[X ≤ 4] = 1/2.\nMarkov on X itself only bounds events of the form X ≥ a; it says nothing about X being small.",
      },
    ],
    tags: ["Markov", "shift"],
  },
  {
    id: "XE19",
    topic: "expectation",
    kind: "compute",
    difficulty: 2,
    title: "Collecting only the low faces",
    prompt:
      "A fair die is rolled repeatedly. Find the expected number of rolls until each of the faces 1, 2, and 3 has appeared at least once. (Faces 4, 5, 6 are allowed but do not count.)",
    hints: [
      "Split the process into phases: waiting for the first new low face, then the second, then the third.",
      "When j of the three target faces are still missing, each roll hits a new one with probability j/6.",
      "Each phase is geometric; add the expectations.",
    ],
    solutions: [
      {
        approach: "Coupon-collector phases",
        text:
          "Let T_j be the number of rolls spent while exactly j of the faces {1, 2, 3} are still missing (j = 3, 2, 1). During that phase each roll produces a new target face with probability j/6, independently, so T_j is geometric with p = j/6 and E[T_j] = 6/j.\nTotal: E[T] = 6/3 + 6/2 + 6/1 = 2 + 3 + 6 = 11.",
      },
      {
        approach: "Reduce to the standard collector",
        text:
          "Each roll is a target face with probability 1/2, so on average 2 rolls are used per target roll. Restricted to target rolls, the faces are uniform on {1, 2, 3}, so collecting all three needs 3·H(3) = 3(1 + 1/2 + 1/3) = 11/2 target rolls in expectation.\nThe waits between target rolls are independent geometric(1/2) variables with mean 2, so E[T] = 2 · 11/2 = 11.",
      },
    ],
    tags: ["coupon collector", "geometric", "linearity"],
  },
  {
    id: "XE20",
    topic: "expectation",
    kind: "proof",
    difficulty: 3,
    title: "Coupon collector concentrates",
    prompt:
      "Let T be the number of boxes needed to collect all n coupon types (each box holds a uniformly random type, independently). (a) Prove that Var[T] < 2n^2. (b) Deduce that Pr[T ≥ 2n·H(n)] ≤ 2/H(n)^2, where H(n) = 1 + 1/2 + … + 1/n. (c) As a check, compute Var[T] exactly for n = 3.",
    hints: [
      "Write T = T_1 + … + T_n, where T_i is the wait for the i-th new type. The T_i are independent geometric variables with p_i = (n − i + 1)/n.",
      "Var[T_i] = (1 − p_i)/p_i^2 ≤ 1/p_i^2 = n^2/(n − i + 1)^2.",
      "Σ_{k=1}^{n} 1/k^2 ≤ 1 + Σ_{k≥2} 1/(k(k − 1)) < 2. For (b), use Chebyshev with deviation n·H(n).",
    ],
    solutions: [
      {
        approach: "Phase decomposition, then Chebyshev",
        text:
          "(a) Let T_i be the number of boxes bought while exactly i − 1 types are held. Each box is new with probability p_i = (n − i + 1)/n, so T_i is geometric(p_i), and the phases are independent because they use disjoint sets of independent boxes. Hence\nVar[T] = Σ_i Var[T_i] = Σ_i (1 − p_i)/p_i^2 ≤ Σ_i 1/p_i^2 = Σ_{k=1}^{n} n^2/k^2.\nNow Σ_{k=1}^{n} 1/k^2 ≤ 1 + Σ_{k=2}^{n} 1/(k(k − 1)) = 1 + Σ_{k=2}^{n} (1/(k − 1) − 1/k) = 2 − 1/n < 2. So Var[T] < 2n^2.\n(b) E[T] = n·H(n). If T ≥ 2n·H(n) then |T − E[T]| ≥ n·H(n). By Chebyshev,\nPr[T ≥ 2n·H(n)] ≤ Var[T]/(n·H(n))^2 < 2n^2/(n^2 H(n)^2) = 2/H(n)^2.\nSince H(n) grows like ln n, this goes to 0.\n(c) n = 3: p = 1, 2/3, 1/3. Var = 0 + (1/3)/(4/9) + (2/3)/(1/9) = 3/4 + 6 = 27/4, which is below 2·9 = 18.",
      },
    ],
    tags: ["coupon collector", "variance", "Chebyshev"],
  },
  {
    id: "XE21",
    topic: "expectation",
    kind: "flaw",
    difficulty: 2,
    title: "Markov on a bet that can lose",
    prompt:
      "A student writes: \"Let X be my net winnings from a bet. I know E[X] = 1. By Markov's inequality, Pr[X ≥ 2] ≤ E[X]/2 = 1/2, so I win at least 2 dollars at most half the time.\" Find the error, and give a specific X with E[X] = 1 for which the conclusion is false.",
    hints: [
      "What hypothesis does Markov's inequality need?",
      "Net winnings can be negative. Large losses can pull the mean down while the chance of a big win stays high.",
      "Try X taking only two values, one negative and one equal to 2.",
    ],
    solutions: [
      {
        approach: "Missing hypothesis plus counterexample",
        text:
          "Markov's inequality requires X ≥ 0. Net winnings can be negative, so the inequality does not apply.\nCounterexample: X = 2 with probability 3/4 and X = −2 with probability 1/4. Then E[X] = 3/2 − 1/2 = 1, but Pr[X ≥ 2] = 3/4 > 1/2.\nWhere the proof breaks: Markov uses E[X] ≥ a·Pr[X ≥ a], which needs every outcome with X < a to contribute at least 0 to E[X]. Negative values contribute less than 0.\nThe fix: if you also know X ≥ −c, apply Markov to X + c ≥ 0. Here c = 2 gives Pr[X ≥ 2] = Pr[X + 2 ≥ 4] ≤ 3/4, which is correct (and tight for the example).",
      },
    ],
    tags: ["Markov", "flaw", "non-negativity"],
  },
  {
    id: "XE22",
    topic: "expectation",
    kind: "flaw",
    difficulty: 2,
    title: "Red cards on top: the variance slip",
    prompt:
      "Deal the top two cards of a shuffled 52-card deck, and let X be the number of red cards among them. A student argues: \"X = I_1 + I_2, where I_k indicates that card k is red. Each I_k is Bernoulli(1/2) with variance 1/4, so Var[X] = 1/4 + 1/4 = 1/2.\" Find the mistake and compute Var[X] correctly.",
    hints: [
      "Variances add for independent variables. Are I_1 and I_2 independent?",
      "Var[I_1 + I_2] = Var[I_1] + Var[I_2] + 2 Cov(I_1, I_2).",
      "Pr[both red] = (26/52)(25/51).",
    ],
    solutions: [
      {
        approach: "Add the covariance term",
        text:
          "The error: the cards are dealt without replacement, so I_1 and I_2 are not independent (a red first card makes a red second card less likely). Adding variances needs independence. The expectation E[X] = 1 is fine, since linearity needs no independence.\nCorrect computation: E[I_1 I_2] = Pr[both red] = (26/52)(25/51) = 25/102.\nCov(I_1, I_2) = 25/102 − 1/4 = (50 − 51)/204 = −1/204.\nVar[X] = 1/4 + 1/4 + 2(−1/204) = 1/2 − 1/102 = 25/51.",
      },
      {
        approach: "From the PMF",
        text:
          "Pr[X = 2] = 25/102 and Pr[X = 0] = 25/102 by symmetry, so Pr[X = 1] = 52/102.\nE[X] = 1 and E[X^2] = 52/102 + 4·25/102 = 152/102.\nVar[X] = 152/102 − 1 = 50/102 = 25/51, slightly less than the student's 1/2.",
      },
    ],
    tags: ["variance", "independence", "flaw"],
  },
  {
    id: "XE23",
    topic: "expectation",
    kind: "compute",
    difficulty: 3,
    title: "Two sixes in a row",
    prompt:
      "Roll a fair die repeatedly until two consecutive rolls are both 6. Find the expected number of rolls.",
    hints: [
      "Define states by the relevant recent history: E_0 = expected remaining rolls when the last roll was not a 6 (or at the start), E_1 = expected remaining rolls when the last roll was a single 6.",
      "From E_1: with probability 1/6 you finish; otherwise you are back to E_0.",
      "Alternatively: wait for a 6 (6 rolls on average), then roll once more; with probability 5/6 you start over.",
    ],
    solutions: [
      {
        approach: "First-step analysis with states",
        text:
          "Let E_0 be the expected number of further rolls from the start (or after a non-6), and E_1 the expected number after a single 6.\nE_0 = 1 + (5/6)E_0 + (1/6)E_1.\nE_1 = 1 + (5/6)E_0 + (1/6)·0.\nSubstitute: E_0 = 1 + (5/6)E_0 + 1/6 + (5/36)E_0, so E_0(1 − 35/36) = 7/6, so E_0 = 42.",
      },
      {
        approach: "Rounds that end at a 6",
        text:
          "Let E be the answer. First wait for a 6: expected 6 rolls (geometric, p = 1/6). Then roll once more. With probability 1/6 it is a 6 and we stop; with probability 5/6 it is not, and the whole process starts over.\nE = 6 + 1 + (5/6)E, so E/6 = 7 and E = 42.",
      },
    ],
    tags: ["stopping process", "first-step analysis", "geometric"],
  },
  {
    id: "XE24",
    topic: "expectation",
    kind: "compute",
    difficulty: 2,
    title: "Peaks in a random permutation",
    prompt:
      "Put 1, 2, …, n (n ≥ 2) in uniformly random order. Position i is a peak if its value is larger than each of its neighbors (an endpoint has only one neighbor). Find the expected number of peaks, and give the value for n = 5.",
    hints: [
      "Use an indicator for each position. Treat endpoints and interior positions separately.",
      "An interior position is a peak when it holds the largest of 3 values; an endpoint when it holds the larger of 2.",
    ],
    solutions: [
      {
        approach: "Indicators by position type",
        text:
          "Let P_i = 1 if position i is a peak.\nInterior position (2 ≤ i ≤ n − 1): the three values at i − 1, i, i + 1 are in uniformly random relative order, so the middle one is the largest with probability 1/3.\nEndpoint (i = 1 or n): it beats its single neighbor with probability 1/2.\nE[peaks] = 2 · 1/2 + (n − 2) · 1/3 = (n + 1)/3.\nFor n = 5: 6/3 = 2.",
      },
    ],
    tags: ["linearity", "indicators", "random permutation"],
  },
  {
    id: "XE25",
    topic: "expectation",
    kind: "proof",
    difficulty: 3,
    title: "How long does the climb last?",
    prompt:
      "Draw numbers uniformly and independently from {1, 2, …, n}. Stop at the first draw that is less than or equal to the previous draw. Let N be the total number of draws, including the one that stops the process. Prove that E[N] = (1 + 1/n)^n, and give the value for n = 3.",
    hints: [
      "N is a positive integer, so E[N] = Σ_{k≥0} Pr[N > k].",
      "N > k exactly when the first k draws are strictly increasing.",
      "A strictly increasing sequence of length k is determined by its set of values, so there are C(n, k) of them.",
    ],
    solutions: [
      {
        approach: "Tail sum plus the binomial theorem",
        text:
          "For k ≥ 1, N > k exactly when draws 1, …, k are strictly increasing (the process has not stopped through draw k). For k = 0 this holds trivially, and it also holds for k = 1.\nA strictly increasing sequence of k values from {1, …, n} corresponds to a k-element subset, so there are C(n, k) of them out of n^k equally likely sequences:\nPr[N > k] = C(n, k)/n^k, which is 0 for k > n.\nBy the tail-sum formula,\nE[N] = Σ_{k=0}^{n} C(n, k)(1/n)^k = (1 + 1/n)^n by the binomial theorem.\nFor n = 3: (4/3)^3 = 64/27 ≈ 2.37. (As n grows this tends to e.)",
      },
    ],
    tags: ["tail sum", "stopping process", "binomial theorem"],
  },
  {
    id: "XE26",
    topic: "expectation",
    kind: "compute",
    difficulty: 3,
    title: "Rolling until a repeat",
    prompt:
      "Roll a fair four-sided die (faces 1, 2, 3, 4) until some face appears for the second time. Let N be the number of rolls, including the repeat. Find E[N].",
    hints: [
      "N is at most 5 by pigeonhole.",
      "N > k exactly when the first k rolls are all different.",
      "Pr[N > k] = 4·3·…·(4 − k + 1)/4^k; then use the tail-sum formula.",
    ],
    solutions: [
      {
        approach: "Tail sum",
        text:
          "N > k exactly when the first k rolls are distinct, so Pr[N > k] = 4!/((4 − k)!·4^k) for 0 ≤ k ≤ 4, and 0 for k ≥ 5.\nPr[N > 0] = 1, Pr[N > 1] = 1, Pr[N > 2] = 12/16 = 3/4, Pr[N > 3] = 24/64 = 3/8, Pr[N > 4] = 24/256 = 3/32.\nE[N] = 1 + 1 + 3/4 + 3/8 + 3/32 = (32 + 32 + 24 + 12 + 3)/32 = 103/32 ≈ 3.22.",
      },
      {
        approach: "PMF",
        text:
          "Pr[N = k] = Pr[N > k − 1] − Pr[N > k]:\nPr[N = 2] = 1 − 3/4 = 1/4, Pr[N = 3] = 3/4 − 3/8 = 3/8, Pr[N = 4] = 3/8 − 3/32 = 9/32, Pr[N = 5] = 3/32.\n(Check: 8 + 12 + 9 + 3 = 32.)\nE[N] = (2·8 + 3·12 + 4·9 + 5·3)/32 = (16 + 36 + 36 + 15)/32 = 103/32.",
      },
    ],
    tags: ["tail sum", "birthday", "stopping process"],
  },
];
