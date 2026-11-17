// Original probability practice problems (sample spaces, inclusion–exclusion, union bound,
// birthday-style, conditional probability, total probability, Bayes, independence, Monty Hall).
// All numeric answers verified by exact enumeration / fraction arithmetic.

export const BANK_PROBABILITY = [
  // ---------------- DIFFICULTY 1 ----------------
  {
    id: "XP01",
    topic: "probability",
    kind: "compute",
    difficulty: 1,
    title: "Divisible by 4 or 6",
    prompt:
      "An integer is chosen uniformly at random from {1, 2, …, 60}. What is the probability that it is divisible by 4 or by 6?",
    hints: [
      "Let A = divisible by 4 and B = divisible by 6. You want Pr[A ∪ B].",
      "A number divisible by both 4 and 6 is divisible by lcm(4, 6) = 12, not by 24.",
      "|A ∪ B| = |A| + |B| − |A ∩ B|.",
    ],
    solutions: [
      {
        approach: "Inclusion–exclusion",
        text:
          "|A| = ⌊60/4⌋ = 15, |B| = ⌊60/6⌋ = 10, |A ∩ B| = ⌊60/12⌋ = 5.\n|A ∪ B| = 15 + 10 − 5 = 20.\nPr[A ∪ B] = 20/60 = 1/3.",
      },
      {
        approach: "One period of length 12",
        text:
          "Divisibility by 4 and by 6 repeats every 12 numbers, and 60 = 5·12, so it suffices to look at {1, …, 12}.\nThe numbers divisible by 4 or 6 there are 4, 6, 8, 12: four out of twelve.\nPr = 4/12 = 1/3.",
      },
    ],
    tags: ["inclusion–exclusion", "uniform"],
  },
  {
    id: "XP02",
    topic: "probability",
    kind: "compute",
    difficulty: 1,
    title: "Sum of 8 with different faces",
    prompt:
      "Two fair six-sided dice are rolled. Given that the two dice show different numbers, what is the probability that the sum is 8?",
    hints: [
      "How many of the 36 outcomes have the two dice different?",
      "Conditioning on an event of equally likely outcomes leaves those outcomes equally likely.",
    ],
    solutions: [
      {
        approach: "Restrict the sample space",
        text:
          "Outcomes with different faces: 36 − 6 = 30, all equally likely.\nSum 8 outcomes: (2,6), (3,5), (4,4), (5,3), (6,2). Removing the double (4,4) leaves 4.\nAnswer: 4/30 = 2/15.",
      },
      {
        approach: "Definition of conditional probability",
        text:
          "Let S = sum is 8, D = faces differ.\nPr[S ∩ D] = 4/36, Pr[D] = 30/36.\nPr[S | D] = (4/36)/(30/36) = 4/30 = 2/15.\n(Compare: unconditionally Pr[S] = 5/36, slightly larger than 2/15 = 4.8/36.)",
      },
    ],
    tags: ["conditional", "dice"],
  },
  {
    id: "XP03",
    topic: "probability",
    kind: "short",
    difficulty: 1,
    title: "Disjoint means independent?",
    prompt:
      "True or false: if A and B are disjoint events with Pr[A] > 0 and Pr[B] > 0, then A and B are independent. Justify.",
    hints: [
      "What is Pr[A ∩ B] when A and B are disjoint?",
      "Compare that with Pr[A]·Pr[B].",
    ],
    solutions: [
      {
        approach: "Product rule",
        text:
          "False. Disjoint means A ∩ B = ∅, so Pr[A ∩ B] = 0.\nBut Pr[A]·Pr[B] > 0 since both factors are positive. So Pr[A ∩ B] ≠ Pr[A]·Pr[B]: they are never independent.\nIntuition: disjoint events are strongly dependent, because learning B happened tells you A did not.",
      },
      {
        approach: "Conditional probability",
        text:
          "False. Pr[A | B] = Pr[A ∩ B]/Pr[B] = 0, while Pr[A] > 0. Conditioning on B changes the probability of A, so they are dependent.\nConcrete example: one die roll, A = roll is 1, B = roll is 2. Pr[A ∩ B] = 0 ≠ 1/36.",
      },
    ],
    tags: ["independence", "trap"],
  },
  {
    id: "XP04",
    topic: "probability",
    kind: "compute",
    difficulty: 1,
    title: "Three hearts in a row",
    prompt:
      "Three cards are dealt without replacement from a shuffled standard 52-card deck. What is the probability that all three are hearts?",
    hints: [
      "Use the multiplication rule: Pr[H₁ ∩ H₂ ∩ H₃] = Pr[H₁]·Pr[H₂ | H₁]·Pr[H₃ | H₁ ∩ H₂].",
      "After one heart is gone, 12 hearts remain among 51 cards.",
    ],
    solutions: [
      {
        approach: "Multiplication rule",
        text:
          "Pr = (13/52)·(12/51)·(11/50) = (1/4)·(4/17)·(11/50) = 11/850.",
      },
      {
        approach: "Counting unordered hands",
        text:
          "All 3-card subsets are equally likely. There are C(52,3) = 22100 of them, and C(13,3) = 286 consist only of hearts.\nPr = 286/22100 = 11/850.",
      },
    ],
    tags: ["multiplication rule", "cards"],
  },
  {
    id: "XP05",
    topic: "probability",
    kind: "compute",
    difficulty: 1,
    title: "Two machines, one defect",
    prompt:
      "Machine A makes 60% of a factory's widgets and 1/20 of its widgets are defective. Machine B makes the other 40% and 1/10 of its widgets are defective. (a) What fraction of all widgets are defective? (b) A randomly chosen widget is defective. What is the probability it came from machine B?",
    hints: [
      "Machines A and B partition the sample space: use total probability for (a).",
      "For (b), Bayes: Pr[B | D] = Pr[B]·Pr[D | B] / Pr[D].",
    ],
    solutions: [
      {
        approach: "Total probability, then Bayes",
        text:
          "(a) Pr[D] = Pr[A]·Pr[D|A] + Pr[B]·Pr[D|B] = (3/5)(1/20) + (2/5)(1/10) = 3/100 + 4/100 = 7/100.\n(b) Pr[B | D] = (4/100)/(7/100) = 4/7.",
      },
      {
        approach: "Frequency counting",
        text:
          "Imagine 1000 widgets. 600 come from A, of which 30 are defective. 400 come from B, of which 40 are defective.\n(a) 70 defective out of 1000: 7/100.\n(b) Of the 70 defective widgets, 40 are from B: 4/7.",
      },
    ],
    tags: ["total probability", "Bayes"],
  },
  {
    id: "XP06",
    topic: "probability",
    kind: "compute",
    difficulty: 1,
    title: "At least one six in four rolls",
    prompt:
      "A fair die is rolled four times. What is the probability that at least one roll is a 6? Leave your answer as a fraction.",
    hints: [
      "\"At least one\" is usually easiest through the complement.",
      "The complement is \"no roll is a 6\", and the rolls are mutually independent.",
    ],
    solutions: [
      {
        approach: "Complement",
        text:
          "Pr[no 6] = (5/6)^4 = 625/1296, by mutual independence of the rolls.\nPr[at least one 6] = 1 − 625/1296 = 671/1296.",
      },
      {
        approach: "Counting",
        text:
          "The sample space has 6^4 = 1296 equally likely sequences. Those with no 6 use only faces 1–5: 5^4 = 625 sequences.\nSo 1296 − 625 = 671 sequences contain a 6, and the probability is 671/1296 (just over 1/2).",
      },
    ],
    tags: ["complement", "dice"],
  },
  {
    id: "XP07",
    topic: "probability",
    kind: "short",
    difficulty: 1,
    title: "Ten rare failures",
    prompt:
      "A system has 10 components. Each component fails with probability 1/50, and nothing is known about how failures are correlated. Give the best lower bound you can on the probability that no component fails, and say whether the bound can be achieved.",
    hints: [
      "Without independence you cannot multiply. What bound works for any events?",
      "Union bound: Pr[F₁ ∪ … ∪ F_{10}] ≤ Σ Pr[F_i].",
      "When does the union bound hold with equality?",
    ],
    solutions: [
      {
        approach: "Union bound",
        text:
          "Let F_i = component i fails. By the union bound,\nPr[some failure] = Pr[F₁ ∪ … ∪ F_{10}] ≤ 10·(1/50) = 1/5.\nSo Pr[no failure] ≥ 1 − 1/5 = 4/5.\nThe bound is tight: if the failures are pairwise disjoint (at most one component ever fails, e.g. a single random draw picks which one fails, each with probability 1/50, and none fails with probability 4/5), then the union has probability exactly 1/5 and Pr[no failure] = 4/5.\n(If the failures were independent, the answer would be (49/50)^{10}, which is larger than 4/5.)",
      },
    ],
    tags: ["union bound"],
  },
  {
    id: "XP08",
    topic: "probability",
    kind: "compute",
    difficulty: 1,
    title: "Majority heads after a head",
    prompt:
      "Three fair coins are flipped. Given that the first coin is heads, what is the probability that at least two of the three coins are heads?",
    hints: [
      "Condition on the first coin: which outcomes remain?",
      "Given the first is heads, you need at least one more head among the other two coins.",
    ],
    solutions: [
      {
        approach: "Restrict the sample space",
        text:
          "Given first = H, the remaining outcomes are HHH, HHT, HTH, HTT, equally likely.\nAt least two heads: HHH, HHT, HTH. That is 3 of 4.\nAnswer: 3/4.",
      },
      {
        approach: "Complement on the remaining coins",
        text:
          "Given the first coin is H, we need at least one H among coins 2 and 3. These are independent of coin 1, and Pr[both tails] = 1/4.\nAnswer: 1 − 1/4 = 3/4.",
      },
    ],
    tags: ["conditional", "coins"],
  },

  // ---------------- DIFFICULTY 2 ----------------
  {
    id: "XP09",
    topic: "probability",
    kind: "compute",
    difficulty: 2,
    title: "A positive test for a rare condition",
    prompt:
      "A condition affects 1 in 100 people. A test is positive for 9/10 of people who have the condition and also for 1/10 of people who do not. A random person tests positive. What is the probability they have the condition?",
    hints: [
      "Let D = has condition, T = tests positive. You want Pr[D | T], not Pr[T | D].",
      "Compute Pr[T] by total probability over D and its complement.",
    ],
    solutions: [
      {
        approach: "Bayes' rule",
        text:
          "Pr[T] = Pr[D]·Pr[T|D] + Pr[D̄]·Pr[T|D̄] = (1/100)(9/10) + (99/100)(1/10) = 9/1000 + 99/1000 = 108/1000.\nPr[D | T] = (9/1000)/(108/1000) = 9/108 = 1/12.",
      },
      {
        approach: "Natural frequencies",
        text:
          "Picture 1000 people. 10 have the condition, and 9 of them test positive. 990 do not, and 99 of them test positive.\nThere are 9 + 99 = 108 positives, of whom 9 are sick: 9/108 = 1/12.\nThe false positives swamp the true ones because the condition is rare.",
      },
    ],
    tags: ["Bayes", "base rate"],
  },
  {
    id: "XP10",
    topic: "probability",
    kind: "compute",
    difficulty: 2,
    title: "Divisible by 3, 5, or 7",
    prompt:
      "An integer is chosen uniformly from {1, 2, …, 105}. What is the probability that it is divisible by at least one of 3, 5, 7?",
    hints: [
      "Inclusion–exclusion with three sets: add singles, subtract pairs, add the triple.",
      "105 = 3·5·7, so every count ⌊105/d⌋ is exact.",
    ],
    solutions: [
      {
        approach: "Inclusion–exclusion",
        text:
          "Let A₃, A₅, A₇ be the multiples of 3, 5, 7.\n|A₃| = 35, |A₅| = 21, |A₇| = 15.\n|A₃ ∩ A₅| = 105/15 = 7, |A₃ ∩ A₇| = 105/21 = 5, |A₅ ∩ A₇| = 105/35 = 3.\n|A₃ ∩ A₅ ∩ A₇| = 1.\n|A₃ ∪ A₅ ∪ A₇| = 35 + 21 + 15 − 7 − 5 − 3 + 1 = 57.\nPr = 57/105 = 19/35.",
      },
      {
        approach: "Complement via independence of residues",
        text:
          "A uniform number in {1, …, 105} has its residues mod 3, 5, 7 independent and uniform (by the Chinese remainder theorem each triple of residues occurs exactly once).\nPr[not divisible by any] = (2/3)(4/5)(6/7) = 48/105 = 16/35.\nPr[divisible by at least one] = 1 − 16/35 = 19/35.",
      },
    ],
    tags: ["inclusion–exclusion"],
  },
  {
    id: "XP11",
    topic: "probability",
    kind: "compute",
    difficulty: 2,
    title: "Four letters, no match",
    prompt:
      "Four letters are placed into four addressed envelopes uniformly at random (one letter per envelope). What is the probability that no letter is in its correct envelope?",
    hints: [
      "Let A_i = letter i is in the correct envelope. You want 1 − Pr[A₁ ∪ A₂ ∪ A₃ ∪ A₄].",
      "Any k specified letters are all correct in (4 − k)! of the 24 permutations.",
    ],
    solutions: [
      {
        approach: "Inclusion–exclusion",
        text:
          "Pr[A_{i₁} ∩ … ∩ A_{i_k}] = (4 − k)!/4!, and there are C(4,k) such intersections.\nPr[∪A_i] = C(4,1)·3!/24 − C(4,2)·2!/24 + C(4,3)·1!/24 − C(4,4)·0!/24 = (24 − 12 + 4 − 1)/24 = 15/24.\nPr[no match] = 1 − 15/24 = 9/24 = 3/8.",
      },
      {
        approach: "Direct count",
        text:
          "Count derangements of {1,2,3,4}. Letter 1 goes to one of 3 wrong envelopes, say envelope j.\nIf letter j goes to envelope 1, the other two letters must swap: 1 way.\nIf letter j does not go to envelope 1, then letter j and the other two letters each have exactly one forbidden envelope among the remaining three (treat envelope 1 as letter j's forbidden spot), so this is a derangement of 3 items: 2 ways.\nTotal 3·(1 + 2) = 9 derangements out of 24 permutations: 9/24 = 3/8.",
      },
    ],
    tags: ["inclusion–exclusion", "derangement"],
  },
  {
    id: "XP12",
    topic: "probability",
    kind: "compute",
    difficulty: 2,
    title: "Birthday problem with dice",
    prompt:
      "Four fair dice are rolled. What is the probability that at least two of them show the same number?",
    hints: [
      "This is the birthday problem with 6 \"days\" and 4 \"people\".",
      "Compute the probability that all four faces are distinct.",
    ],
    solutions: [
      {
        approach: "Complement counting",
        text:
          "All distinct: 6·5·4·3 = 360 of the 6^4 = 1296 sequences.\nPr[all distinct] = 360/1296 = 5/18.\nPr[some repeat] = 1 − 5/18 = 13/18.",
      },
      {
        approach: "Sequential multiplication rule",
        text:
          "Roll the dice one at a time. Given the earlier dice are distinct, the next die avoids them with probability 5/6, then 4/6, then 3/6.\nPr[all distinct] = 1·(5/6)(4/6)(3/6) = 60/216 = 5/18.\nAnswer: 13/18.",
      },
    ],
    tags: ["birthday", "complement"],
  },
  {
    id: "XP13",
    topic: "probability",
    kind: "compute",
    difficulty: 2,
    title: "Monty Hall with four doors",
    prompt:
      "There are four doors with one prize. You pick door 1. The host, who knows where the prize is, opens one of the other three doors that hides a goat (choosing uniformly if several qualify). You then switch to one of the two other unopened doors, chosen uniformly at random. What is your probability of winning? Compare with staying.",
    hints: [
      "Split on whether your first pick was correct.",
      "If your first pick was wrong, where must the prize be after the host opens a door?",
    ],
    solutions: [
      {
        approach: "Total probability on the first pick",
        text:
          "Let C = first pick correct, Pr[C] = 1/4.\nIf C, both doors you might switch to are goats: Pr[win | C] = 0.\nIf not C (probability 3/4), the host never opens the prize door, so the prize is one of the two unopened doors you choose between: Pr[win | C̄] = 1/2.\nPr[win by switching] = (1/4)(0) + (3/4)(1/2) = 3/8.\nStaying wins with probability 1/4, so switching is better (3/8 > 1/4).",
      },
      {
        approach: "Enumeration",
        text:
          "Prize at door 1 (prob 1/4): host opens any of 2, 3, 4; switching always loses.\nPrize at door k ∈ {2,3,4} (each 1/4): host opens one of the two goat doors other than door 1; the two doors you can switch to are k and one goat, so you win with probability 1/2.\nTotal: 3·(1/4)(1/2) = 3/8.",
      },
    ],
    tags: ["Monty Hall", "total probability"],
  },
  {
    id: "XP14",
    topic: "probability",
    kind: "compute",
    difficulty: 2,
    title: "The host who doesn't know",
    prompt:
      "Three doors, one prize. You pick door 1. This time the host does not know where the prize is: he opens door 2 or door 3 uniformly at random. He happens to reveal a goat. Given this, what is the probability that switching wins?",
    hints: [
      "Build the sample space from (prize location, door opened): 3 × 2 = 6 equally likely outcomes.",
      "Throw out the outcomes where the host reveals the prize, then rescale.",
    ],
    solutions: [
      {
        approach: "Enumerate and condition",
        text:
          "Outcomes (prize, opened), each 1/6: (1,2), (1,3), (2,2), (2,3), (3,2), (3,3).\nThe host reveals a goat unless opened = prize, which removes (2,2) and (3,3). Four outcomes remain, equally likely.\nSwitching wins when the prize is behind the unopened other door: (2,3) and (3,2). That is 2 of 4.\nPr[switch wins | goat revealed] = 1/2.",
      },
      {
        approach: "Bayes",
        text:
          "Let G = goat revealed. Pr[G | prize at 1] = 1, Pr[G | prize at 2 or 3] = 1/2.\nPr[G] = (1/3)(1) + (2/3)(1/2) = 2/3.\nPr[prize at 1 | G] = (1/3)/(2/3) = 1/2, so switching also wins with probability 1/2.\nThe host's random choice gives no extra information the way a knowing host does; the classic 2/3 relies on the host being forced to avoid the prize.",
      },
    ],
    tags: ["Monty Hall", "conditional", "trap"],
  },
  {
    id: "XP15",
    topic: "probability",
    kind: "short",
    difficulty: 2,
    title: "Which child is a girl?",
    prompt:
      "A family has two children; each is independently a boy or a girl with probability 1/2. (a) Given that at least one child is a girl, what is the probability both are girls? (b) Given that the older child is a girl, what is the probability both are girls? Explain why the answers differ.",
    hints: [
      "Use ordered outcomes (older, younger): BB, BG, GB, GG.",
      "Count how many outcomes each conditioning event keeps.",
    ],
    solutions: [
      {
        approach: "Restricted sample spaces",
        text:
          "Ω = {BB, BG, GB, GG} (older first), uniform.\n(a) At least one girl: {BG, GB, GG}. Both girls: {GG}. Answer 1/3.\n(b) Older is a girl: {GB, GG}. Answer 1/2.\nThey differ because the conditioning events differ: \"at least one girl\" keeps three outcomes, while \"older is a girl\" keeps only two. Identifying which child is a girl rules out GB-or-BG ambiguity.",
      },
      {
        approach: "Formula",
        text:
          "(a) Pr[GG | at least one G] = Pr[GG]/Pr[at least one G] = (1/4)/(3/4) = 1/3.\n(b) Pr[GG | older G] = Pr[GG]/Pr[older G] = (1/4)/(1/2) = 1/2. Equivalently, the younger child is independent of the older, so the answer is just Pr[younger is G] = 1/2.",
      },
    ],
    tags: ["conditional", "trap"],
  },
  {
    id: "XP16",
    topic: "probability",
    kind: "compute",
    difficulty: 2,
    title: "Reinforcing urn",
    prompt:
      "An urn holds 3 red and 2 blue balls. You draw a ball uniformly, then return it together with one extra ball of the same color. Then you draw a second ball uniformly. (a) What is the probability the second ball is red? (b) Given that the second ball is red, what is the probability the first ball was red?",
    hints: [
      "After the first draw the urn has 6 balls; its composition depends on the first color.",
      "Total probability over the first color for (a); Bayes for (b).",
    ],
    solutions: [
      {
        approach: "Total probability and Bayes",
        text:
          "Let R₁, R₂ be the events that the first/second draw is red.\nIf R₁: urn has 4 red, 2 blue, so Pr[R₂ | R₁] = 4/6 = 2/3.\nIf not R₁: urn has 3 red, 3 blue, so Pr[R₂ | R̄₁] = 3/6 = 1/2.\n(a) Pr[R₂] = (3/5)(2/3) + (2/5)(1/2) = 2/5 + 1/5 = 3/5.\n(b) Pr[R₁ | R₂] = Pr[R₁ ∩ R₂]/Pr[R₂] = (2/5)/(3/5) = 2/3.",
      },
      {
        approach: "Weighted outcome table",
        text:
          "Use 30 as a common denominator. Pr[RR] = (3/5)(4/6) = 12/30, Pr[RB] = (3/5)(2/6) = 6/30, Pr[BR] = (2/5)(3/6) = 6/30, Pr[BB] = (2/5)(3/6) = 6/30.\n(a) Pr[R₂] = (12 + 6)/30 = 3/5. (The same as Pr[R₁], a known symmetry of this urn.)\n(b) Pr[R₁ | R₂] = 12/18 = 2/3.",
      },
    ],
    tags: ["total probability", "Bayes", "urn"],
  },
  {
    id: "XP17",
    topic: "probability",
    kind: "short",
    difficulty: 2,
    title: "Sum of 7 versus sum of 6",
    prompt:
      "Two fair dice are rolled. Let B = the first die shows 4. (a) Is B independent of the event \"the sum is 7\"? (b) Is B independent of the event \"the sum is 6\"? Justify each with probabilities.",
    hints: [
      "Compare Pr[sum = s | first = 4] with Pr[sum = s].",
      "For sum 7, every value of the first die leaves exactly one good second die.",
    ],
    solutions: [
      {
        approach: "Product rule",
        text:
          "Pr[B] = 1/6.\n(a) Pr[sum 7] = 6/36 = 1/6. Pr[B ∩ sum 7] = Pr[(4,3)] = 1/36 = (1/6)(1/6). Independent.\n(b) Pr[sum 6] = 5/36. Pr[B ∩ sum 6] = Pr[(4,2)] = 1/36, but Pr[B]·Pr[sum 6] = 5/216 ≠ 1/36. Not independent.",
      },
      {
        approach: "Conditioning",
        text:
          "(a) Given the first die is any value a, the sum is 7 iff the second die is 7 − a, which is always a legal face: probability 1/6 = Pr[sum 7]. So conditioning on B doesn't change it: independent.\n(b) Given the first die is 4, sum 6 needs a 2: probability 1/6. But Pr[sum 6] = 5/36 ≠ 1/6 (for example, a first die of 6 makes sum 6 impossible). Not independent.",
      },
    ],
    tags: ["independence", "dice"],
  },
  {
    id: "XP18",
    topic: "probability",
    kind: "flaw",
    difficulty: 2,
    title: "Adding up the sixes",
    prompt:
      "A student argues: \"Roll a fair die three times. Let S_i be the event that roll i is a 6. Each Pr[S_i] = 1/6, so Pr[at least one 6] = Pr[S₁ ∪ S₂ ∪ S₃] = 1/6 + 1/6 + 1/6 = 1/2. By the same logic, with six rolls a 6 is guaranteed.\" Find the error and compute the correct probability for three rolls.",
    hints: [
      "When is Pr[A ∪ B] = Pr[A] + Pr[B]?",
      "Are S₁ and S₂ disjoint?",
      "Either use the complement or inclusion–exclusion.",
    ],
    solutions: [
      {
        approach: "Identify the error, then complement",
        text:
          "The sum rule Pr[∪S_i] = Σ Pr[S_i] needs the events to be pairwise disjoint. Here they overlap (two rolls can both be 6), so the sum only gives the union bound Pr[∪S_i] ≤ 1/2; outcomes with several sixes are counted more than once. The six-roll claim (\"probability 1\") is just the union bound, which is not tight.\nCorrect value: Pr[no 6] = (5/6)^3 = 125/216, so Pr[at least one 6] = 1 − 125/216 = 91/216 (slightly less than 1/2).",
      },
      {
        approach: "Inclusion–exclusion",
        text:
          "Pr[S₁ ∪ S₂ ∪ S₃] = 3·(1/6) − 3·(1/36) + 1/216 = 108/216 − 18/216 + 1/216 = 91/216.\nThe student kept only the first term and dropped the pairwise and triple corrections.",
      },
    ],
    tags: ["union bound", "inclusion–exclusion", "flaw"],
  },
  {
    id: "XP19",
    topic: "probability",
    kind: "flaw",
    difficulty: 2,
    title: "Is independence transitive?",
    prompt:
      "Claim: if A and B are independent, and B and C are independent, then A and C are independent.\n\"Proof\": Independence of A and B means knowing whether B happened tells us nothing about A. Independence of B and C means knowing whether C happened tells us nothing about B. So C tells us nothing about B, which tells us nothing about A; hence C tells us nothing about A, i.e. Pr[A | C] = Pr[A]. ∎\nFind the flaw and give a counterexample.",
    hints: [
      "The argument assumes information about A could only flow through B.",
      "Try making C closely related to A, but unrelated to B.",
      "Two fair coin flips suffice.",
    ],
    solutions: [
      {
        approach: "Counterexample with C = A",
        text:
          "Flaw: the argument treats independence as a chain where C can only affect A through B. Nothing in the hypotheses connects A and C directly, so C may carry information about A that has nothing to do with B. Independence is a statement about pairs, and it is not transitive.\nCounterexample: flip two fair coins. A = first flip is heads, B = second flip is heads, C = A.\nA and B are independent (Pr[A ∩ B] = 1/4 = (1/2)(1/2)), and B and C are independent for the same reason.\nBut Pr[A ∩ C] = Pr[A] = 1/2 ≠ 1/4 = Pr[A]·Pr[C]. So A and C are not independent.",
      },
      {
        approach: "Counterexample with C = Ā",
        text:
          "Same coins, but C = first flip is tails. B and C are independent (different flips), and A, B are independent.\nA ∩ C = ∅, so Pr[A ∩ C] = 0 ≠ 1/4. A and C are dependent (in fact disjoint). This shows the reasoning \"C tells us nothing about B, B tells us nothing about A\" does not chain.",
      },
    ],
    tags: ["independence", "flaw", "counterexample"],
  },
  {
    id: "XP20",
    topic: "probability",
    kind: "proof",
    difficulty: 2,
    title: "Independence survives complements",
    prompt:
      "Prove that if A and B are independent events, then A and B̄ are independent, and Ā and B̄ are independent.",
    hints: [
      "A is the disjoint union of A ∩ B and A ∩ B̄.",
      "Apply the first result twice (with the roles of A and B swapped) for the second part.",
    ],
    solutions: [
      {
        approach: "Disjoint decomposition",
        text:
          "A = (A ∩ B) ∪ (A ∩ B̄), a disjoint union, so Pr[A ∩ B̄] = Pr[A] − Pr[A ∩ B].\nBy independence, Pr[A ∩ B] = Pr[A]·Pr[B], so\nPr[A ∩ B̄] = Pr[A] − Pr[A]·Pr[B] = Pr[A]·(1 − Pr[B]) = Pr[A]·Pr[B̄].\nSo A and B̄ are independent.\nNow apply this result to the independent pair (B̄, A) (independence is symmetric): B̄ and Ā are independent. ∎",
      },
      {
        approach: "Inclusion–exclusion on the complement",
        text:
          "Ā ∩ B̄ is the complement of A ∪ B (De Morgan), so\nPr[Ā ∩ B̄] = 1 − Pr[A ∪ B] = 1 − Pr[A] − Pr[B] + Pr[A ∩ B] = 1 − Pr[A] − Pr[B] + Pr[A]Pr[B] = (1 − Pr[A])(1 − Pr[B]) = Pr[Ā]·Pr[B̄].\nFor A and B̄: Pr[A ∩ B̄] = Pr[A] − Pr[A ∩ B] = Pr[A](1 − Pr[B]) = Pr[A]·Pr[B̄]. ∎\n(Note the product-rule definition works even when some probability is 0; arguments via Pr[B̄ | A] = 1 − Pr[B | A] need Pr[A] > 0.)",
      },
    ],
    tags: ["independence", "proof"],
  },
  {
    id: "XP21",
    topic: "probability",
    kind: "compute",
    difficulty: 2,
    title: "First to roll a six",
    prompt:
      "Alice and Bob take turns rolling a fair die, Alice first. The first person to roll a 6 wins. What is the probability that Alice wins?",
    hints: [
      "If neither rolls a 6 in the first round, the game restarts in exactly the same state.",
      "Let p = Pr[Alice wins] and condition on the first round.",
    ],
    solutions: [
      {
        approach: "Condition on the first round",
        text:
          "Let p = Pr[Alice wins]. In round one: Alice rolls 6 with probability 1/6 (she wins). Otherwise, Bob rolls 6 with probability 1/6 (she loses). With probability (5/6)(5/6) = 25/36 nobody wins and the game restarts.\nSo p = 1/6 + (25/36)p, giving (11/36)p = 1/6, p = 36/66 = 6/11.",
      },
      {
        approach: "Geometric series",
        text:
          "Alice wins on her k-th roll iff the first 2(k − 1) rolls are not 6 and her k-th roll is 6: probability (25/36)^{k−1}·(1/6).\np = Σ_{k≥1} (1/6)(25/36)^{k−1} = (1/6)/(1 − 25/36) = (1/6)·(36/11) = 6/11.",
      },
    ],
    tags: ["total probability", "geometric series"],
  },

  // ---------------- DIFFICULTY 3 ----------------
  {
    id: "XP22",
    topic: "probability",
    kind: "short",
    difficulty: 3,
    title: "An ace, or the ace of spades?",
    prompt:
      "Two cards are dealt from a shuffled standard deck. (a) Given that the hand contains at least one ace, what is the probability it contains two aces? (b) Given that the hand contains the ace of spades, what is the probability it contains two aces? Explain why (b) is larger.",
    hints: [
      "Count unordered 2-card hands: there are C(52,2) = 1326.",
      "For (a), hands with no ace number C(48,2) = 1128.",
      "For (b), the other card is uniform over the remaining 51 cards.",
    ],
    solutions: [
      {
        approach: "Counting hands",
        text:
          "(a) Hands with at least one ace: 1326 − 1128 = 198. Hands with two aces: C(4,2) = 6.\nPr = 6/198 = 1/33.\n(b) Hands containing A♠: 51 (choose the other card). Of these, 3 have another ace.\nPr = 3/51 = 1/17.\nWhy (b) is larger: \"at least one ace\" is mostly made up of hands with exactly one ace, and there are 4·48 = 192 of those against only 6 two-ace hands. Fixing a specific ace removes that 4-fold multiplicity for one-ace hands (48 of them) but each two-ace hand containing A♠ still qualifies, so the ratio improves from 6:192 to 3:48.",
      },
      {
        approach: "Conditional probability formulas",
        text:
          "(a) Pr[two aces] = 6/1326, Pr[at least one ace] = 198/1326, so Pr = 6/198 = 1/33.\n(b) Pr[A♠ in hand] = 2/52 = 1/26. Pr[A♠ and another ace] = 3/1326. Pr = (3/1326)/(51/1326) = 3/51 = 1/17.\nThe conditioning events have different sizes relative to the target, so naive reasoning (\"an ace is an ace\") fails; this is the card analogue of the two-children problem.",
      },
    ],
    tags: ["conditional", "cards", "trap"],
  },
  {
    id: "XP23",
    topic: "probability",
    kind: "proof",
    difficulty: 3,
    title: "A union bound for birthdays",
    prompt:
      "n people each pick a birthday independently and uniformly from m days. Prove that Pr[some two share a birthday] ≤ n(n − 1)/(2m). Use this to show that with 10 people and 365 days the probability is at most 9/73.",
    hints: [
      "Write the event as a union over pairs of people.",
      "For a fixed pair {i, j}, Pr[same birthday] = 1/m.",
      "Alternative: show Π(1 − a_k) ≥ 1 − Σ a_k for a_k ∈ [0, 1] by induction.",
    ],
    solutions: [
      {
        approach: "Union bound over pairs",
        text:
          "For each pair i < j let E_{ij} = people i and j share a birthday. Given i's birthday, j matches it with probability 1/m, so Pr[E_{ij}] = 1/m.\nThe event \"some two share\" is the union of the C(n,2) events E_{ij}. By the union bound,\nPr[∪ E_{ij}] ≤ Σ_{i<j} Pr[E_{ij}] = C(n,2)·(1/m) = n(n − 1)/(2m).\nFor n = 10, m = 365: 10·9/730 = 90/730 = 9/73. ∎",
      },
      {
        approach: "Complement and a product inequality",
        text:
          "Pr[all distinct] = Π_{k=0}^{n−1} (1 − k/m).\nLemma: for a_1, …, a_r ∈ [0,1], Π(1 − a_k) ≥ 1 − Σ a_k. Induction on r: r = 1 is equality. If it holds for r, then\nΠ_{k≤r+1}(1 − a_k) ≥ (1 − Σ_{k≤r} a_k)(1 − a_{r+1}) = 1 − Σ_{k≤r+1} a_k + a_{r+1}·Σ_{k≤r} a_k ≥ 1 − Σ_{k≤r+1} a_k.\n(The first step multiplies the inductive inequality by 1 − a_{r+1} ≥ 0; the last step drops a nonnegative term.)\nSo Pr[all distinct] ≥ 1 − Σ_{k=0}^{n−1} k/m = 1 − n(n − 1)/(2m) (if n − 1 > m some a_k exceeds 1, but then n(n − 1)/(2m) > 1 and the claim is trivial), and Pr[some shared] ≤ n(n − 1)/(2m). With n = 10, m = 365 this is 9/73. ∎",
      },
    ],
    tags: ["union bound", "birthday", "proof"],
  },
  {
    id: "XP24",
    topic: "probability",
    kind: "compute",
    difficulty: 3,
    title: "Two positive tests",
    prompt:
      "A condition affects 1 in 100 people. A test is positive with probability 9/10 for people with the condition and 1/10 for people without it. A person takes the test twice; given their true status, the two results are independent. Both results are positive. What is the probability they have the condition?",
    hints: [
      "Given D, Pr[both positive] = (9/10)^2; given D̄, it is (1/10)^2.",
      "Or update in two steps: after one positive test the probability is 1/12 (do the first Bayes step), then use that as the new prior.",
      "Note the two results are not independent unconditionally, only given the status.",
    ],
    solutions: [
      {
        approach: "Bayes with both results at once",
        text:
          "Let T₂ = both positive. Pr[T₂ | D] = 81/100, Pr[T₂ | D̄] = 1/100.\nPr[T₂] = (1/100)(81/100) + (99/100)(1/100) = 81/10000 + 99/10000 = 180/10000.\nPr[D | T₂] = 81/180 = 9/20.",
      },
      {
        approach: "Sequential updating",
        text:
          "After the first positive: Pr[D | T] = (1/100)(9/10) / [(1/100)(9/10) + (99/100)(1/10)] = 9/108 = 1/12.\nUse 1/12 as the new prior (valid by conditional independence given status):\nPr[D | both] = (1/12)(9/10) / [(1/12)(9/10) + (11/12)(1/10)] = 9/(9 + 11) = 9/20.\nOdds view: prior odds 1 : 99, each positive multiplies the odds by 9, giving 81 : 99 = 9 : 11, i.e. 9/20.",
      },
    ],
    tags: ["Bayes", "conditional independence"],
  },
  {
    id: "XP25",
    topic: "probability",
    kind: "compute",
    difficulty: 3,
    title: "A host with a favorite door",
    prompt:
      "Three doors, one prize placed uniformly. You pick door 1. The host knows where the prize is and always opens a goat door among doors 2 and 3, but whenever both are goats he always opens door 3. (a) Given the host opens door 3, what is the probability switching to door 2 wins? (b) Given he opens door 2, what is the probability switching wins? (c) What is the overall probability that the always-switch strategy wins?",
    hints: [
      "For each prize location, which door does the host open?",
      "Opening door 2 only happens in one prize location.",
      "For (c), use total probability over which door is opened, or just over the prize location.",
    ],
    solutions: [
      {
        approach: "Enumerate prize locations",
        text:
          "Prize at 1 (1/3): both 2 and 3 are goats, host opens 3.\nPrize at 2 (1/3): host must open 3.\nPrize at 3 (1/3): host must open 2.\n(a) Opened 3 happens for prize ∈ {1, 2}, total 2/3. Pr[prize at 2 | opened 3] = (1/3)/(2/3) = 1/2.\n(b) Opened 2 happens only when the prize is at 3, so switching wins with probability 1.\n(c) Pr[win] = Pr[open 3]·(1/2) + Pr[open 2]·1 = (2/3)(1/2) + (1/3)(1) = 2/3.\nSwitching is never worse than staying, and overall it still wins 2/3 of the time.",
      },
      {
        approach: "Bayes",
        text:
          "Let O₃ = host opens 3, P_k = prize at k. Pr[O₃ | P₁] = 1, Pr[O₃ | P₂] = 1, Pr[O₃ | P₃] = 0.\nPr[O₃] = 1/3 + 1/3 = 2/3, Pr[P₂ | O₃] = (1/3)/(2/3) = 1/2.\nPr[P₃ | O₂] = (1/3·1)/(1/3) = 1.\n(c) Always-switch wins iff the first pick is wrong: 2/3, regardless of the host's tie-breaking rule.",
      },
    ],
    tags: ["Monty Hall", "Bayes"],
  },
  {
    id: "XP26",
    topic: "probability",
    kind: "compute",
    difficulty: 3,
    title: "Only even rolls before the six",
    prompt:
      "A fair die is rolled repeatedly until the first 6 appears. Let E be the event that every roll (including the final 6) is even. (a) Find Pr[E]. (b) Find Pr[exactly one roll | E]. (c) Find E[number of rolls | E], and compare with the unconditional expectation 6.",
    hints: [
      "Compute Pr[E and the first 6 is on roll k]: the first k − 1 rolls are 2 or 4, then a 6.",
      "Sum a geometric series for Pr[E].",
      "Conditioning on E heavily favors short games; don't just assume each roll is \"a die rolled from {2, 4, 6}\" until 6.",
    ],
    solutions: [
      {
        approach: "Series over the stopping time",
        text:
          "Let N be the number of rolls. Pr[E ∩ {N = k}] = (2/6)^{k−1}·(1/6) = (1/3)^{k−1}·(1/6).\n(a) Pr[E] = Σ_{k≥1} (1/6)(1/3)^{k−1} = (1/6)/(1 − 1/3) = 1/4.\n(b) Pr[N = 1 | E] = (1/6)/(1/4) = 2/3.\n(c) Pr[N = k | E] = 4·(1/6)(1/3)^{k−1} = (2/3)(1/3)^{k−1}, a geometric distribution with success probability 2/3. So E[N | E] = 1/(2/3) = 3/2, far below the unconditional E[N] = 6.",
      },
      {
        approach: "Reduce to rolls that end or ruin the run",
        text:
          "Each roll is one of three types: 6 (prob 1/6, run ends with E true), odd (prob 1/2, E fails), or 2/4 (prob 1/3, run continues unchanged).\n(a) Ignore the continuing rolls: the outcome is decided by the first roll that is a 6 or odd, and that roll is a 6 with probability (1/6)/(1/6 + 1/2) = 1/4. So Pr[E] = 1/4.\n(b), (c) Pr[N = k | E] = Pr[E ∩ {N = k}]/Pr[E] = 4·(1/6)(1/3)^{k−1} = (2/3)(1/3)^{k−1}: geometric with success probability 2/3. So Pr[N = 1 | E] = 2/3 and E[N | E] = 3/2.\nTrap: the tempting model \"roll a die with faces 2, 4, 6 until a 6\" gives E = 3. It is wrong because conditioning on E also penalizes long runs: every extra roll is another chance to roll an odd number and leave E.",
      },
    ],
    tags: ["conditional", "trap", "geometric"],
  },
];
