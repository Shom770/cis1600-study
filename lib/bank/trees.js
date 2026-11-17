// Extra original practice problems: trees (CIS 1600 Midterm 2 style).
// Same schema as lib/questions.js. All graphs are finite and simple.

export const BANK_TREES = [
  {
    id: "XT01",
    topic: "trees",
    kind: "compute",
    difficulty: 1,
    title: "Counting the leaves",
    prompt:
      "A tree has exactly four vertices of degree 3, exactly two vertices of degree 4, and every other vertex is a leaf. How many leaves does it have?",
    hints: [
      "Let L be the number of leaves. Write n and the number of edges in terms of L.",
      "Degree sum = 2(n − 1).",
    ],
    solutions: [
      {
        approach: "Handshake with n − 1 edges",
        text:
          "Let L be the number of leaves. Then n = 6 + L and the tree has n − 1 = 5 + L edges.\nDegree sum: 4 · 3 + 2 · 4 + L = 20 + L. It equals 2(5 + L) = 10 + 2L.\nSo L = 10.",
      },
      {
        approach: "Leaf formula",
        text:
          "In a tree with n ≥ 2, n₁ = 2 + Σ_{d≥3} (d − 2) n_d.\nHere n₁ = 2 + (3 − 2) · 4 + (4 − 2) · 2 = 2 + 4 + 4 = 10.\nSuch a tree exists: put the six internal vertices on a path and attach leaves until each has its required degree. The path supplies 2 · 5 = 10 of the internal degree, so 20 − 10 = 10 leaves are attached.",
      },
    ],
    tags: ["leaves", "degree counting", "handshake"],
  },
  {
    id: "XT02",
    topic: "trees",
    kind: "proof",
    difficulty: 1,
    title: "Edges in a forest",
    prompt:
      "Prove that a forest with n vertices and c components has exactly n − c edges. How many trees make up a forest with 40 vertices and 33 edges?",
    hints: [
      "Each component of a forest is a tree.",
      "Or: in a forest every edge is a cut edge. Remove the edges one at a time.",
    ],
    solutions: [
      {
        approach: "Sum over the component trees",
        text:
          "Let the components be T_1, ..., T_c with n_1, ..., n_c vertices. Each T_i is connected and acyclic, so it is a tree with n_i − 1 edges.\nEvery edge lies in exactly one component, so the forest has Σ (n_i − 1) = n − c edges.\nWith n = 40 and 33 edges: 33 = 40 − c, so c = 7 trees.",
      },
      {
        approach: "Delete edges one at a time",
        text:
          "In a forest no edge lies on a cycle, so every edge is a cut edge. Deleting an edge e = uv splits the component containing u and v into exactly two (one containing u, one containing v), so the count goes up by exactly 1. The result is still a forest.\nDelete all m edges one by one. Each deletion adds exactly one component, and at the end there are n isolated vertices. So n = c + m, that is, m = n − c.\nFor 40 vertices and 33 edges, c = 40 − 33 = 7.",
      },
    ],
    tags: ["forest", "components", "edge count"],
  },
  {
    id: "XT03",
    topic: "trees",
    kind: "proof",
    difficulty: 2,
    title: "A vertex of degree k forces k leaves",
    prompt:
      "Let T be a tree with a vertex v of degree k ≥ 1. Prove that T has at least k leaves.",
    hints: [
      "Delete v. How many components does T − v have, and what does each look like?",
      "Each component is a tree touching v at exactly one vertex. Find a leaf of T inside it.",
      "Alternatively, use n₁ = 2 + Σ_{d≥3} (d − 2) n_d.",
    ],
    solutions: [
      {
        approach: "Delete v and look at each branch",
        text:
          "Let u_1, ..., u_k be the neighbours of v. In T − v each u_i is in a different component: a u_i–u_j path avoiding v, together with u_j v u_i, would form a cycle. Every vertex x ≠ v is in the component of some u_i: on the path from x to v, the vertex just before v is a neighbour u_i, and the part before it avoids v. So T − v has exactly k components B_1, ..., B_k with u_i ∈ B_i, and each is a tree (connected, and acyclic as a subgraph of T).\nThe only vertex of B_i adjacent to v is u_i, so degrees in T equal degrees in B_i except at u_i, which has one more.\nIf B_i = {u_i}, then u_i has degree 1 in T, a leaf. Otherwise B_i has at least 2 leaves, so at least one leaf of B_i is not u_i, and it is also a leaf of T.\nThe B_i are disjoint, so this gives k different leaves of T.",
      },
      {
        approach: "Leaf-count formula",
        text:
          "T has at least 2 vertices, since v has a neighbour. For any such tree, n₁ = 2 + Σ_{d≥3} (d − 2) n_d, where every term is ≥ 0.\nIf k ≥ 3, the term coming from v alone is k − 2, so n₁ ≥ 2 + (k − 2) = k.\nIf k = 1 or k = 2, every tree with at least 2 vertices has at least 2 ≥ k leaves.",
      },
    ],
    tags: ["leaves", "vertex removal", "degree counting"],
  },
  {
    id: "XT04",
    topic: "trees",
    kind: "proof",
    difficulty: 2,
    title: "Connected with n − 1 edges is a tree",
    prompt:
      "Let G be a connected graph with n vertices and n − 1 edges. Prove that G is a tree.",
    hints: [
      "You need to show G has no cycle. Suppose it does.",
      "Removing an edge that lies on a cycle keeps G connected.",
      "Use that a graph with n vertices and m edges has at least n − m components.",
    ],
    solutions: [
      {
        approach: "Components bound",
        text:
          "Suppose G has a cycle C, and let e be an edge of C. The rest of C joins the ends of e, so e is not a cut edge and G − e is still connected.\nBut G − e has n vertices and n − 2 edges, so it has at least n − (n − 2) = 2 components. Contradiction.\nSo G is connected and acyclic: a tree.",
      },
      {
        approach: "Strip cycle edges down to a tree",
        text:
          "While G has a cycle, delete one edge of a cycle. Each deletion keeps the graph connected (that edge is not a cut edge) and the process stops because there are finitely many edges.\nThe result is a connected acyclic graph on the same n vertices, a tree, so it has n − 1 edges.\nWe started with n − 1 edges, so no edge was deleted. That means G had no cycle to begin with, and G is a tree.",
      },
    ],
    tags: ["characterization", "edge count", "cycles"],
  },
  {
    id: "XT05",
    topic: "trees",
    kind: "proof",
    difficulty: 2,
    title: "Trees are exactly the unique-path graphs",
    prompt:
      "Prove that a graph G is a tree if and only if every pair of vertices is joined by exactly one path.",
    hints: [
      "(⇐) Any cycle gives two different paths between two of its vertices.",
      "(⇒) Suppose two different u–v paths exist. Find a cycle, or find an edge of a tree that is not a cut edge.",
      "If P ≠ Q, some edge xy of P is missing from Q. Can you get from x to y without that edge?",
    ],
    solutions: [
      {
        approach: "Cycle from two paths",
        text:
          "(⇐) Unique paths imply connected. If G had a cycle, pick adjacent cycle vertices a, b. The edge ab and the rest of the cycle are two different a–b paths. So G is acyclic and connected: a tree.\n(⇒) A tree is connected, so a path exists. Suppose P ≠ Q are two u–v paths. They start together. Let w be the last vertex before they first take different next steps. Let z be the first vertex of P after w that also lies on Q (v qualifies).\nThe vertices of Q before w are also the vertices of P before w, and P does not revisit them, so z comes after w on Q as well.\nThe inner vertices of P[w, z] are not on Q, so P[w, z] and Q[w, z] share only w and z. They are not both the single edge wz, because P and Q take different steps after w. So P[w, z] followed by Q[w, z] reversed is a cycle of length ≥ 3, contradicting that G is acyclic.",
      },
      {
        approach: "Every tree edge is a cut edge",
        text:
          "(⇐) as before: a cycle gives two paths between adjacent cycle vertices, so unique paths force connected and acyclic.\n(⇒) Let T be a tree and suppose P ≠ Q are u–v paths. Some edge e = xy of P is not on Q (otherwise Q would contain every edge of P, and a u–v path containing P equals P). Say x comes before y on P.\nIn T − e, x is connected to y: go back along P from x to u, then along Q from u to v, then back along P from v to y. None of these pieces uses e.\nSo e is not a cut edge. But every edge of a tree is a cut edge (it lies on no cycle). Contradiction.",
      },
    ],
    tags: ["characterization", "unique path", "cycles"],
  },
  {
    id: "XT06",
    topic: "trees",
    kind: "short",
    difficulty: 1,
    title: "One new edge, exactly one cycle",
    prompt:
      "Let T be a tree and let u, v be non-adjacent vertices. Prove that T + uv contains exactly one cycle.",
    hints: [
      "Any cycle of T + uv must use the new edge. Why?",
      "Remove uv from such a cycle. What is left?",
    ],
    solutions: [
      {
        approach: "Unique path",
        text:
          "Existence: T is connected, so it has a u–v path P. Since u and v are non-adjacent, P has length ≥ 2, so P plus the edge uv is a cycle.\nUniqueness: T is acyclic, so every cycle of T + uv uses uv. Deleting uv from such a cycle leaves a u–v path inside T. A tree has exactly one u–v path, P. So the cycle is P + uv, and there is only one.",
      },
    ],
    tags: ["unique path", "cycles"],
  },
  {
    id: "XT07",
    topic: "trees",
    kind: "proof",
    difficulty: 2,
    title: "Which vertices of a tree are cut vertices?",
    prompt:
      "Let T be a tree with at least 2 vertices. A cut vertex is one whose removal increases the number of components. Prove that v is a cut vertex of T iff deg(v) ≥ 2.",
    hints: [
      "Leaves: could a path between two other vertices pass through a leaf?",
      "Degree ≥ 2: take two neighbours a and b. If they stayed connected in T − v, what would you get?",
    ],
    solutions: [
      {
        approach: "Paths through v",
        text:
          "T has 1 component. In a tree with at least 2 vertices every vertex has degree ≥ 1.\nIf deg(v) = 1: for any two vertices x, y ≠ v, the x–y path in T cannot pass through v, because an inner vertex of a path uses two of its edges and v has only one. So the path survives in T − v, which is connected. v is not a cut vertex.\nIf deg(v) ≥ 2: pick neighbours a ≠ b. If a and b were connected in T − v, an a–b path avoiding v plus the edges bv and va would be a cycle in T. So a and b lie in different components of T − v, which has at least 2 components. v is a cut vertex.",
      },
      {
        approach: "Count edges",
        text:
          "Removing v deletes deg(v) edges, so T − v is a forest with n − 1 vertices and n − 1 − deg(v) edges.\nA forest with N vertices and M edges has N − M components, so T − v has (n − 1) − (n − 1 − deg(v)) = deg(v) components.\nThat is more than 1 exactly when deg(v) ≥ 2.",
      },
    ],
    tags: ["cut vertex", "leaves", "forest"],
  },
  {
    id: "XT08",
    topic: "trees",
    kind: "proof",
    difficulty: 2,
    title: "Leaves of a shallow rooted tree",
    prompt:
      "In a rooted tree, every vertex has at most m children, where m ≥ 1, and the height (largest depth of a vertex) is h. A leaf is a vertex with no children. Prove the tree has at most m^h leaves. Deduce that a rooted binary tree (m = 2) with 100 leaves has height at least 7.",
    hints: [
      "Induct on h. What are the subtrees hanging from the root's children?",
      "Each child's subtree has height at most h − 1.",
    ],
    solutions: [
      {
        approach: "Induction on height",
        text:
          "Base h = 0: the tree is just the root, which has no children. One leaf, and m^0 = 1.\nStep h ≥ 1: the root has at least one child, so it is not a leaf, and it has at most m children c_1, ..., c_r. Every other vertex lies in exactly one subtree rooted at some c_i. Each such subtree has height ≤ h − 1, and its leaves are exactly the leaves of T inside it (children are inherited). By induction each subtree has at most m^{h−1} leaves.\nSo T has at most r · m^{h−1} ≤ m · m^{h−1} = m^h leaves.\nBinary with 100 leaves: 100 ≤ 2^h. Since 2^6 = 64 < 100, h ≥ 7.",
      },
      {
        approach: "Count level by level",
        text:
          "Let a_i be the number of vertices at depth i and ℓ_i the number of leaves at depth i. Every vertex at depth i + 1 is a child of a non-leaf at depth i, so a_{i+1} ≤ m(a_i − ℓ_i).\nLet b_i = a_i + (ℓ_0 + ... + ℓ_{i−1}): the vertices at depth i plus the leaves above them. We show b_i ≤ m^i by induction on i. b_0 = a_0 = 1.\nStep: b_{i+1} = a_{i+1} + ℓ_0 + ... + ℓ_i ≤ m·a_i − (m − 1)ℓ_i + (ℓ_0 + ... + ℓ_{i−1}) ≤ m·a_i + m(ℓ_0 + ... + ℓ_{i−1}) = m·b_i ≤ m^{i+1}, using m ≥ 1.\nAt depth h nothing has children, so a_h = ℓ_h and b_h counts every leaf. Hence the number of leaves is b_h ≤ m^h.\nFor m = 2 and 100 leaves: 2^h ≥ 100 > 64 = 2^6, so h ≥ 7.",
      },
    ],
    tags: ["rooted tree", "height", "induction"],
  },
  {
    id: "XT09",
    topic: "trees",
    kind: "proof",
    difficulty: 3,
    title: "Every tree has a balanced vertex",
    prompt:
      "Let T be a tree on n vertices. Prove that there is a vertex v such that every component of T − v has at most n/2 vertices.",
    hints: [
      "For each vertex v let f(v) be the size of the largest component of T − v. Choose v with f(v) as small as possible.",
      "If f(v) > n/2, the big component C contains exactly one neighbour u of v. Compare f(u) with f(v).",
      "In T − u, the component containing v consists of everything outside C.",
    ],
    solutions: [
      {
        approach: "Minimise the largest branch",
        text:
          "For a vertex x, let f(x) be the number of vertices in the largest component of T − x (0 if n = 1). Choose v with f(v) minimal. We show f(v) ≤ n/2.\nSuppose not, and let C be a component of T − v with |C| > n/2. C contains exactly one neighbour u of v: it contains at least one (C is joined to v in T), and two neighbours in C would give a cycle through v.\nNow look at T − u. The vertices outside C, including v, form one connected piece: every component of T − v other than C is attached to v. They are not joined to C − u, because the only edge of T between C and the outside is uv. So one component of T − u is V(T) ∖ C, of size n − |C| < n/2 < |C|. Every other component of T − u lies inside C − u, so it has at most |C| − 1 vertices.\nHence f(u) ≤ max(n − |C|, |C| − 1) < |C| = f(v), contradicting the choice of v. So f(v) ≤ n/2.",
      },
      {
        approach: "Walk toward the heavy side",
        text:
          "Start at any vertex v. While some component C of T − v has more than n/2 vertices, step to the unique neighbour u of v inside C.\nAs in the first approach, the components of T − u are V ∖ C, of size n − |C| < n/2, and pieces of C − u, each of size ≤ |C| − 1. So after the step, either every component has size ≤ n/2 and we stop, or the unique heavy component lies inside C − u and has fewer vertices than C.\nThe size of the heavy component strictly decreases at each step, so the walk stops, and it stops at a vertex where every component of T − v has at most n/2 vertices.",
      },
    ],
    tags: ["centroid", "extremal", "vertex removal"],
  },
  {
    id: "XT10",
    topic: "trees",
    kind: "proof",
    difficulty: 3,
    title: "Extra edges give extra cycles",
    prompt:
      "Let G be a connected graph with n vertices and m edges. Prove that G contains at least m − n + 1 different cycles.",
    hints: [
      "Take a spanning tree T. How many edges of G are not in T?",
      "Each non-tree edge xy closes a cycle with the x–y path in T. Why are these cycles different?",
      "Alternatively, induct on m: delete an edge that lies on a cycle.",
    ],
    solutions: [
      {
        approach: "Fundamental cycles of a spanning tree",
        text:
          "G is connected, so it has a spanning tree T with n − 1 edges. So exactly m − n + 1 edges of G are not in T.\nFor each non-tree edge e = xy, the unique x–y path in T together with e forms a cycle C_e (the path has length ≥ 2 since xy is not a tree edge).\nC_e contains e and no other non-tree edge, since the rest of it lies in T. So if e ≠ e', C_e contains e but C_{e'} does not, and the cycles are different. This gives m − n + 1 different cycles.",
      },
      {
        approach: "Induction on edges",
        text:
          "Induct on m for connected graphs on n vertices.\nIf G has no cycle, it is a tree, so m = n − 1 and m − n + 1 = 0 cycles are required. This covers the smallest case m = n − 1.\nOtherwise pick a cycle C and an edge e on it. e is not a cut edge, so G − e is connected with m − 1 edges. By induction G − e has at least m − n different cycles, and none of them uses e. They are cycles of G too, and C is one more, because C uses e. So G has at least m − n + 1 cycles.",
      },
    ],
    tags: ["spanning tree", "cycles", "counting"],
  },
  {
    id: "XT11",
    topic: "trees",
    kind: "flaw",
    difficulty: 2,
    title: "A vertex next to two leaves?",
    prompt:
      "Find the error.\nClaim: every tree with n ≥ 3 vertices has a vertex adjacent to at least two leaves.\n\"Proof\": induction on n. Base n = 3: the only tree is a path a – b – c, and b is adjacent to the leaves a and c.\nStep: let T have n + 1 vertices and let ℓ be a leaf. T' = T − ℓ is a tree on n vertices, so by the induction hypothesis some vertex w is adjacent to two leaves x and y of T'. Put ℓ back. Adding a vertex does not remove any edges, so w is still adjacent to x and y, and x and y are still leaves. So w works for T.",
    hints: [
      "The step correctly shrinks T to T'. Look at what changes when ℓ is reattached.",
      "Where could ℓ be attached? Try n + 1 = 4.",
    ],
    solutions: [
      {
        approach: "Reattaching can destroy a leaf",
        text:
          "The error is \"x and y are still leaves\". ℓ is attached to some vertex of T', and that vertex might be x or y. Then x gains an edge, has degree 2 in T, and is no longer a leaf.\nCounterexample: the path a – b – c – d. Remove the leaf ℓ = d to get a – b – c, where w = b is adjacent to leaves a and c. But d attaches to c, so in T the vertex c has degree 2. In the path on 4 vertices, b's neighbours are a (leaf) and c (not a leaf), and c's neighbours are b and d, with only d a leaf. No vertex is adjacent to two leaves, so the claim is false for n = 4.",
      },
    ],
    tags: ["flawed induction", "leaves", "counterexample"],
  },
  {
    id: "XT12",
    topic: "trees",
    kind: "proof",
    difficulty: 2,
    title: "No degree-2 vertices means mostly leaves",
    prompt:
      "Let T be a tree with n ≥ 2 vertices and no vertex of degree 2. Prove that T has at least (n + 2)/2 leaves, so more than half of its vertices are leaves.",
    hints: [
      "Every vertex is a leaf or has degree ≥ 3.",
      "Lower-bound the degree sum using n₁ leaves and n − n₁ vertices of degree ≥ 3, and compare it with 2(n − 1).",
    ],
    solutions: [
      {
        approach: "Degree sum",
        text:
          "With n ≥ 2 every vertex has degree ≥ 1, and none has degree 2, so each vertex is a leaf or has degree ≥ 3. Let n₁ be the number of leaves.\nThe degree sum is 2(n − 1), so 2(n − 1) ≥ n₁ · 1 + (n − n₁) · 3 = 3n − 2n₁.\nRearranging gives 2n₁ ≥ n + 2, so n₁ ≥ (n + 2)/2 > n/2.",
      },
      {
        approach: "Leaf formula",
        text:
          "For a tree with n ≥ 2, n₁ = 2 + Σ_{d≥3} (d − 2) n_d.\nEvery term has d − 2 ≥ 1, so n₁ ≥ 2 + Σ_{d≥3} n_d. With no degree-2 vertices, Σ_{d≥3} n_d = n − n₁.\nSo n₁ ≥ 2 + n − n₁, giving n₁ ≥ (n + 2)/2. Equality holds exactly when every non-leaf has degree 3.",
      },
    ],
    tags: ["leaves", "degree counting"],
  },
  {
    id: "XT13",
    topic: "trees",
    kind: "compute",
    difficulty: 1,
    title: "Full ternary tree count",
    prompt:
      "In a rooted tree, every internal vertex (a vertex with at least one child) has exactly 3 children. There are 25 internal vertices. How many vertices and how many leaves are there?",
    hints: [
      "Every vertex except the root is the child of exactly one internal vertex.",
      "So the number of non-root vertices is 3 times the number of internal vertices.",
    ],
    solutions: [
      {
        approach: "Count children",
        text:
          "Each non-root vertex is a child of exactly one internal vertex, so the number of non-root vertices is 3 · 25 = 75.\nTotal vertices: 75 + 1 = 76. Leaves: 76 − 25 = 51.",
      },
      {
        approach: "Edges",
        text:
          "Each internal vertex has 3 edges down to its children, and every edge goes from a parent to a child, so there are 3 · 25 = 75 edges.\nA tree with 75 edges has 76 vertices, and 76 − 25 = 51 of them are leaves.",
      },
    ],
    tags: ["rooted tree", "counting"],
  },
  {
    id: "XT14",
    topic: "trees",
    kind: "proof",
    difficulty: 3,
    title: "Swapping an edge between spanning trees",
    prompt:
      "Let T_1 and T_2 be spanning trees of a connected graph G, and let e be an edge of T_1 that is not in T_2. Prove that there is an edge f of T_2, not in T_1, such that T_1 − e + f is a spanning tree of G.",
    hints: [
      "Deleting e from T_1 leaves two components A and B.",
      "The path in T_2 between the ends of e must cross from A to B somewhere.",
      "Connected with n − 1 edges means tree.",
    ],
    solutions: [
      {
        approach: "Crossing edge on a T_2 path",
        text:
          "Let e = ab. Every edge of the tree T_1 is a cut edge, so T_1 − e has exactly two components, A containing a and B containing b. Together they cover all vertices.\nT_2 is spanning and connected, so it has an a–b path. The path starts in A and ends in B, so some edge f on it has one end in A and the other in B.\nf ≠ e because e ∉ T_2. And f ∉ T_1: the only edge of T_1 between A and B is e, since A and B are different components of T_1 − e.\nT_1 − e + f is connected: A and B are each connected and f joins them. It has n − 1 edges (we removed one and added a new one). A connected graph with n vertices and n − 1 edges is a tree, and this one spans G.",
      },
    ],
    tags: ["spanning tree", "exchange", "cut edge"],
  },
];
