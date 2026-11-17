// Extra original practice problems: matchings, augmenting paths, Hall's theorem.
// Same schema as lib/questions.js. Numeric claims checked by brute force.

export const BANK_MATCHINGS = [
  {
    id: "XM01",
    topic: "matchings",
    kind: "compute",
    difficulty: 1,
    title: "Smallest maximal matching on a path",
    prompt:
      "Let P_7 be the path v_1 – v_2 – … – v_7.\n(a) What is the size of a maximum matching in P_7?\n(b) What is the smallest possible size of a maximal matching in P_7? Give one and justify that it is maximal.\n(c) For every k ≥ 1, give a graph with a maximal matching of size k and a maximum matching of size 2k.",
    hints: [
      "A matching uses disjoint pairs of vertices, so 7 vertices allow at most ⌊7/2⌋ edges.",
      "For (b), choose edges whose endpoints block every other edge. Try edges that sit one step in from each end.",
      "For (c), start from the path on 4 vertices and take k disjoint copies.",
    ],
    solutions: [
      {
        approach: "Direct construction",
        text:
          "(a) {v_1v_2, v_3v_4, v_5v_6} is a matching of size 3. A matching covers 2 vertices per edge, so with 7 vertices it has at most ⌊7/2⌋ = 3 edges. Maximum = 3.\n(b) M = {v_2v_3, v_5v_6}. Check each other edge: v_1v_2 shares v_2, v_3v_4 shares v_3, v_4v_5 shares v_5, v_6v_7 shares v_6. So no edge can be added, and M is maximal with size 2.\nSize 1 is impossible: a single edge v_iv_{i+1} covers 2 vertices, and the path has 6 edges, while one edge blocks at most itself plus its 2 neighbours, which is 3 edges. So some edge stays addable. Smallest maximal size = 2.\n(c) Take k disjoint copies of P_4, a_i – b_i – c_i – d_i. The middle edges {b_ic_i} form a maximal matching (each outer edge shares b_i or c_i) of size k. The outer edges {a_ib_i, c_id_i} form a matching of size 2k, which is maximum since there are 4k vertices.",
      },
      {
        approach: "Why 2k is the limit",
        text:
          "Part (c) is tight against the factor-2 bound. If M is maximal, the 2|M| vertices it covers touch every edge (otherwise an edge could be added). Every edge of a maximum matching M* contains one of these vertices, and distinct M*-edges are disjoint, so they use distinct covered vertices. Hence |M*| ≤ 2|M|. The P_4 copies achieve equality, so the bound cannot be improved.",
      },
    ],
    tags: ["maximal", "maximum", "factor 2"],
  },
  {
    id: "XM02",
    topic: "matchings",
    kind: "compute",
    difficulty: 1,
    title: "Follow the augmenting path",
    prompt:
      "Bipartite graph with X = {a, b, c, d} and Y = {1, 2, 3, 4}. Edges: a1, a4, b1, b2, c2, c3, d3.\nLet M = {a1, b2, c3}.\n(a) Show that M is maximal.\n(b) Find an M-augmenting path and use it to build a larger matching.\n(c) Is the new matching maximum? Why?",
    hints: [
      "The unmatched vertices are d and 4. An augmenting path must run from one to the other.",
      "From d the only edge goes to 3. Then you are forced to follow the M-edge at 3, and so on, alternating.",
    ],
    solutions: [
      {
        approach: "Trace from the free vertex",
        text:
          "(a) The only unmatched vertices are d and 4, and d4 is not an edge. Any other edge has a matched endpoint, so nothing can be added. M is maximal.\n(b) Alternate non-M and M edges starting from d:\nd – 3 (not in M), 3 – c (in M), c – 2 (not in M), 2 – b (in M), b – 1 (not in M), 1 – a (in M), a – 4 (not in M).\nBoth ends d and 4 are unmatched, so this is an augmenting path of length 7. Flip it: remove c3, b2, a1 and add d3, c2, b1, a4. New matching M′ = {a4, b1, c2, d3}, of size 4.\n(c) Yes. M′ covers all 8 vertices, so it is perfect, and no matching can be larger than |X| = 4.",
      },
      {
        approach: "Berge's theorem view",
        text:
          "Since M is maximal but the graph has 4 + 4 vertices, ask whether M is maximum. By Berge, M is maximum iff there is no M-augmenting path. The search from d is forced at every step (d has degree 1, each M-edge is determined, and b, c, a each have exactly one non-M edge left), giving d3c2b1a4. Its existence proves M was not maximum. After flipping, M′ is perfect, so there are no unmatched vertices at all and no augmenting path can exist. M′ is maximum.",
      },
    ],
    tags: ["augmenting", "Berge"],
  },
  {
    id: "XM03",
    topic: "matchings",
    kind: "short",
    difficulty: 1,
    title: "Grids, cubes, and a cut-up board",
    prompt:
      "For each graph, say whether it has a perfect matching and justify in a line or two.\n(a) The 3 × 5 grid graph (15 vertices, edges between horizontally or vertically adjacent cells).\n(b) The 4 × 5 grid graph.\n(c) The cube graph Q_3 (vertices are 3-bit strings, edges join strings differing in one bit).\n(d) The 8 × 8 grid graph with two opposite corner cells deleted.",
    hints: [
      "A perfect matching needs an even number of vertices.",
      "For (c), match each string to the string that differs in the first bit.",
      "For (d), colour the cells like a chessboard. Every edge joins two colours.",
    ],
    solutions: [
      {
        approach: "Parity and colouring",
        text:
          "(a) No. 15 vertices is odd, and a perfect matching covers vertices in pairs.\n(b) Yes. Each column has 4 cells; match rows 1–2 and rows 3–4 within every column. That gives 10 disjoint vertical edges covering all 20 vertices.\n(c) Yes. Match x_1x_2x_3 with (1−x_1)x_2x_3. These 4 edges are disjoint and cover all 8 vertices.\n(d) No. Colour the board black and white so adjacent cells differ. Opposite corners have the same colour, so after deleting them there are 32 cells of one colour and 30 of the other. Every matching edge uses one black and one white cell, so a perfect matching would need equal counts.",
      },
    ],
    tags: ["perfect matching", "grid", "cube", "parity"],
  },
  {
    id: "XM04",
    topic: "matchings",
    kind: "flaw",
    difficulty: 1,
    title: "Greedy is always optimal?",
    prompt:
      "Claim: if you build a matching greedily (keep adding any edge whose endpoints are both free until none is left), the result is a maximum matching.\n\"Proof\": The greedy result M is maximal. Suppose M is not maximum. By Berge's theorem there is an M-augmenting path P. The endpoints of P are both unmatched by M, and P starts with a non-M edge. So the first edge of P joins two unmatched vertices and could have been added to M, contradicting maximality.\nFind the flaw, and give a counterexample to the claim.",
    hints: [
      "Does the first edge of P really join two unmatched vertices?",
      "An augmenting path can have length 3, 5, 7, …",
    ],
    solutions: [
      {
        approach: "Locate the bad step",
        text:
          "The flaw is the sentence \"the first edge of P joins two unmatched vertices\". Only the two endpoints of P are unmatched. The first edge goes from an unmatched endpoint to a vertex that is usually matched (it is followed by an M-edge). That is only false when P has length 1. Maximality rules out augmenting paths of length 1, but says nothing about length 3 or more.\nCounterexample: path a – b – c – d. Greedy may pick bc first; then ab and cd are blocked, so M = {bc} is maximal. But {ab, cd} has size 2. The augmenting path a – b – c – d has length 3, and its first edge ab has b matched.",
      },
    ],
    tags: ["greedy", "maximal", "augmenting"],
  },
  {
    id: "XM05",
    topic: "matchings",
    kind: "proof",
    difficulty: 3,
    title: "What two matchings look like together",
    prompt:
      "Let M and M′ be matchings in a graph G, and let H be the graph on V(G) whose edge set is the symmetric difference M ⊕ M′ (edges in exactly one of them).\n(a) Prove every component of H is a path or a cycle, and every cycle has even length.\n(b) Prove that if |M′| > |M|, then H contains a path component that is M-augmenting.",
    hints: [
      "How many M-edges and how many M′-edges can touch one vertex?",
      "Along any path or cycle in H, edges alternate between M and M′.",
      "For (b), count M′-edges minus M-edges in each component. Which component types can contribute +1?",
    ],
    solutions: [
      {
        approach: "Degree bound and alternation",
        text:
          "(a) A vertex lies on at most one M-edge and at most one M′-edge, so its degree in H is at most 2. A graph with maximum degree ≤ 2 has components that are paths (possibly single vertices) or cycles. At a degree-2 vertex the two H-edges cannot both come from M (M is a matching) nor both from M′. So edges alternate M, M′, M, M′, … along every path and cycle. A cycle that alternates must have as many M-edges as M′-edges, so its length is even.\n(b) Since each edge of H is in exactly one of M, M′, and the edges of M ∩ M′ are counted in both sizes, |M′| − |M| = |M′ ∖ M| − |M ∖ M′| = Σ over components C of (number of M′-edges in C − number of M-edges in C).\nEven cycles contribute 0. An alternating path contributes −1, 0, or +1. The total is positive, so some path P contributes +1: it starts and ends with M′-edges. Each endpoint of P has H-degree 1, and its edge there is in M′. If that endpoint were covered by an M-edge e, then e ∉ M′ (the endpoint already has its M′-edge), so e ∈ H and the endpoint would have H-degree 2. So both endpoints are M-unmatched, and P alternates non-M, M, …, non-M: it is M-augmenting.",
      },
    ],
    tags: ["symmetric difference", "augmenting", "Berge"],
  },
  {
    id: "XM06",
    topic: "matchings",
    kind: "short",
    difficulty: 2,
    title: "Certify a maximum matching",
    prompt:
      "G has vertices a, b, c, d, e, f, g and edges ab, ac, ad, ae, bc, cg, fg, fd. (G is not bipartite: abc is a triangle.)\nLet M = {ad, bc, fg}.\n(a) Prove that M is a maximum matching without listing all matchings.\n(b) Does G have a matching that covers e? If yes, give a maximum one that does.",
    hints: [
      "Find a small set of vertices that touches every edge.",
      "If every edge contains one of k chosen vertices, how many disjoint edges can there be?",
    ],
    solutions: [
      {
        approach: "Vertex cover certificate",
        text:
          "(a) Let C = {a, c, f}. Every edge contains a vertex of C: ab, ac, ad, ae contain a; bc, cg contain c; fg, fd contain f.\nIn any matching, each edge contains some vertex of C, and different matching edges are disjoint, so they use different vertices of C. Hence every matching has at most |C| = 3 edges. M has 3 edges, so M is maximum.\n(b) Yes. Since e has only the neighbour a, use ae. Then {ae, bc, fg} is a matching of size 3, so it is maximum and covers e. (d is left uncovered instead.)",
      },
      {
        approach: "No augmenting path",
        text:
          "(a) The vertices unmatched by M are e only (7 vertices, 3 edges cover 6). An augmenting path needs two unmatched endpoints, but there is only one unmatched vertex. So no M-augmenting path exists, and by Berge M is maximum.\n(b) Swap along the alternating path e – a – d: remove ad, add ae. This keeps the size at 3 and now covers e.",
      },
    ],
    tags: ["certificate", "vertex cover", "Berge"],
  },
  {
    id: "XM07",
    topic: "matchings",
    kind: "proof",
    difficulty: 2,
    title: "Regular bipartite graphs are perfect",
    prompt:
      "Let G be a bipartite graph with parts X and Y in which every vertex has degree k, for some k ≥ 1. Prove that G has a perfect matching.",
    hints: [
      "First show |X| = |Y| by counting edges from each side.",
      "For S ⊆ X, count the edges leaving S. Where do they all land?",
      "Each vertex of N(S) can absorb at most k of those edges.",
    ],
    solutions: [
      {
        approach: "Hall's condition by edge counting",
        text:
          "Every edge has one end in X and one in Y, so the number of edges is k|X| = k|Y|. Since k ≥ 1, |X| = |Y|. So a matching saturating X is perfect.\nCheck Hall's condition. Fix S ⊆ X and let E_S be the set of edges with an endpoint in S. Then |E_S| = k|S|, since the vertices of S have degree k and no edge joins two vertices of S. Every edge in E_S ends in N(S). Each vertex of N(S) has degree k, so at most k|N(S)| edges end in N(S). Therefore k|S| ≤ k|N(S)|, so |N(S)| ≥ |S|.\nBy Hall's theorem there is a matching saturating X, and since |X| = |Y| it is perfect.\nBonus: removing that perfect matching leaves a (k−1)-regular bipartite graph, so repeating shows the edges split into k disjoint perfect matchings.",
      },
    ],
    tags: ["Hall", "regular", "double counting"],
  },
  {
    id: "XM08",
    topic: "matchings",
    kind: "proof",
    difficulty: 2,
    title: "One card from every pile",
    prompt:
      "A standard 52-card deck (13 ranks, 4 suits) is dealt into 13 piles of 4 cards each, arbitrarily. Prove that you can choose exactly one card from each pile so that the 13 chosen cards have 13 different ranks.",
    hints: [
      "Make a bipartite graph: piles on one side, ranks on the other.",
      "Take any set S of piles. How many cards are in S, and how many cards of each rank exist?",
      "Hall's theorem gives a system of distinct representatives.",
    ],
    solutions: [
      {
        approach: "Hall's theorem",
        text:
          "Let X be the 13 piles and Y the 13 ranks. Join pile p to rank r if p contains a card of rank r. A matching saturating X picks, for each pile, a rank that appears in it, with all ranks different; choose a card of that rank from the pile. So it suffices to check Hall.\nTake S ⊆ X. The piles in S hold 4|S| cards. Every rank has only 4 cards in the deck, so these 4|S| cards involve at least 4|S| / 4 = |S| different ranks. Those ranks are exactly N(S), so |N(S)| ≥ |S|.\nHall holds, so a matching saturating all 13 piles exists, and since |Y| = 13 it uses all 13 ranks.",
      },
      {
        approach: "Regular multigraph",
        text:
          "Draw one edge for each card, from its pile to its rank (allowing parallel edges). Every pile has degree 4 and every rank has degree 4, so this bipartite multigraph is 4-regular. The edge-counting proof that regular bipartite graphs satisfy Hall works the same with parallel edges: S sends 4|S| edges into N(S), which can receive at most 4|N(S)|. So a perfect matching exists, and each matching edge is a card: one per pile, one per rank.",
      },
    ],
    tags: ["Hall", "SDR", "regular"],
  },
  {
    id: "XM09",
    topic: "matchings",
    kind: "compute",
    difficulty: 2,
    title: "Find the Hall violator",
    prompt:
      "Bipartite graph with X = {x_1, …, x_6}, Y = {y_1, …, y_6}. Neighbourhoods:\nN(x_1) = {y_1, y_2}, N(x_2) = {y_2, y_3}, N(x_3) = {y_1, y_3}, N(x_4) = {y_1, y_2, y_3}, N(x_5) = {y_4, y_5, y_6}, N(x_6) = {y_3, y_5}.\n(a) Show there is no perfect matching by exhibiting S ⊆ X with |N(S)| < |S|.\n(b) Find the size of a maximum matching, with proof.",
    hints: [
      "Look for several x's that all point into the same small set of y's.",
      "x_1, x_2, x_3, x_4 only ever see y_1, y_2, y_3.",
      "For (b), the violator shows at least one vertex of S must stay unmatched.",
    ],
    solutions: [
      {
        approach: "Violator, then matching",
        text:
          "(a) S = {x_1, x_2, x_3, x_4} has N(S) = {y_1, y_2, y_3}, so |N(S)| = 3 < 4 = |S|. By Hall there is no matching saturating X, so no perfect matching.\n(b) Any matching uses at most 3 edges with an endpoint in S (each goes to a distinct vertex of {y_1, y_2, y_3}), plus at most 2 edges at x_5, x_6. So every matching has size ≤ 5.\nMatching of size 5: x_1y_1, x_2y_2, x_3y_3, x_5y_4, x_6y_5. Maximum = 5.",
      },
      {
        approach: "Deficiency count",
        text:
          "(b) The deficiency of S is |S| − |N(S)| = 1, so at least one vertex of X is unmatched in any matching: size ≤ 6 − 1 = 5. (One can check no set has deficiency 2; for instance adding x_6 to S also adds y_5.) The explicit matching x_1y_1, x_2y_2, x_3y_3, x_5y_4, x_6y_5 shows 5 is reached.",
      },
    ],
    tags: ["Hall", "violator", "maximum"],
  },
  {
    id: "XM10",
    topic: "matchings",
    kind: "compute",
    difficulty: 2,
    title: "Office hours for five TAs",
    prompt:
      "Five TAs each must hold office hours on a different weekday (Mon–Fri). Availability:\nAna: Mon, Tue. Ben: Mon, Wed. Cal: Tue, Wed, Thu. Dee: Thu, Fri. Eli: Mon, Fri.\n(a) Find a valid schedule.\n(b) Next week Cal can no longer do Thursday and Eli can only do Monday. Prove that no valid schedule exists, and say how many TAs can be scheduled at most.",
    hints: [
      "Model as a bipartite graph TAs vs. days and look for a perfect matching.",
      "For (b), find a group of TAs whose combined availability is too small.",
      "Ana, Ben, Cal, and Eli now only use Mon, Tue, Wed.",
    ],
    solutions: [
      {
        approach: "Matching and Hall violator",
        text:
          "(a) Ana–Tue, Ben–Wed, Cal–Thu, Dee–Fri, Eli–Mon. Each TA gets an available day, all days distinct. (Other schedules exist, for example Ana–Mon, Ben–Wed, Cal–Tue, Dee–Thu, Eli–Fri.)\n(b) Now S = {Ana, Ben, Cal, Eli} has N(S) = {Mon, Tue, Wed}, so |N(S)| = 3 < 4. By Hall's theorem no matching saturates all TAs, so no valid schedule exists.\nAt most 4 TAs: at most 3 of S can be scheduled (distinct days among 3), plus Dee. Four is achievable: Ana–Tue, Ben–Wed, Eli–Mon, Dee–Thu.",
      },
      {
        approach: "Forced choices",
        text:
          "(b) Eli must take Monday. Then Ana must take Tuesday and Ben must take Wednesday. Cal is available only on Tuesday and Wednesday, both taken. Any schedule fails, so none exists. Dropping Cal leaves the 4-TA schedule above.",
      },
    ],
    tags: ["Hall", "scheduling", "word problem"],
  },
  {
    id: "XM11",
    topic: "matchings",
    kind: "proof",
    difficulty: 2,
    title: "A tree has at most one perfect matching",
    prompt:
      "Prove that every tree has at most one perfect matching.",
    hints: [
      "In a perfect matching, what must a leaf be matched to?",
      "Delete a leaf and its neighbour. What is left, and can you induct on it?",
      "Alternatively: what would the symmetric difference of two different perfect matchings contain?",
    ],
    solutions: [
      {
        approach: "Strong induction on n via leaves",
        text:
          "Induct on the number of vertices n; the statement for forests (each component a tree) follows too, and we prove it for forests. For n ≤ 2 it is clear (n = 0: only the empty matching; n = 1: none; n = 2: the single edge, if present).\nLet F be a forest with n ≥ 3 vertices and suppose it has a perfect matching M. If F has an isolated vertex, there is no perfect matching, done. Otherwise some component is a tree with ≥ 2 vertices, so it has a leaf ℓ with unique neighbour u. Any perfect matching must cover ℓ, and the only edge at ℓ is ℓu, so every perfect matching contains ℓu. Removing ℓu, the rest of the matching is a perfect matching of F − ℓ − u, which is a forest with n − 2 vertices. By induction F − ℓ − u has at most one perfect matching. So F has at most one perfect matching: ℓu plus that unique one.",
      },
      {
        approach: "Symmetric difference",
        text:
          "Suppose M_1 ≠ M_2 are perfect matchings of a tree T. In M_1 ⊕ M_2 every vertex has degree 0 or 2: a vertex is covered by exactly one edge of each, and it has degree 2 exactly when those edges differ. M_1 ⊕ M_2 is nonempty since M_1 ≠ M_2, so it has a component in which all degrees are 2, which contains a cycle. But T has no cycles. Contradiction, so T has at most one perfect matching.",
      },
    ],
    tags: ["trees", "perfect matching", "uniqueness"],
  },
  {
    id: "XM12",
    topic: "matchings",
    kind: "compute",
    difficulty: 2,
    title: "Perfect matchings of a ladder",
    prompt:
      "Let L_n be the 2 × n grid graph (a ladder with n rungs, 2n vertices). Let p_n be the number of perfect matchings of L_n.\n(a) Show p_1 = 1, p_2 = 2, and p_n = p_{n−1} + p_{n−2} for n ≥ 3.\n(b) Compute p_6.",
    hints: [
      "Look at the two vertices in the leftmost column. How can the top-left vertex be matched?",
      "If the top-left is matched horizontally, the bottom-left is forced to be matched horizontally too.",
    ],
    solutions: [
      {
        approach: "Case on the left column",
        text:
          "(a) L_1 is a single edge: p_1 = 1. L_2 is a 4-cycle: two vertical rungs or two horizontal edges, p_2 = 2.\nFor n ≥ 3, consider the top-left vertex t_1 (neighbours: bottom-left b_1 and t_2).\nCase 1: t_1b_1 is in the matching. The rest is a perfect matching of the remaining ladder L_{n−1}: p_{n−1} ways.\nCase 2: t_1t_2 is in the matching. Then b_1 has neighbours t_1 (taken) and b_2, so b_1b_2 is forced. The rest is a perfect matching of L_{n−2}: p_{n−2} ways.\nThe cases are disjoint and exhaustive, so p_n = p_{n−1} + p_{n−2}.\n(b) p_1 = 1, p_2 = 2, p_3 = 3, p_4 = 5, p_5 = 8, p_6 = 13.",
      },
      {
        approach: "Count by number of horizontal pairs",
        text:
          "(b) A perfect matching of L_n is a sequence of vertical rungs (width 1) and stacked horizontal pairs (width 2) filling width n. For n = 6, with j horizontal pairs there are 6 − 2j rungs and C(6 − j, j) orders:\nj = 0: C(6,0) = 1; j = 1: C(5,1) = 5; j = 2: C(4,2) = 6; j = 3: C(3,3) = 1.\nTotal 1 + 5 + 6 + 1 = 13, matching the recurrence.",
      },
    ],
    tags: ["perfect matching", "recurrence", "grid"],
  },
  {
    id: "XM13",
    topic: "matchings",
    kind: "flaw",
    difficulty: 2,
    title: "Connected and even is enough?",
    prompt:
      "Claim: every connected graph with an even number of vertices has a perfect matching.\n\"Proof\": Induction on the even number n. Base n = 2: a connected graph on 2 vertices is a single edge, which is a perfect matching. Step: let G be connected with n + 2 vertices. Pick any edge uv. G − u − v has n vertices, so by the induction hypothesis it has a perfect matching M. Then M ∪ {uv} is a perfect matching of G.\nFind the flaw and give a counterexample.",
    hints: [
      "Check exactly what the induction hypothesis requires of G − u − v.",
      "Try the star with one centre and three leaves.",
    ],
    solutions: [
      {
        approach: "Hypothesis not satisfied",
        text:
          "The induction hypothesis only applies to connected graphs, but G − u − v need not be connected. Deleting two vertices can split the graph, and then the hypothesis says nothing.\nCounterexample: the star K_{1,3} with centre c and leaves x, y, z. It is connected with 4 vertices. Every edge uses c, so any matching has at most 1 edge and cannot cover 4 vertices. In the \"proof\", choosing uv = cx leaves G − c − x = two isolated vertices y, z, which is disconnected (and has no perfect matching).",
      },
    ],
    tags: ["flawed induction", "perfect matching"],
  },
  {
    id: "XM14",
    topic: "matchings",
    kind: "proof",
    difficulty: 3,
    title: "The deficiency formula",
    prompt:
      "Let G be bipartite with parts X and Y. Define the deficiency d = max over S ⊆ X of (|S| − |N(S)|). (S = ∅ is allowed, so d ≥ 0.)\nProve that the maximum matching in G has size exactly |X| − d. You may use Hall's theorem.",
    hints: [
      "Upper bound: fix S achieving d. How many vertices of S can any matching cover?",
      "Lower bound: add d new vertices to Y, each joined to every vertex of X. Check Hall in the new graph.",
      "A matching saturating X in the new graph uses at most d of the new vertices.",
    ],
    solutions: [
      {
        approach: "Upper bound plus dummy vertices",
        text:
          "Upper bound. Take S ⊆ X with |S| − |N(S)| = d. In any matching, each matched vertex of S is matched to a distinct vertex of N(S), so at most |N(S)| vertices of S are matched, and at least |S| − |N(S)| = d vertices of X are unmatched. So every matching has size ≤ |X| − d.\nLower bound. Build G′ by adding d new vertices z_1, …, z_d to Y, each adjacent to every vertex of X. For nonempty S ⊆ X, N_{G′}(S) = N_G(S) ∪ {z_1, …, z_d}, so |N_{G′}(S)| = |N_G(S)| + d ≥ |N_G(S)| + (|S| − |N_G(S)|) = |S|, using the definition of d. (For S = ∅ the condition is trivial.) By Hall, G′ has a matching M′ saturating X, with |M′| = |X|.\nAt most d edges of M′ use the new vertices. Deleting them leaves a matching of G with at least |X| − d edges.\nCombining, the maximum matching has size exactly |X| − d.",
      },
    ],
    tags: ["Hall", "deficiency", "König"],
  },
  {
    id: "XM15",
    topic: "matchings",
    kind: "proof",
    difficulty: 3,
    title: "Extending a Latin rectangle",
    prompt:
      "An r × n Latin rectangle (r < n) is an r × n array with entries from {1, …, n} such that each row contains every symbol exactly once and no symbol appears twice in a column. Prove that every r × n Latin rectangle with r < n can be extended by one row to an (r+1) × n Latin rectangle. (Conclude that repeating gives an n × n Latin square.)",
    hints: [
      "Build a bipartite graph: columns on one side, symbols on the other. Join column j to symbol s if s does not yet appear in column j.",
      "How many symbols are missing from each column?",
      "How many columns is each symbol missing from? Use that each symbol appears once in every row.",
    ],
    solutions: [
      {
        approach: "Regular bipartite graph",
        text:
          "Let X = columns {1, …, n}, Y = symbols {1, …, n}. Join column j to symbol s when s does not appear in column j.\nEach column contains r distinct symbols, so it is adjacent to exactly n − r symbols.\nEach symbol appears exactly once in each of the r rows, and these r appearances are in distinct columns (no repeats in a column). So each symbol appears in exactly r columns and is adjacent to n − r columns.\nThus the graph is (n − r)-regular bipartite with n − r ≥ 1. A k-regular bipartite graph with k ≥ 1 has a perfect matching (S sends k|S| edges into N(S), which absorbs at most k|N(S)|, so Hall holds). The perfect matching assigns each column j a symbol s_j missing from column j, with all s_j distinct.\nAdd the row (s_1, …, s_n): it uses every symbol once, and creates no repeat in any column. This gives an (r+1) × n Latin rectangle. Starting from any single row (a permutation) and repeating n − 1 times yields an n × n Latin square.",
      },
    ],
    tags: ["Hall", "regular", "Latin square"],
  },
];
