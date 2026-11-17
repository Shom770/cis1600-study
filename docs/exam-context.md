# CIS 1600 Midterm 2: exam context

## Logistics
- Thursday, November 19, 2026, during your section's class time. Section 001: 8:30 to 10:00 AM. Section 002: 10:15 to 11:45 AM.
- Rooms: TOWNE 100 (last names A to S), TOWNE 311 (T to Z). Section 001 meets in BENN 419.
- 90 minutes. Format inferred from the Fall 2018 practice exam: 8 problems, 100 points, closed book, closed notes, no calculators, a mix of short answers and full proofs.

## Scope
Everything through Lecture 11T except relations. Lectures 5T to 11T are in scope. Earlier material (induction, pigeonhole, counting) is background. Graphs and probability are tested explicitly. Relations (equivalence relations, operations on relations) are excluded, as are 11H, 12H, and 12T.

| Lecture | Topics |
|---|---|
| 5T | Graph definitions, degrees, handshake lemma, walks, paths, cycles, components bound (n − m), induction on edges |
| 5H | Sample spaces, Monty Hall, inclusion–exclusion, union bound, birthday problem, conditional probability |
| 6T | Trees: acyclic graphs, leaves, n − 1 edges, equivalent characterizations |
| 7T | Conditional probability, multiplication rule, total probability, independence |
| 8T | Trees, rooted trees, Hamiltonian graphs |
| 8H | Independent events, random variables, PMFs, expectation, linearity, hat check, expected empty bins |
| 9T | Eulerian graphs, colouring (max degree k ⇒ (k+1)-colourable) |
| 9H | Markov, variance, Chebyshev, linearity examples |
| 10T | Matchings, augmenting paths, maximal vs. maximum |
| 10H | Geometric and binomial, memorylessness, coupon collector |
| 11T | Bipartite matching, Hall's theorem |

## Key results
- Probability: conditional probability, Bayes, total probability; independence (pairwise ≠ mutual); linearity with indicators; geometric E = 1/p, Var = (1−p)/p²; binomial E = np, Var = np(1−p); Markov (X ≥ 0), Chebyshev; shift before Markov; coupon collector n·H(n).
- Graphs and trees: handshake; Euler circuit iff connected and all degrees even, trail iff 0 or 2 odd; connected even graph has no cut edge; trees have n − 1 edges and ≥ 2 leaves; max-degree-3 tree n₁ = n₃ + 2; ≥ n − m components; greedy (k+1)-colouring; Mantel n²/4; Ore's condition.
- Matchings: maximum iff no augmenting path; maximal ≠ maximum; Hall's theorem.
- Induction and pigeonhole: weak and strong induction, flawed proofs failing at the smallest case, generalized pigeonhole, friends-or-strangers among six people.

## Exam style
Short answers want a crisp justification (counterexample or one-line argument). Proof templates: induction on edges, leaves, or vertices; longest path or maximal counterexample; degree counting; double counting; parity contradiction. Probability problems often mix conditioning with linearity. Common traps: pairwise vs. mutual independence, forgetting to rescale when conditioning, counting chords as cycle edges, applying Markov to a variable that can be negative.

## Content rules
Do not reproduce course materials verbatim. Write original problems in the course's style and verify arithmetic and proofs before adding them.
