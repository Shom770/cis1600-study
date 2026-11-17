// Extra original practice problems: induction and pigeonhole.
// Same schema as lib/questions.js. Numeric claims checked by brute force.

export const BANK_INDUCTION = [
  {
    id: "XI01",
    topic: "induction",
    kind: "proof",
    difficulty: 1,
    title: "A weighted sum of powers of two",
    prompt:
      "Prove that for all n ≥ 1,\n1·2 + 2·2^2 + 3·2^3 + … + n·2^n = (n − 1)·2^{n+1} + 2.",
    hints: [
      "Check n = 1: both sides equal 2.",
      "In the step, add (k+1)·2^{k+1} to (k − 1)·2^{k+1} + 2 and factor out 2^{k+1}.",
    ],
    solutions: [
      {
        approach: "Weak induction",
        text:
          "Let S_n = Σ_{i=1}^{n} i·2^i.\nBase n = 1: S_1 = 2 and (1 − 1)·2^2 + 2 = 2.\nStep: assume S_k = (k − 1)·2^{k+1} + 2. Then\nS_{k+1} = S_k + (k + 1)·2^{k+1} = (k − 1 + k + 1)·2^{k+1} + 2 = 2k·2^{k+1} + 2 = k·2^{k+2} + 2,\nwhich is ((k+1) − 1)·2^{(k+1)+1} + 2. Done.",
      },
      {
        approach: "Shift and subtract",
        text:
          "2S_n = Σ_{i=1}^{n} i·2^{i+1} = Σ_{j=2}^{n+1} (j − 1)·2^j.\n2S_n − S_n = n·2^{n+1} + Σ_{j=2}^{n} ((j − 1) − j)·2^j − 1·2^1 = n·2^{n+1} − (2^2 + … + 2^n) − 2.\nSince 2^2 + … + 2^n = 2^{n+1} − 4, S_n = n·2^{n+1} − 2^{n+1} + 4 − 2 = (n − 1)·2^{n+1} + 2.",
      },
    ],
    tags: ["weak induction", "sum"],
  },
  {
    id: "XI02",
    topic: "induction",
    kind: "proof",
    difficulty: 2,
    title: "Divisible by 7",
    prompt:
      "Prove that 3^{2n+1} + 2^{n+2} is divisible by 7 for every integer n ≥ 0.",
    hints: [
      "Base n = 0: 3 + 4 = 7.",
      "Write 3^{2n+3} = 9·3^{2n+1} and 2^{n+3} = 2·2^{n+2}.",
      "9a + 2b = 9(a + b) − 7b.",
    ],
    solutions: [
      {
        approach: "Weak induction",
        text:
          "Let f(n) = 3^{2n+1} + 2^{n+2}.\nBase n = 0: f(0) = 3 + 4 = 7.\nStep: assume 7 | f(k). Then\nf(k+1) = 3^{2k+3} + 2^{k+3} = 9·3^{2k+1} + 2·2^{k+2} = 9(3^{2k+1} + 2^{k+2}) − 7·2^{k+2} = 9·f(k) − 7·2^{k+2}.\nBoth terms are multiples of 7, so 7 | f(k+1).",
      },
      {
        approach: "Modular arithmetic",
        text:
          "3^{2n+1} = 3·9^n ≡ 3·2^n (mod 7), since 9 ≡ 2.\n2^{n+2} = 4·2^n.\nSum ≡ 3·2^n + 4·2^n = 7·2^n ≡ 0 (mod 7).",
      },
    ],
    tags: ["divisibility", "weak induction"],
  },
  {
    id: "XI03",
    topic: "induction",
    kind: "proof",
    difficulty: 3,
    title: "Strengthen to make it go through",
    prompt:
      "Prove that for all n ≥ 1, 1 + 1/4 + 1/9 + … + 1/n^2 < 2.\n(A direct induction on \"< 2\" gets stuck. Prove something stronger.)",
    hints: [
      "Try to prove Σ_{i=1}^{n} 1/i^2 ≤ 2 − 1/n.",
      "In the step you need 1/(k+1)^2 ≤ 1/k − 1/(k+1).",
      "1/k − 1/(k+1) = 1/(k(k+1)).",
    ],
    solutions: [
      {
        approach: "Strengthened induction",
        text:
          "Why plain induction fails: knowing only S_k < 2 tells you nothing about S_k + 1/(k+1)^2, which could exceed 2 as far as the hypothesis knows.\nClaim: S_n = Σ_{i=1}^{n} 1/i^2 ≤ 2 − 1/n for n ≥ 1.\nBase n = 1: S_1 = 1 = 2 − 1.\nStep: assume S_k ≤ 2 − 1/k. Then S_{k+1} ≤ 2 − 1/k + 1/(k+1)^2. It suffices that 1/(k+1)^2 ≤ 1/k − 1/(k+1) = 1/(k(k+1)), which holds because k(k+1) < (k+1)^2. So S_{k+1} ≤ 2 − 1/(k+1).\nHence S_n ≤ 2 − 1/n < 2.",
      },
      {
        approach: "Telescoping bound",
        text:
          "For i ≥ 2, 1/i^2 < 1/(i(i−1)) = 1/(i−1) − 1/i. So\nS_n ≤ 1 + Σ_{i=2}^{n} (1/(i−1) − 1/i) = 1 + 1 − 1/n = 2 − 1/n < 2.",
      },
    ],
    tags: ["inequality", "strengthening"],
  },
  {
    id: "XI04",
    topic: "induction",
    kind: "compute",
    difficulty: 2,
    title: "Stamps of 4 and 5 cents",
    prompt:
      "You have unlimited 4-cent and 5-cent stamps.\n(a) Find the largest amount (in cents) that cannot be made exactly.\n(b) Prove by strong induction that every amount above it can be made.",
    hints: [
      "List small amounts: 4, 5, 8, 9, 10, 12, … Which are missing?",
      "Once four consecutive amounts work, adding a 4-cent stamp covers everything after.",
      "Use bases 12, 13, 14, 15 and step n ← n − 4.",
    ],
    solutions: [
      {
        approach: "Strong induction with four bases",
        text:
          "(a) The amounts that cannot be made are 1, 2, 3, 6, 7, 11. In particular 11 cannot: 11 − 0, 11 − 5, 11 − 10 = 11, 6, 1 are not multiples of 4. Largest = 11.\n(b) Claim: every n ≥ 12 is 4a + 5b with a, b ≥ 0.\nBases: 12 = 4·3, 13 = 4·2 + 5, 14 = 4 + 5·2, 15 = 5·3.\nStep: let n ≥ 16 and assume the claim for all m with 12 ≤ m < n. Then 12 ≤ n − 4 < n, so n − 4 = 4a + 5b, and n = 4(a + 1) + 5b.",
      },
      {
        approach: "Weak induction by swapping stamps",
        text:
          "(b) Base 12 = 4·3. Suppose n ≥ 12 is made with a fours and b fives.\nIf a ≥ 1: replace one 4 by one 5 to get n + 1.\nIf a = 0: then n = 5b ≥ 12, so b ≥ 3. Replace three 5s (15) by four 4s (16) to get n + 1.\nEither way n + 1 can be made.",
      },
    ],
    tags: ["strong induction", "postage"],
  },
  {
    id: "XI05",
    topic: "induction",
    kind: "proof",
    difficulty: 1,
    title: "Breaking a chocolate bar",
    prompt:
      "A chocolate bar is an m × n grid of squares. A break takes one piece and splits it along a single grid line into two pieces. Prove that, no matter how you break, it takes exactly mn − 1 breaks to reduce the bar to mn single squares.",
    hints: [
      "Strong induction on the number of squares N = mn.",
      "The first break splits N squares into pieces of sizes A and B with A + B = N.",
      "Or track how the number of pieces changes with each break.",
    ],
    solutions: [
      {
        approach: "Strong induction on the number of squares",
        text:
          "Claim: any rectangular piece with N squares needs exactly N − 1 breaks.\nBase N = 1: already a single square, 0 breaks.\nStep: let N ≥ 2 and assume the claim for all pieces with fewer than N squares. The first break splits the piece into rectangles with A and B squares, A, B ≥ 1, A + B = N. Every later break acts inside one of the two pieces, so by the hypothesis they take exactly A − 1 and B − 1 breaks. Total 1 + (A − 1) + (B − 1) = N − 1.\nWith N = mn this is mn − 1.",
      },
      {
        approach: "Invariant",
        text:
          "Each break turns one piece into two, increasing the number of pieces by exactly 1. We start with 1 piece and end with mn pieces, so the number of breaks is mn − 1, whatever the order.",
      },
    ],
    tags: ["strong induction", "invariant"],
  },
  {
    id: "XI06",
    topic: "induction",
    kind: "proof",
    difficulty: 2,
    title: "A three-term recurrence bound",
    prompt:
      "Define t_1 = t_2 = t_3 = 1 and t_n = t_{n−1} + t_{n−2} + t_{n−3} for n ≥ 4.\n(a) Compute t_4, …, t_8.\n(b) Prove that t_n ≤ 2^{n−2} for all n ≥ 2. Be explicit about which base cases you need and why.",
    hints: [
      "The step for n uses n − 1, n − 2, n − 3, so all three must be in range.",
      "2^{n−3} + 2^{n−4} + 2^{n−5} = 7·2^{n−5} ≤ 8·2^{n−5}.",
    ],
    solutions: [
      {
        approach: "Strong induction with three bases",
        text:
          "(a) t_4 = 3, t_5 = 5, t_6 = 9, t_7 = 17, t_8 = 31.\n(b) The step for n uses t_{n−1}, t_{n−2}, t_{n−3}, which must all be covered by the claim (indices ≥ 2). That needs n − 3 ≥ 2, i.e. n ≥ 5. So check n = 2, 3, 4 directly:\nt_2 = 1 ≤ 1, t_3 = 1 ≤ 2, t_4 = 3 ≤ 4.\nStep: let n ≥ 5 and assume t_m ≤ 2^{m−2} for 2 ≤ m < n. Then\nt_n = t_{n−1} + t_{n−2} + t_{n−3} ≤ 2^{n−3} + 2^{n−4} + 2^{n−5} = 7·2^{n−5} < 8·2^{n−5} = 2^{n−2}.\n(Note n = 1 must be excluded: t_1 = 1 > 2^{−1}.)",
      },
    ],
    tags: ["strong induction", "recurrence", "base cases"],
  },
  {
    id: "XI07",
    topic: "induction",
    kind: "flaw",
    difficulty: 1,
    title: "A step with nothing under it",
    prompt:
      "Claim: n^2 + n + 1 is even for every positive integer n.\n\"Proof\": Assume k^2 + k + 1 is even. Then (k+1)^2 + (k+1) + 1 = (k^2 + k + 1) + 2(k + 1), which is even + even = even. So the claim holds for all n.\nIs the inductive step correct? What is wrong, and what is actually true?",
    hints: [
      "The algebra in the step is fine. Check it.",
      "What does the proof never verify?",
    ],
    solutions: [
      {
        approach: "Missing base case",
        text:
          "The step is valid: (k+1)^2 + (k+1) + 1 = k^2 + 3k + 3 = (k^2 + k + 1) + 2(k + 1). But no base case is proved, and the base case is false: n = 1 gives 3, which is odd. An implication P(k) ⇒ P(k+1) with no true starting point proves nothing.\nIn fact the opposite holds: n^2 + n = n(n + 1) is a product of consecutive integers, hence even, so n^2 + n + 1 is always odd. (The same step, with the true base case 1^2 + 1 + 1 = 3 odd, proves \"always odd\" by induction.)",
      },
    ],
    tags: ["flawed induction", "base case"],
  },
  {
    id: "XI08",
    topic: "induction",
    kind: "flaw",
    difficulty: 2,
    title: "All positive integers are equal",
    prompt:
      "Claim: for every n ≥ 1, if a and b are positive integers with max(a, b) = n, then a = b.\n\"Proof\": Induction on n. Base n = 1: max(a, b) = 1 with a, b ≥ 1 forces a = b = 1. Step: assume the claim for n = k. Let max(a, b) = k + 1. Then max(a − 1, b − 1) = k, so by the hypothesis a − 1 = b − 1, hence a = b.\nThis would show every two positive integers are equal. Find the flaw.",
    hints: [
      "Which objects does the induction hypothesis talk about?",
      "Try a = 1, b = 2.",
    ],
    solutions: [
      {
        approach: "Hypothesis applied outside its domain",
        text:
          "The hypothesis P(k) only covers pairs of positive integers. In the step, a − 1 or b − 1 may be 0. For example a = 1, b = 2, max = 2: the step applies P(1) to (0, 1), but 0 is not a positive integer, so P(1) says nothing about it. (Indeed max(0, 1) = 1 while 0 ≠ 1.)\nSo the step P(k) ⇒ P(k+1) fails already at k = 1, which is exactly the first case where the argument is used. The base case is fine; the bridge from 1 to 2 is broken.",
      },
    ],
    tags: ["flawed induction", "domain"],
  },
  {
    id: "XI09",
    topic: "induction",
    kind: "flaw",
    difficulty: 2,
    title: "Build-up error with graphs",
    prompt:
      "Claim: every graph on n ≥ 2 vertices in which every vertex has degree at least 1 is connected.\n\"Proof\": Induction on n. Base n = 2: both vertices have degree ≥ 1, so the edge between them exists and the graph is connected. Step: take a graph G on k vertices with minimum degree ≥ 1; by hypothesis it is connected. Add a new vertex v with at least one edge. That edge joins v to G, so the new graph on k + 1 vertices is connected.\nFind the flaw and a counterexample.",
    hints: [
      "Does every graph on k + 1 vertices with minimum degree ≥ 1 arise this way?",
      "Remove a vertex from two disjoint edges. What happens to its neighbour's degree?",
    ],
    solutions: [
      {
        approach: "Not every graph is built up this way",
        text:
          "The step starts from a k-vertex graph satisfying the hypothesis and builds a (k+1)-vertex graph. It never shows that an arbitrary (k+1)-vertex graph with minimum degree ≥ 1 can be obtained like that. A correct step must start from an arbitrary graph H on k + 1 vertices and reduce it: delete a vertex v. But H − v may have a vertex of degree 0, so the hypothesis does not apply.\nCounterexample: 4 vertices with edges ab and cd. Every degree is 1, but the graph is disconnected. Deleting any vertex, say d, leaves c isolated, which is exactly where the real reduction breaks.",
      },
    ],
    tags: ["flawed induction", "build-up", "graphs"],
  },
  {
    id: "XI10",
    topic: "induction",
    kind: "compute",
    difficulty: 1,
    title: "Generalized pigeonhole warm-ups",
    prompt:
      "(a) How many students must be in a class to guarantee that at least 4 share a birth month?\n(b) A drawer has 10 red, 10 blue, and 10 green socks. How many must you pull out in the dark to guarantee 3 of the same colour?\n(c) A club has 40 members. What is the largest k such that some month must contain at least k of their birthdays?",
    hints: [
      "Generalized pigeonhole: N objects in m boxes force some box to have at least ⌈N/m⌉.",
      "For a minimum, show one fewer can fail by spreading objects as evenly as possible.",
    ],
    solutions: [
      {
        approach: "⌈N/m⌉ and extremal examples",
        text:
          "(a) 37. With 37 = 3·12 + 1 students in 12 months, some month has ⌈37/12⌉ = 4. With 36, three per month avoids 4, so 36 is not enough.\n(b) 7. Seven socks in 3 colours give some colour ⌈7/3⌉ = 3. Six socks can be 2 of each colour.\n(c) k = 4. Some month has ⌈40/12⌉ = 4. And 4 is the best guarantee: put 4 birthdays in each of 4 months and 3 in each of the other 8 (16 + 24 = 40), so no month has 5.",
      },
    ],
    tags: ["pigeonhole", "generalized"],
  },
  {
    id: "XI11",
    topic: "induction",
    kind: "proof",
    difficulty: 2,
    title: "A block whose sum is divisible by n",
    prompt:
      "Let a_1, a_2, …, a_n be any n integers (n ≥ 1). Prove that some nonempty block of consecutive terms a_i + a_{i+1} + … + a_j has a sum divisible by n.",
    hints: [
      "Look at prefix sums s_0 = 0, s_1 = a_1, s_2 = a_1 + a_2, …, s_n.",
      "There are n + 1 prefix sums and only n remainders mod n.",
      "If s_i ≡ s_j (mod n) with i < j, what is s_j − s_i?",
    ],
    solutions: [
      {
        approach: "Pigeonhole on prefix sums including 0",
        text:
          "Let s_0 = 0 and s_k = a_1 + … + a_k for 1 ≤ k ≤ n. These are n + 1 integers, and there are only n remainders mod n. By pigeonhole two have the same remainder: s_i ≡ s_j (mod n) with 0 ≤ i < j ≤ n. Then s_j − s_i = a_{i+1} + … + a_j is divisible by n, and the block is nonempty since i < j.",
      },
      {
        approach: "Two cases",
        text:
          "Consider s_1, …, s_n only. If some s_j ≡ 0 (mod n), the block a_1, …, a_j works. Otherwise the n sums take remainders in {1, …, n − 1}, which has n − 1 values, so two coincide: s_i ≡ s_j with i < j, and a_{i+1} + … + a_j ≡ 0 (mod n).",
      },
    ],
    tags: ["pigeonhole", "remainders", "prefix sums"],
  },
  {
    id: "XI12",
    topic: "induction",
    kind: "short",
    difficulty: 2,
    title: "Five points in a triangle",
    prompt:
      "Five points are placed inside or on an equilateral triangle with side length 2. Prove that some two of them are at distance at most 1.",
    hints: [
      "Cut the triangle into 4 pieces of diameter 1.",
      "Join the midpoints of the three sides.",
    ],
    solutions: [
      {
        approach: "Pigeonhole on four small triangles",
        text:
          "Join the midpoints of the sides. This cuts the triangle into 4 equilateral triangles of side 1, which together cover the big one (including boundaries). Five points in 4 regions: two points lie in the same small triangle (closed, so boundary points can be assigned to any triangle containing them). The farthest apart two points of a triangle can be is its longest side, here 1. So those two points are at distance ≤ 1.",
      },
    ],
    tags: ["pigeonhole", "geometry"],
  },
  {
    id: "XI13",
    topic: "induction",
    kind: "proof",
    difficulty: 2,
    title: "Two guests with the same number of friends",
    prompt:
      "At a party with n ≥ 2 people, friendship is mutual and nobody is their own friend. Prove that two people have the same number of friends at the party.",
    hints: [
      "Each person has between 0 and n − 1 friends: n possible values for n people. Not quite enough for pigeonhole.",
      "Can someone have 0 friends while someone else has n − 1?",
    ],
    solutions: [
      {
        approach: "Pigeonhole with an impossible pair",
        text:
          "Each person's friend count lies in {0, 1, …, n − 1}. The values 0 and n − 1 cannot both occur: a person with n − 1 friends is friends with everyone, including anyone who supposedly has 0 friends. So the n counts take values in a set of at most n − 1 numbers (either {0, …, n − 2} or {1, …, n − 1}). By pigeonhole two people share a count.",
      },
      {
        approach: "Graph language",
        text:
          "Model the party as a simple graph on n vertices; friend counts are degrees. If all degrees were distinct they would be exactly 0, 1, …, n − 1. The vertex of degree n − 1 is adjacent to every other vertex, including the vertex of degree 0. Contradiction, so two degrees are equal.",
      },
    ],
    tags: ["pigeonhole", "degrees"],
  },
  {
    id: "XI14",
    topic: "induction",
    kind: "proof",
    difficulty: 3,
    title: "Three friends or four strangers among ten",
    prompt:
      "Among any 10 people, prove that there are 3 mutual friends or 4 mutual strangers. You may use the fact that among any 6 people there are 3 mutual friends or 3 mutual strangers.",
    hints: [
      "Fix one person v. The other 9 split into v's friends and v's strangers.",
      "Either v has at least 4 friends or at least 6 strangers.",
      "If v has 4 friends, look at whether any two of them are friends. If v has 6 strangers, apply the six-person fact to them.",
    ],
    solutions: [
      {
        approach: "Split around one person",
        text:
          "Fix v. The other 9 people are friends or strangers with v. If v had at most 3 friends and at most 5 strangers, that would account for at most 8 people, so v has ≥ 4 friends or ≥ 6 strangers.\nCase 1: v has 4 friends A. If two people in A are friends, they and v are 3 mutual friends. Otherwise the 4 people of A are mutual strangers.\nCase 2: v has 6 strangers B. By the six-person fact, B contains 3 mutual friends (done) or 3 mutual strangers; in the latter case, those 3 plus v are 4 mutual strangers, since v is a stranger to everyone in B.\nIn every case we find 3 mutual friends or 4 mutual strangers.",
      },
    ],
    tags: ["Ramsey", "pigeonhole", "friends or strangers"],
  },
  {
    id: "XI15",
    topic: "induction",
    kind: "proof",
    difficulty: 3,
    title: "One divides another",
    prompt:
      "Let n ≥ 1. Prove that among any n + 1 numbers chosen from {1, 2, …, 2n}, one of them divides another. Then show n numbers are not enough.",
    hints: [
      "Write each number as 2^k·m with m odd.",
      "How many possible odd parts m are there in {1, …, 2n}?",
      "For the sharpness, try the top half {n + 1, …, 2n}.",
    ],
    solutions: [
      {
        approach: "Pigeonhole on odd parts",
        text:
          "Every positive integer x can be written uniquely as x = 2^k·m with k ≥ 0 and m odd. For x ≤ 2n, the odd part m is one of 1, 3, 5, …, 2n − 1: only n values.\nWith n + 1 chosen numbers, pigeonhole gives two distinct numbers x = 2^a·m and y = 2^b·m with the same odd part. They are distinct, so a ≠ b; say a < b. Then y / x = 2^{b−a} is an integer, so x divides y.\nSharpness: choose {n + 1, n + 2, …, 2n}, which is n numbers. If x < y are both in it and x | y, then y = cx with c ≥ 2, so y ≥ 2x ≥ 2n + 2 > 2n, impossible. No one divides another.",
      },
      {
        approach: "Induction on n",
        text:
          "Base n = 1: the 2 numbers chosen from {1, 2} are 1 and 2, and 1 | 2.\nStep: assume the claim for n, and let A be n + 2 numbers from {1, …, 2n + 2}. If at most one of 2n + 1, 2n + 2 is in A, then at least n + 1 elements of A lie in {1, …, 2n}, and we are done by hypothesis. So suppose both 2n + 1 and 2n + 2 are in A, and let A′ = A ∩ {1, …, 2n}, with |A′| = n.\nIf n + 1 ∈ A, then (n + 1) | (2n + 2), done. Otherwise A′ ∪ {n + 1} is n + 1 numbers in {1, …, 2n}, so by hypothesis one divides another. If that pair lies inside A′, done. Otherwise the pair involves n + 1: either n + 1 divides some a ∈ A′ (impossible, since a ≤ 2n < 2n + 2 forces a = n + 1 ∉ A′), or some a ∈ A′ divides n + 1, and then a divides 2n + 2 ∈ A. Done.",
      },
    ],
    tags: ["pigeonhole", "divisibility", "strong induction"],
  },
];
