// Extra original practice problems: graphs (CIS 1600 Midterm 2 style).
// Same schema as lib/questions.js. All graphs are finite and simple unless stated.

export const BANK_GRAPHS = [
  {
    id: "XG01",
    topic: "graphs",
    kind: "short",
    difficulty: 1,
    title: "Nine people, three handshakes each",
    prompt:
      "At a meeting of 9 people, is it possible for every person to shake hands with exactly 3 others? What about exactly 4 others? Justify each answer.",
    hints: [
      "Model people as vertices and handshakes as edges. What does the degree sum have to be?",
      "For 4 handshakes, try placing the people around a circle.",
    ],
    solutions: [
      {
        approach: "Handshake lemma, then a construction",
        text:
          "Three each: impossible. The degree sum would be 9 · 3 = 27, but the degree sum of any graph equals 2|E|, which is even.\nFour each: possible. The degree sum is 36, giving 18 edges. Seat the people 0, 1, ..., 8 around a circle and let each person shake hands with the two people on each side: i is joined to i ± 1 and i ± 2 (mod 9). These four people are distinct because 9 > 4, so every vertex has degree exactly 4.",
      },
    ],
    tags: ["handshake", "parity", "construction"],
  },
  {
    id: "XG02",
    topic: "graphs",
    kind: "compute",
    difficulty: 1,
    title: "How many vertices?",
    prompt:
      "A graph has 21 edges. Exactly three of its vertices have degree 4 and every other vertex has degree 3. How many vertices does it have?",
    hints: [
      "Let k be the number of degree-3 vertices and write the degree sum two ways.",
      "One way is 3 · 4 + 3k; the other is 2 · 21.",
    ],
    solutions: [
      {
        approach: "Handshake lemma",
        text:
          "Let k be the number of degree-3 vertices. The degree sum is 3 · 4 + 3k = 12 + 3k, and it also equals 2 · 21 = 42.\nSo 3k = 30, k = 10, and the graph has 3 + 10 = 13 vertices.\n(Such a graph exists; the handshake count only tells us what n must be if it does.)",
      },
    ],
    tags: ["handshake", "degree sum"],
  },
  {
    id: "XG03",
    topic: "graphs",
    kind: "proof",
    difficulty: 1,
    title: "Every walk contains a path",
    prompt:
      "Let u ≠ v be vertices of a graph G. Prove that if there is a walk from u to v, then there is a path from u to v (a walk with no repeated vertex).",
    hints: [
      "Pick the shortest u–v walk. What happens if it repeats a vertex?",
      "If w_i = w_j with i < j, you can cut out the loop between them.",
    ],
    solutions: [
      {
        approach: "Shortest walk (extremal)",
        text:
          "Among all u–v walks choose one of minimum length: W = w_0 w_1 ... w_k with w_0 = u, w_k = v.\nSuppose W repeats a vertex: w_i = w_j for some i < j. Then w_0 ... w_i w_{j+1} ... w_k is still a u–v walk (w_i = w_j is adjacent to w_{j+1}), and it has length k − (j − i) < k. This contradicts minimality.\nSo W has no repeated vertex, meaning it is a path.",
      },
      {
        approach: "Strong induction on walk length",
        text:
          "Claim: every u–v walk of length k contains (uses only vertices and edges of) a u–v path. Strong induction on k.\nBase k = 1: the walk is a single edge uv, which is a path.\nStep: let W = w_0 ... w_k. If no vertex repeats, W is a path. Otherwise w_i = w_j for some i < j, and deleting w_{i+1}, ..., w_j gives a u–v walk of length k − (j − i) < k built from edges of W. By the induction hypothesis it contains a u–v path.",
      },
    ],
    tags: ["walks", "paths", "extremal"],
  },
  {
    id: "XG04",
    topic: "graphs",
    kind: "proof",
    difficulty: 2,
    title: "At least n − m components",
    prompt:
      "Prove that a graph with n vertices and m edges has at least n − m connected components.",
    hints: [
      "Induct on m. Start with no edges: how many components?",
      "Adding one edge can merge at most two components into one.",
      "Alternatively, a connected graph on k vertices has at least k − 1 edges. Apply that to each component.",
    ],
    solutions: [
      {
        approach: "Induction on edges",
        text:
          "Let c(G) be the number of components. Induct on m, for a fixed n.\nBase m = 0: every vertex is its own component, so c(G) = n = n − 0.\nStep: let G have m ≥ 1 edges and pick an edge e = uv. G − e has m − 1 edges, so by the induction hypothesis c(G − e) ≥ n − (m − 1).\nAdding e back changes components only if u and v were in different components of G − e; then exactly those two merge. Every other component is unchanged. So c(G) ≥ c(G − e) − 1 ≥ n − m + 1 − 1 = n − m.",
      },
      {
        approach: "Count edges per component",
        text:
          "Let the components be C_1, ..., C_c with n_1, ..., n_c vertices, so n_1 + ... + n_c = n.\nEach C_i is connected, so it contains a spanning tree, which has n_i − 1 edges. Therefore C_i has at least n_i − 1 edges.\nEdges lie inside components, so m ≥ Σ (n_i − 1) = n − c. Rearranging, c ≥ n − m.",
      },
    ],
    tags: ["components", "induction on edges"],
  },
  {
    id: "XG05",
    topic: "graphs",
    kind: "proof",
    difficulty: 3,
    title: "Two longest paths must meet",
    prompt:
      "Let G be a connected graph. Prove that any two longest paths in G share at least one vertex.",
    hints: [
      "Suppose two longest paths P and Q (each of length L) are vertex-disjoint. G is connected, so something joins them.",
      "Take a shortest path R from a vertex of P to a vertex of Q. Its inner vertices avoid P and Q.",
      "The point where R leaves P splits P into two pieces; one of them has length at least L/2. Same for Q.",
    ],
    solutions: [
      {
        approach: "Shortest connecting path plus halves",
        text:
          "Let P and Q be longest paths, both of length L (number of edges), and suppose they share no vertex.\nSince G is connected, there are paths from V(P) to V(Q). Choose one, R, of minimum length, from p ∈ V(P) to q ∈ V(Q). R has length ≥ 1 because p ≠ q. No inner vertex of R lies on P or Q: otherwise a proper sub-path of R would be a shorter connecting path.\nThe vertex p splits P into two sub-paths that both end at p, with lengths adding to L, so one of them, P', has length ≥ L/2. Likewise q splits Q, and one piece Q' starting at q has length ≥ L/2.\nNow follow P' to p, then R to q, then Q'. P' and Q' are disjoint (P and Q are), and R meets them only at p and q, so this is a path. Its length is at least L/2 + 1 + L/2 = L + 1 > L, contradicting that L is the longest path length.\nSo P and Q share a vertex.",
      },
    ],
    tags: ["longest path", "extremal", "connectivity"],
  },
  {
    id: "XG06",
    topic: "graphs",
    kind: "proof",
    difficulty: 2,
    title: "Minimum degree k forces a long cycle",
    prompt:
      "Let G be a graph with minimum degree δ(G) ≥ k, where k ≥ 2. Prove that G contains a cycle of length at least k + 1.",
    hints: [
      "Take a longest path P = v_0 v_1 ... v_L.",
      "Where can the neighbours of the endpoint v_0 be?",
      "v_0 has at least k neighbours, all on P. How far along P is the farthest one?",
    ],
    solutions: [
      {
        approach: "Longest path",
        text:
          "Let P = v_0 v_1 ... v_L be a longest path in G.\nEvery neighbour of v_0 lies on P: if v_0 had a neighbour w off P, then w v_0 v_1 ... v_L would be a longer path.\nSo v_0 has at least k neighbours among v_1, ..., v_L. These are k distinct indices from {1, ..., L}, so the largest one, j, satisfies j ≥ k.\nThen v_0 v_1 ... v_j v_0 is a cycle: the vertices are distinct, consecutive ones are adjacent, and v_j v_0 is an edge. Its length is j + 1 ≥ k + 1.",
      },
      {
        approach: "Maximal (non-extendable) path",
        text:
          "The same argument works with any path that cannot be extended at its first endpoint. Start from any vertex and keep extending a path backwards from its first vertex while that vertex has a neighbour off the path. This must stop because G is finite.\nAt that moment the first vertex v_0 has all of its ≥ k neighbours on the path v_0 ... v_L, so one of them is v_j with j ≥ k, and v_0 ... v_j v_0 is a cycle of length j + 1 ≥ k + 1.",
      },
    ],
    tags: ["longest path", "cycles", "minimum degree"],
  },
  {
    id: "XG07",
    topic: "graphs",
    kind: "proof",
    difficulty: 2,
    title: "High minimum degree means connected",
    prompt:
      "Let G be a graph on n vertices with minimum degree at least (n − 1)/2. Prove that G is connected. Then show the bound cannot be lowered to n/2 − 1 when n is even.",
    hints: [
      "Take two non-adjacent vertices u and v. Where can their neighbours live?",
      "Pigeonhole: N(u) and N(v) both sit inside the other n − 2 vertices.",
      "For the sharpness part, try two disjoint complete graphs.",
    ],
    solutions: [
      {
        approach: "Common neighbour by pigeonhole",
        text:
          "Take any two vertices u ≠ v. If they are adjacent they are connected. Otherwise N(u) and N(v) are both subsets of V ∖ {u, v}, which has n − 2 vertices.\n|N(u)| + |N(v)| ≥ (n − 1)/2 + (n − 1)/2 = n − 1 > n − 2, so N(u) and N(v) overlap. A common neighbour w gives the path u w v.\nEvery pair is connected, so G is connected.\nSharpness: for even n, two disjoint copies of K_{n/2} have minimum degree n/2 − 1 and are disconnected.",
      },
      {
        approach: "Component size",
        text:
          "Any component contains some vertex x together with all of x's neighbours, so it has at least 1 + (n − 1)/2 = (n + 1)/2 vertices.\nIf there were two components, they would hold at least (n + 1)/2 + (n + 1)/2 = n + 1 vertices in total, more than n. So there is only one component.\nSharpness: two disjoint copies of K_{n/2} (n even) have minimum degree n/2 − 1 and are disconnected.",
      },
    ],
    tags: ["connectivity", "pigeonhole", "minimum degree"],
  },
  {
    id: "XG08",
    topic: "graphs",
    kind: "compute",
    difficulty: 2,
    title: "Which degree sequences are graphic?",
    prompt:
      "For each sequence, either draw a simple graph with exactly these degrees or prove none exists.\n(a) 3, 3, 3, 1\n(b) 4, 3, 3, 3, 2, 2, 2\n(c) 5, 4, 3, 2, 1, 1\n(d) 3, 3, 2, 2, 2",
    hints: [
      "First check the parity of the degree sum.",
      "A vertex of degree n − 1 is adjacent to every other vertex. What does that force on the small degrees?",
      "In (c), the degree-5 vertex uses up both degree-1 vertices. Who can the degree-4 vertex still reach?",
    ],
    solutions: [
      {
        approach: "Parity and forced neighbours",
        text:
          "(a) Not graphic. With 4 vertices, a degree-3 vertex is adjacent to all others. All three degree-3 vertices would then be adjacent to the last vertex, giving it degree 3, not 1.\n(b) Not graphic. The degree sum is 4 + 3 + 3 + 3 + 2 + 2 + 2 = 19, which is odd, but every degree sum is 2|E|.\n(c) Not graphic. There are 6 vertices, so the degree-5 vertex a is adjacent to everyone, including both degree-1 vertices. Those two now have no degree left. The degree-4 vertex b needs 4 neighbours, but the only vertices it can still use are a, the degree-3 vertex and the degree-2 vertex: just 3. Contradiction.\n(d) Graphic. Label a, b (degree 3) and c, d, e (degree 2). Edges ab, ac, ad, bc, be, de.\nCheck: a ~ b, c, d (3); b ~ a, c, e (3); c ~ a, b (2); d ~ a, e (2); e ~ b, d (2).",
      },
      {
        approach: "Havel–Hakimi check",
        text:
          "Havel–Hakimi: delete the largest degree d and subtract 1 from the next d largest; the sequence is graphic iff the result is.\n(a) 3,3,3,1 → 2,2,0 → 1,−1: negative, not graphic.\n(b) odd sum, not graphic.\n(c) 5,4,3,2,1,1 → 3,2,1,0,0 → 1,0,−1,0: negative, not graphic.\n(d) 3,3,2,2,2 → 2,1,1,2, sorted 2,2,1,1 → 1,0,1, sorted 1,1,0 → 0,0: graphic.",
      },
    ],
    tags: ["degree sequence", "graphic", "handshake"],
  },
  {
    id: "XG09",
    topic: "graphs",
    kind: "proof",
    difficulty: 3,
    title: "Covering the edges with k trails",
    prompt:
      "Let G be a connected graph with exactly 2k vertices of odd degree, where k ≥ 1. Prove that the edges of G can be split into k trails, so that every edge lies in exactly one of them. Then explain why fewer than k trails cannot work.",
    hints: [
      "Reduce to the Eulerian circuit theorem by adding something that fixes the odd degrees.",
      "Add one new vertex x joined to all 2k odd vertices. What are the degrees now?",
      "An Eulerian circuit of the new graph passes through x exactly k times. Cut it there.",
    ],
    solutions: [
      {
        approach: "Add a vertex, take an Euler circuit, cut it",
        text:
          "Build G' from G by adding a new vertex x and an edge from x to each of the 2k odd-degree vertices.\nIn G', each formerly odd vertex gains 1 and becomes even, the other old vertices are unchanged and even, and deg(x) = 2k is even. G' is connected because G is. So G' has an Eulerian circuit C.\nC uses each of the 2k edges at x once, and each pass through x uses two of them, so C visits x exactly k times. Write C as a cyclic sequence and cut it at these k visits. This leaves k pieces, each of the form a ... b where x a and b x are edges of C.\nEach piece contains at least one edge of G: an empty piece would mean C goes x a x, using the single edge xa twice. Each piece uses only edges of G and repeats none (C repeats no edge), so it is a trail in G. Together the pieces use every edge of G exactly once.\nFewer trails are impossible: within a single trail, every vertex except possibly the two ends of an open trail is entered and left equally often, so it gets an even number of that trail's edges. A vertex that is odd in G must therefore be an end of some trail. Each trail has at most 2 ends, so at least 2k / 2 = k trails are needed.",
      },
    ],
    tags: ["Euler", "trails", "parity"],
  },
  {
    id: "XG10",
    topic: "graphs",
    kind: "short",
    difficulty: 1,
    title: "Eulerian complete graphs",
    prompt:
      "For which n ≥ 1 does the complete graph K_n have an Eulerian circuit? For which a, b ≥ 1 does the complete bipartite graph K_{a,b} have one? Justify.",
    hints: [
      "Both families are connected, so only degrees matter.",
      "In K_{a,b}, a vertex on the a-side has degree b.",
    ],
    solutions: [
      {
        approach: "Euler's criterion",
        text:
          "A connected graph has an Eulerian circuit iff every degree is even. Both families are connected.\nK_n: every vertex has degree n − 1, which is even iff n is odd. So K_n has an Eulerian circuit exactly when n is odd.\nK_{a,b}: vertices on one side have degree b and on the other side degree a. Both must be even, so K_{a,b} has an Eulerian circuit exactly when a and b are both even.",
      },
    ],
    tags: ["Euler", "complete graph", "bipartite"],
  },
  {
    id: "XG11",
    topic: "graphs",
    kind: "proof",
    difficulty: 2,
    title: "Cut edges are exactly the edges on no cycle",
    prompt:
      "Prove that an edge e = uv of a graph G is a cut edge (its removal increases the number of components) if and only if e lies on no cycle of G.",
    hints: [
      "Removing e can only split the component containing u and v. So e is a cut edge iff u and v are disconnected in G − e.",
      "If e is on a cycle, the rest of the cycle is a detour from u to v.",
      "If u and v are still connected in G − e, add e to that path.",
    ],
    solutions: [
      {
        approach: "Both directions via u–v paths",
        text:
          "First note: deleting e affects only the component containing u and v, and G − e has more components than G iff u and v lie in different components of G − e. (If u and v are still connected in G − e, any walk of G that used e can replace e by a u–v path in G − e, so nothing disconnects.)\n(⇐) Suppose e is on no cycle. If u and v were connected in G − e, take a u–v path P there. P avoids the edge uv, so it has length ≥ 2, and P followed by e is a cycle through e. Contradiction. So u and v are disconnected in G − e, and e is a cut edge.\n(⇒) Suppose e lies on a cycle C. Then C − e is a u–v path that does not use e, so u and v are connected in G − e and e is not a cut edge. By contrapositive, a cut edge lies on no cycle.",
      },
    ],
    tags: ["cut edge", "cycles", "iff"],
  },
  {
    id: "XG12",
    topic: "graphs",
    kind: "proof",
    difficulty: 3,
    title: "Ore-type condition for a Hamiltonian path",
    prompt:
      "Let G be a graph on n ≥ 2 vertices such that deg(x) + deg(y) ≥ n − 1 for every pair of non-adjacent vertices x, y. Prove that G has a Hamiltonian path. You may use Ore's theorem: a graph on N ≥ 3 vertices in which every non-adjacent pair has degree sum ≥ N has a Hamiltonian cycle.",
    hints: [
      "The condition is one short of Ore's. Add something to G to make up the difference.",
      "Add a new vertex z adjacent to every vertex of G.",
      "A Hamiltonian cycle through z, with z removed, is a Hamiltonian path of G.",
    ],
    solutions: [
      {
        approach: "Add a universal vertex and apply Ore",
        text:
          "Form G' by adding a new vertex z adjacent to all n vertices of G. G' has N = n + 1 ≥ 3 vertices.\nz is adjacent to everything, so any non-adjacent pair in G' is a pair x, y of G that is non-adjacent in G. In G' each gains the edge to z, so deg'(x) + deg'(y) = deg(x) + deg(y) + 2 ≥ (n − 1) + 2 = n + 1 = N.\nBy Ore's theorem G' has a Hamiltonian cycle. It passes through z exactly once, as ... a z b .... Deleting z leaves a path through all n vertices of G that uses only edges of G. That is a Hamiltonian path of G.",
      },
    ],
    tags: ["Hamiltonian", "Ore", "reduction"],
  },
  {
    id: "XG13",
    topic: "graphs",
    kind: "proof",
    difficulty: 3,
    title: "No odd cycle means bipartite",
    prompt:
      "Prove that if a graph G has no cycle of odd length, then G is bipartite.",
    hints: [
      "It is enough to 2-colour each component separately. Fix a root r in a component.",
      "Colour v by the parity of its distance d(v) from r. Suppose an edge xy has both ends the same colour.",
      "Either find an odd cycle from the two shortest paths r → x and r → y, or show that every odd closed walk contains an odd cycle.",
    ],
    solutions: [
      {
        approach: "Distance parity and shortest paths",
        text:
          "Work in one component with root r, and let d(v) be the distance from r. Put v in side A if d(v) is even and in side B if it is odd. We show every edge xy goes between A and B.\nFor an edge xy, |d(x) − d(y)| ≤ 1. Suppose d(x) and d(y) have the same parity; then d(x) = d(y) = t.\nLet P_x and P_y be shortest paths from r to x and to y. Along a shortest path from r, the vertex in position i is at distance exactly i from r.\nLet w be the last vertex of P_x that also lies on P_y (r qualifies, so w exists), and let s = d(w). w ≠ x: otherwise x would lie on P_y at position t, but position t of P_y is y ≠ x. Similarly, if y were on P_x it would be at position t, which is x. So w is neither x nor y, and s < t.\nThe part of P_x after w avoids P_y entirely, by the choice of w. So following P_x from w to x (length t − s), the edge xy, and P_y backwards from y to w (length t − s) gives a cycle of length 2(t − s) + 1 ≥ 3. It is odd, a contradiction.\nSo every edge joins A and B, and G is bipartite. Do this in every component.",
      },
      {
        approach: "Odd closed walks contain odd cycles",
        text:
          "Lemma: every closed walk of odd length contains an odd cycle. Strong induction on the length L. If the walk repeats no vertex except start = end, it is a cycle, and L ≥ 3 because L is odd and a simple graph has no closed walk of length 1. Otherwise some vertex appears twice inside, and splitting there gives two shorter closed walks whose lengths add to L. One of them is odd, and by induction it contains an odd cycle.\nNow colour each component by the parity of the distance from a root r, as in the first approach. If an edge xy joined two vertices of the same parity, then a shortest r–x path, the edge xy and a shortest y–r path form a closed walk of length d(x) + 1 + d(y), which is odd. By the lemma G has an odd cycle, a contradiction. So the colouring is proper and G is bipartite.",
      },
    ],
    tags: ["bipartite", "odd cycle", "BFS"],
  },
  {
    id: "XG14",
    topic: "graphs",
    kind: "proof",
    difficulty: 2,
    title: "Mantel by induction on 2k vertices",
    prompt:
      "Prove by induction on k ≥ 1 that every graph on 2k vertices with at least k^2 + 1 edges contains a triangle. Then show k^2 cannot be lowered: give a triangle-free graph on 2k vertices with exactly k^2 edges.",
    hints: [
      "The base case k = 1 is vacuous: how many edges can 2 vertices have?",
      "In the step, pick an edge uv. If u and v have a common neighbour you are done.",
      "Otherwise count the edges touching u or v and delete both vertices.",
    ],
    solutions: [
      {
        approach: "Delete both ends of an edge",
        text:
          "Base k = 1: a graph on 2 vertices has at most 1 edge, so it cannot have k^2 + 1 = 2 edges. The statement holds vacuously.\nStep: let G have 2k + 2 vertices and at least (k + 1)^2 + 1 = k^2 + 2k + 2 edges. G has an edge uv.\nIf u and v have a common neighbour, G has a triangle. Otherwise N(u) and N(v) are disjoint subsets of the 2k + 2 vertices, so deg(u) + deg(v) ≤ 2k + 2. The number of edges touching u or v is deg(u) + deg(v) − 1 ≤ 2k + 1 (uv is counted twice).\nDeleting u and v leaves a graph on 2k vertices with at least k^2 + 2k + 2 − (2k + 1) = k^2 + 1 edges. By the induction hypothesis it contains a triangle, and so does G.\nSharpness: K_{k,k} has 2k vertices and k^2 edges. It is bipartite, so every cycle has even length, and it has no triangle.",
      },
    ],
    tags: ["Mantel", "triangle-free", "induction"],
  },
  {
    id: "XG15",
    topic: "graphs",
    kind: "proof",
    difficulty: 2,
    title: "Sparse everywhere means few colours",
    prompt:
      "Suppose every subgraph of G (including G itself) has a vertex of degree at most k. Prove that G can be properly coloured with k + 1 colours.",
    hints: [
      "Induct on the number of vertices. Which vertex should you remove?",
      "Remove a vertex v of degree ≤ k. Does G − v still satisfy the hypothesis?",
      "Alternatively, peel off low-degree vertices one at a time and colour greedily in reverse order.",
    ],
    solutions: [
      {
        approach: "Induction on vertices",
        text:
          "Induct on n = |V(G)|. Base n = 1: one colour suffices.\nStep: by hypothesis G has a vertex v with deg(v) ≤ k. Every subgraph of G − v is also a subgraph of G, so G − v satisfies the hypothesis. By induction G − v has a proper colouring with colours 1, ..., k + 1.\nThe neighbours of v use at most k of the k + 1 colours, so some colour is free. Give it to v. No edge at v is monochromatic, and edges not at v were already fine.",
      },
      {
        approach: "Peeling order plus greedy",
        text:
          "Build an order: let v_1 be a vertex of degree ≤ k in G, v_2 a vertex of degree ≤ k in G − v_1, and in general v_i a vertex of degree ≤ k in G − {v_1, ..., v_{i−1}}. Each such graph is a subgraph of G, so the vertex exists.\nThen v_i has at most k neighbours among v_{i+1}, ..., v_n.\nColour greedily in the order v_n, v_{n−1}, ..., v_1, giving each vertex the smallest colour not used by an already-coloured neighbour. When v_i is coloured, its coloured neighbours lie among v_{i+1}, ..., v_n, so there are at most k of them, and one of the colours 1, ..., k + 1 is free.",
      },
    ],
    tags: ["colouring", "greedy", "degeneracy"],
  },
  {
    id: "XG16",
    topic: "graphs",
    kind: "proof",
    difficulty: 2,
    title: "Many colours need many edges",
    prompt:
      "Let G have m edges and chromatic number χ = χ(G). Prove that m ≥ χ(χ − 1)/2.",
    hints: [
      "Fix a proper colouring with exactly χ colours. Look at two colour classes.",
      "If no edge joins colour classes i and j, what could you do?",
    ],
    solutions: [
      {
        approach: "Merging colour classes",
        text:
          "Take a proper colouring with χ colours. Its classes V_1, ..., V_χ are all non-empty (otherwise fewer colours would suffice).\nFix i ≠ j. If no edge joined V_i and V_j, recolour every vertex of V_j with colour i. V_i ∪ V_j would still be independent, so the colouring stays proper with only χ − 1 colours, contradicting the definition of χ.\nSo every pair {i, j} has at least one edge between V_i and V_j. Such an edge determines the pair {i, j} from the colours of its ends, so different pairs give different edges.\nThere are C(χ, 2) = χ(χ − 1)/2 pairs, so m ≥ χ(χ − 1)/2.",
      },
    ],
    tags: ["colouring", "chromatic number", "counting"],
  },
  {
    id: "XG17",
    topic: "graphs",
    kind: "short",
    difficulty: 2,
    title: "Greedy colouring depends on the order",
    prompt:
      "(a) Give a bipartite graph and a vertex order for which greedy colouring (each vertex gets the smallest colour not used by an earlier neighbour) uses 3 colours.\n(b) Prove that for every graph G there is some order for which greedy uses exactly χ(G) colours.",
    hints: [
      "A path on 4 vertices is enough for (a). Colour the two ends first.",
      "For (b), start from an optimal colouring and list its colour classes one after another.",
      "Show by induction along the order that each vertex receives a greedy colour no larger than its optimal colour.",
    ],
    solutions: [
      {
        approach: "Path example; order by colour classes",
        text:
          "(a) Path a – b – c – d, ordered a, d, b, c. Greedy gives a = 1, d = 1 (not adjacent to a), b = 2 (neighbour a has 1), c = 3 (neighbours b = 2 and d = 1). Three colours, although the path is bipartite and χ = 2.\n(b) Take a proper colouring c with χ colours. Order the vertices with all of class 1 first, then class 2, and so on (any order inside a class). Let g(v) be the greedy colour.\nClaim: g(v) ≤ c(v) for all v. Go along the order. When v is reached, any earlier neighbour u is in a class < c(v) (same-class vertices are not adjacent, later classes come after), so by the claim so far g(u) ≤ c(u) ≤ c(v) − 1. Thus colour c(v) is not used by any earlier neighbour, and greedy picks something ≤ c(v).\nSo greedy uses at most χ colours, and it cannot use fewer than χ since its colouring is proper.",
      },
    ],
    tags: ["greedy", "colouring", "counterexample"],
  },
  {
    id: "XG18",
    topic: "graphs",
    kind: "proof",
    difficulty: 2,
    title: "Hamiltonian graphs do not shatter",
    prompt:
      "Let G be Hamiltonian and let S be a non-empty set of vertices. Prove that G − S has at most |S| components. Use this to show K_{3,4} is not Hamiltonian.",
    hints: [
      "Look at what deleting S does to a Hamiltonian cycle C.",
      "Deleting k vertices from a cycle leaves at most k arcs.",
      "In K_{3,4}, delete the side of size 3.",
    ],
    solutions: [
      {
        approach: "Cutting the Hamiltonian cycle",
        text:
          "Let C be a Hamiltonian cycle, and let |S| = k ≥ 1. Removing the k vertices of S from the cycle cuts it into at most k arcs (maximal runs of consecutive vertices not in S): going around C, each arc ends just before a vertex of S, and different arcs end before different vertices of S.\nEach arc is a path in G − S, so it lies inside one component. Every vertex of G − S is on C and hence on some arc. So every component contains at least one arc, and the number of components is at most the number of arcs, which is at most k.\nK_{3,4}: delete the 3 vertices on the small side. The 4 remaining vertices have no edges among them, so there are 4 > 3 components. K_{3,4} is therefore not Hamiltonian.",
      },
    ],
    tags: ["Hamiltonian", "cycles", "necessary condition"],
  },
  {
    id: "XG19",
    topic: "graphs",
    kind: "short",
    difficulty: 1,
    title: "The 3 × 3 grid",
    prompt:
      "The 3 × 3 grid graph has the 9 cells of a 3 × 3 board as vertices, with edges between cells sharing a side. Show it has a Hamiltonian path but no Hamiltonian cycle.",
    hints: [
      "Colour the board like a chessboard. How many cells of each colour?",
      "Along any cycle in a bipartite graph the colours alternate.",
    ],
    solutions: [
      {
        approach: "Bipartite counting",
        text:
          "Colour cell (r, c) black if r + c is even and white otherwise. Neighbouring cells differ in one coordinate by 1, so every edge joins black to white: the graph is bipartite with 5 black and 4 white cells.\nA Hamiltonian cycle alternates colours, so it has as many black as white vertices. 5 ≠ 4, so there is no Hamiltonian cycle.\nA Hamiltonian path exists: snake through the rows, (1,1) (1,2) (1,3) (2,3) (2,2) (2,1) (3,1) (3,2) (3,3).",
      },
    ],
    tags: ["Hamiltonian", "bipartite", "parity"],
  },
  {
    id: "XG20",
    topic: "graphs",
    kind: "flaw",
    difficulty: 2,
    title: "Minimum degree 1 means connected?",
    prompt:
      "Find the error.\nClaim: every graph on n ≥ 2 vertices with no isolated vertex (minimum degree ≥ 1) is connected.\n\"Proof\": induction on n. Base n = 2: the only graph with no isolated vertex is a single edge, which is connected.\nStep: let G be a connected graph on n vertices with minimum degree ≥ 1. Add a new vertex v with at least one edge to G. The new vertex is attached to G, and G was connected, so the new graph on n + 1 vertices is connected with minimum degree ≥ 1. This proves the claim for n + 1.",
    hints: [
      "Is every graph on n + 1 vertices with no isolated vertex obtained this way?",
      "Try a graph on 4 vertices with two edges.",
    ],
    solutions: [
      {
        approach: "Build-up error and a counterexample",
        text:
          "The step builds up: it starts from an n-vertex graph and adds a vertex. That only proves the claim for the (n + 1)-vertex graphs constructed this way, not for every (n + 1)-vertex graph with minimum degree ≥ 1.\nA correct step would start from an arbitrary (n + 1)-vertex graph H with no isolated vertex, delete a vertex, and apply the induction hypothesis. Here that fails: deleting a vertex can create an isolated vertex, so the hypothesis does not apply.\nThe claim is false. Two disjoint edges (n = 4) have minimum degree 1 and are disconnected. Deleting any vertex of this graph leaves an isolated vertex, so it cannot be built from a 3-vertex graph that satisfies the hypothesis.",
      },
    ],
    tags: ["flawed induction", "build-up error", "counterexample"],
  },
];
