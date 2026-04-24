# Graph Insight - SRM Full Stack Engineering Challenge

A high-performance full-stack application designed to parse, validate, and dynamically visualize directed acyclic/cyclic graphs from user inputs. Built to exceed standard API evaluation metrics with premium UI design and strictly compliant backend logic.

## 🌟 Key Features

### Backend (`/backend`)

- **Fast Express/Node.js API Endpoint**: Listens at `POST /bfhl`.
- **Advanced Graph Engine**:
  - Validates `A->B` string formats and flags invalid entries.
  - Automatically deduplicates edges.
  - Enforces the single-parent strict hierarchy rule (tracks multi-parent connections as `ignored_edges`).
  - Detects cyclic components algorithmically and separates them perfectly from standard hierarchies.
  - Extracts the exact maximum depth (nodes in longest path) and accurately identifies the largest tree.
  - Resolves ties via lexicographical ordering.

### Frontend (`/frontend`)

- **Premium Glassmorphic UI**: High-end enterprise aesthetics built with Next.js, Framer Motion, and CSS Grid.
- **Dynamic Input Parsing**: Can handle strict JSON (`{"data": ["A->B"]}`) OR automatically parses quick comma-separated/newline-separated strings.
- **Visual Dashboard**: Beautiful SVG-style connected trees using pixel-perfect CSS rendering.
- **Strict Evaluator Mode**: A toggle button allows users to switch from the graphical dashboard directly to the raw `JSON Response` logs to prove API structure compliance. Includes a one-click "Copy JSON" feature.

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server runs on `https://graph-insight-rk97.vercel.app`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend Next.js app runs on `https://graph-insight.vercel.app`.

## 🧪 Testing the API

You can test the exact challenge inputs via the UI or by sending a CURL request:

```bash
curl -X POST https://graph-insight-rk97.vercel.app/bfhl \
-H "Content-Type: application/json" \
-d '{"data": ["A->B", "A->C", "B->D"]}'
```

## 📐 Architecture Decisions

- **Bento Grid System**: Used for maximum screen efficiency to show input, summary metrics, and validation logs at a glance.
- **L-Shaped Tree Nodes**: Instead of a simple bulleted list or a heavy D3.js library, I hand-coded a robust recursive `TreeNode` component that mathematically aligns border lines to simulate a professional IDE file tree.
- **Error Handling UX**: Explicit validation log badges (Invalid, Duplicate, Ignored) are surfaced cleanly below the hierarchy data so that missing data doesn't silently break the graph.

---

_Built for the Bajaj Finserv Hackathon (SRM Campus)._
