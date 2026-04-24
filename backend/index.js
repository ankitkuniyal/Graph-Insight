const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Identity details - UPDATE THESE
const USER_ID = "ankitkuniyal";
const EMAIL_ID = "ak8214@srmist.edu.in";
const ROLL_NUMBER = "RA231103030104";

/**
 * Process the graph data according to SRM Challenge rules
 * @param {string[]} data - Array of "A->B" strings
 */
function processGraph(data) {
  const invalid_entries = [];
  const duplicate_edges = [];
  const ignored_edges = [];
  const edgeSet = new Set();

  const allNodes = new Set();
  const childToParent = new Map(); // child -> parent (enforces first parent rule)
  const adj = new Map(); // parent -> child[]

  const regex = /^[A-Z]->[A-Z]$/;

  // 1. Validation & Multi-Parent Filtering
  data.forEach((entry) => {
    if (!regex.test(entry)) {
      invalid_entries.push(entry);
      return;
    }

    const [p, c] = entry.split("->");

    // Rule: A->A is invalid
    if (p === c) {
      invalid_entries.push(entry);
      return;
    }

    // Rule: Duplicate edges reported once
    if (edgeSet.has(entry)) {
      if (!duplicate_edges.includes(entry)) {
        duplicate_edges.push(entry);
      }
      return;
    }

    edgeSet.add(entry);
    allNodes.add(p);
    allNodes.add(c);

    // Rule: Multi-parent case - First parent is valid, others ignored silently
    if (childToParent.has(c)) {
      if (!ignored_edges.includes(entry)) {
        ignored_edges.push(entry);
      }
      return;
    }

    childToParent.set(c, p);
    if (!adj.has(p)) adj.set(p, []);
    adj.get(p).push(c);
  });

  // 2. Identify Hierarchies
  const hierarchies = [];
  const processedNodes = new Set();

  // Strategy:
  // A. First find all legitimate roots (nodes with no parents)
  const roots = Array.from(allNodes)
    .filter((node) => !childToParent.has(node))
    .sort();

  roots.forEach((root) => {
    const hierarchy = analyzeComponent(root, adj);
    hierarchies.push(hierarchy);
    // Mark all nodes reachable from this root as processed
    markReachable(root, adj, processedNodes);
  });

  // B. Handle remaining components (these are pure cycles with no root)
  let remainingNodes = Array.from(allNodes)
    .filter((node) => !processedNodes.has(node))
    .sort();

  while (remainingNodes.length > 0) {
    // Rule: If no root exists, choose lexicographically smallest node
    const root = remainingNodes[0];

    // Since there's no root in this component, it MUST be cyclic
    hierarchies.push({
      root: root,
      tree: {},
      has_cycle: true,
    });

    // Mark the entire connected component (cycle) as processed
    markComponentProcessed(root, adj, childToParent, processedNodes);

    remainingNodes = Array.from(allNodes)
      .filter((node) => !processedNodes.has(node))
      .sort();
  }

  // 3. Summary Calculation
  const total_trees = hierarchies.filter((h) => !h.has_cycle).length;
  const total_cycles = hierarchies.filter((h) => h.has_cycle).length;

  let largest_tree_root = "";
  let maxDepth = -1;

  hierarchies.forEach((h) => {
    if (!h.has_cycle) {
      // Rule: pick largest depth. Tie-breaker: lexicographically smaller root.
      if (h.depth > maxDepth) {
        maxDepth = h.depth;
        largest_tree_root = h.root;
      } else if (h.depth === maxDepth) {
        if (!largest_tree_root || h.root < largest_tree_root) {
          largest_tree_root = h.root;
        }
      }
    }
  });

  return {
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: ROLL_NUMBER,
    hierarchies,
    invalid_entries,
    duplicate_edges,
    ignored_edges,
    summary: {
      total_trees,
      total_cycles,
      largest_tree_root,
    },
  };
}

/**
 * Analyze a component starting from a root
 */
function analyzeComponent(root, adj) {
  const visited = new Set();
  const path = new Set();
  let isCyclic = false;

  function detectCycle(u) {
    visited.add(u);
    path.add(u);
    const children = adj.get(u) || [];
    for (const v of children) {
      if (path.has(v)) {
        isCyclic = true;
        return;
      }
      if (!visited.has(v)) {
        detectCycle(v);
        if (isCyclic) return;
      }
    }
    path.delete(u);
  }

  detectCycle(root);

  // Rule: If cycle exists, tree: {}, has_cycle: true, NO depth
  if (isCyclic) {
    return {
      root: root,
      tree: {},
      has_cycle: true,
    };
  }

  // Rule: Depth = number of nodes in longest root-to-leaf path
  // Example: A->B->C is Depth 3
  const treeData = {};
  const depth = buildTree(root, adj, treeData);

  const finalTree = {};
  finalTree[root] = treeData;

  return {
    root: root,
    tree: finalTree,
    depth: depth,
  };
}

/**
 * Builds nested tree object and returns max depth (node count)
 */
function buildTree(u, adj, currentObj) {
  const children = (adj.get(u) || []).sort();
  if (children.length === 0) return 1;

  let maxChildDepth = 0;
  children.forEach((v) => {
    const nextObj = {};
    currentObj[v] = nextObj;
    const d = buildTree(v, adj, nextObj);
    maxChildDepth = Math.max(maxChildDepth, d);
  });

  return 1 + maxChildDepth;
}

function markReachable(u, adj, processed) {
  if (processed.has(u)) return;
  processed.add(u);
  (adj.get(u) || []).forEach((v) => markReachable(v, adj, processed));
}

function markComponentProcessed(u, adj, childToParent, processed) {
  const component = new Set();
  const explore = [u];
  while (explore.length > 0) {
    const node = explore.shift();
    if (component.has(node)) continue;
    component.add(node);
    processed.add(node);

    // Out-edges
    (adj.get(node) || []).forEach((v) => explore.push(v));
    // In-edge (we only have one parent per node)
    const p = childToParent.get(node);
    if (p) explore.push(p);
  }
}

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;
    if (!data || !Array.isArray(data)) {
      return res
        .status(400)
        .json({ error: "Invalid input. 'data' must be an array of strings." });
    }
    const result = processGraph(data);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
