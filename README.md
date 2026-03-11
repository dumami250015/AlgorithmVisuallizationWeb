<p align="center">
  <h1 align="center">🧠 DSA.Viz — Algorithm Visualization Platform</h1>
  <p align="center">
    An interactive web application for visualizing Data Structures & Algorithms step-by-step.
    <br />
    Built with <strong>React 19</strong> + <strong>Vite 7</strong> on the frontend and <strong>Spring Boot 3</strong> (Java 17) on the backend.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white" alt="Java" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License" />
</p>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Supported Algorithms](#-supported-algorithms)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#-api-reference)
- [Usage Guide](#-usage-guide)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About the Project

**DSA.Viz** is a full-stack web application designed to help students and developers understand how common Data Structures and Algorithms work through rich, **step-by-step animated visualizations**. Each algorithm execution is broken down into discrete steps on the server, sent back as JSON, and then animated on the client — allowing users to play, pause, step forward/backward, and control the animation speed.

The platform covers **five major algorithm categories**: Sorting, Searching, Graph Algorithms, Tree Data Structures, and Dynamic Programming — making it a comprehensive learning companion for any DSA course.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎬 **Step-by-step Animation** | Play, pause, resume, step forward/backward through each algorithm's execution |
| ⚡ **Speed Control** | Adjustable animation speed via slider (10ms – 500ms per step) |
| ✏️ **Custom Input** | Enter your own arrays, graphs (edge lists), and DP parameters |
| 📊 **Bar Chart Sorting** | Sorting algorithms visualized as animated bar charts with highlighted comparisons |
| 🕸️ **Interactive Graph Canvas** | HTML5 Canvas-based graph visualization with drag-to-reposition nodes and force-directed layout |
| 🌳 **SVG Tree Rendering** | Tree structures rendered with SVG, including zoom, pan, and auto-focus controls |
| 📐 **DP Table View** | Dynamic programming tables with highlighted active cells as the algorithm progresses |
| 📱 **Responsive Design** | Fully responsive layout with mobile hamburger menu sidebar |
| 🎨 **Modern UI** | Clean, premium Indigo/Slate color scheme with smooth transitions and shadow effects |

---

## 📚 Supported Algorithms

### 🔄 Sorting
| Algorithm | Time Complexity (Avg) | Space |
|---|---|---|
| Bubble Sort | O(n²) | O(1) |
| Insertion Sort | O(n²) | O(1) |
| Selection Sort | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(log n) |

### 🔍 Searching
| Algorithm | Time Complexity | Space |
|---|---|---|
| Linear Search | O(n) | O(1) |
| Binary Search | O(log n) | O(1) |

### 🕸️ Graph Algorithms
| Algorithm | Description |
|---|---|
| BFS | Breadth-First Search traversal |
| DFS | Depth-First Search traversal |
| Dijkstra | Shortest path (non-negative weights) |
| Bellman-Ford | Shortest path (handles negative weights) |
| Floyd-Warshall | All-pairs shortest paths |
| Kruskal | Minimum Spanning Tree |
| Prim | Minimum Spanning Tree |
| Topological Sort | DAG ordering |

### 🌳 Tree Data Structures
| Structure / Algorithm | Description |
|---|---|
| Sum Segment Tree | Range sum queries with build visualization |
| Min Segment Tree | Range minimum queries |
| Max Segment Tree | Range maximum queries |
| Min Heap | Min-heap construction and heapify |
| Max Heap | Max-heap construction and heapify |
| Lowest Common Ancestor (LCA) | Find LCA of two nodes in a tree |
| BST Insert | Binary Search Tree insertion |

### 📐 Dynamic Programming
| Problem | Description |
|---|---|
| 0/1 Knapsack | Classic knapsack with customizable weights, values, and capacity |
| Longest Common Subsequence (LCS) | Find LCS of two strings with DP table visualization |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19.2 | UI component library |
| [Vite](https://vite.dev/) | 7.2 | Build tool & dev server |
| [Axios](https://axios-http.com/) | 1.13 | HTTP client for API calls |
| [ESLint](https://eslint.org/) | 9.39 | Code linting |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| [Spring Boot](https://spring.io/projects/spring-boot) | 3.5.9 | REST API framework |
| [Java (OpenJDK)](https://openjdk.org/) | 17 | Runtime |
| [Maven](https://maven.apache.org/) | (wrapper included) | Build & dependency management |

---

## 📁 Project Structure

```
AlgoVisu/
├── frontend/                          # React + Vite frontend
│   ├── index.html                     # Entry HTML
│   ├── package.json                   # Node dependencies & scripts
│   ├── vite.config.js                 # Vite configuration
│   ├── eslint.config.js               # ESLint configuration
│   └── src/
│       ├── main.jsx                   # React entry point
│       ├── App.jsx                    # Main app component (all visualizers)
│       ├── App.css                    # App-level styles
│       └── index.css                  # Global styles
│
├── backend/                           # Spring Boot backend
│   ├── pom.xml                        # Maven configuration
│   ├── mvnw / mvnw.cmd               # Maven wrapper scripts
│   └── src/main/java/com/dsa/visualizer/
│       ├── DemoApplication.java       # Spring Boot entry point
│       ├── config/
│       │   └── CorsConfig.java        # CORS configuration
│       ├── controller/
│       │   └── AlgoController.java    # REST API endpoints
│       ├── service/
│       │   ├── SortingService.java    # Sorting algorithm logic
│       │   ├── SearchService.java     # Search algorithm logic
│       │   ├── GraphService.java      # Graph algorithm logic
│       │   ├── TreeService.java       # Tree data structure logic
│       │   └── DPService.java         # Dynamic programming logic
│       └── dto/
│           ├── SortStep.java          # Sorting step data model
│           ├── SearchStep.java        # Search step data model
│           ├── GraphStep.java         # Graph step data model
│           ├── GraphResponse.java     # Graph API response wrapper
│           ├── GraphNode.java         # Graph node DTO
│           ├── GraphEdge.java         # Graph edge DTO
│           ├── TreeStep.java          # Tree step data model
│           ├── TreeOperationStep.java # Tree operation step model
│           └── DPStep.java            # DP step data model
│
└── README.md                          # This file
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed on your system:

- **Java 17+** — [Download OpenJDK](https://adoptium.net/)
- **Node.js 18+** — [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)

> **Note:** Maven is **not** required to be installed globally — the project includes a Maven wrapper (`mvnw` / `mvnw.cmd`).

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Build and run the Spring Boot application:**

   **Windows:**
   ```cmd
   mvnw.cmd spring-boot:run
   ```

   **macOS / Linux:**
   ```bash
   ./mvnw spring-boot:run
   ```

3. The backend API will start on **`http://localhost:8080`**.

   Verify it's running by visiting:
   ```
   http://localhost:8080/api/algo/complexity/bubble
   ```
   You should see:
   ```json
   {"time":"O(n²)","space":"O(1)"}
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to **`http://localhost:5173`**.

> ⚠️ **Important:** The backend must be running on port `8080` before using the frontend, as it makes API calls to `http://localhost:8080/api/algo`.

---

## 📡 API Reference

All endpoints are prefixed with `/api/algo`.

### Sorting
| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/sort/{type}` | `int[]` (JSON array) | Run sorting algorithm. `type`: `bubble`, `insertion`, `selection`, `merge`, `quick` |

### Searching
| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/search/{type}` | `{ "array": [...], "target": N }` | Run search. `type`: `linear`, `binary` |

### Graph
| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/graph/{type}` | `{ "nodes": [...], "edges": [...] }` | Run graph algorithm. `type`: `bfs`, `dfs`, `dijkstra`, `kruskal`, `bellmanford`, `floydwarshall`, `prim`, `topological` |

### Tree
| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/tree/build/{type}` | `int[]` | Build tree. `type`: `sum`, `min`, `max`, `heap-min`, `heap-max` |
| `POST` | `/tree/lca` | `{ "edges": [[u,v],...], "n1": N, "n2": N }` | Find Lowest Common Ancestor |
| `POST` | `/tree/bst/insert` | `int[]` | BST insertion |

### Dynamic Programming
| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/dp/knapsack` | `{ "weights": [...], "values": [...], "capacity": N }` | 0/1 Knapsack |
| `POST` | `/dp/lcs` | `{ "s1": "...", "s2": "..." }` | Longest Common Subsequence |

### Metadata
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/complexity/{type}` | Get time & space complexity info |

---

## 🎮 Usage Guide

### Sorting Visualizer
1. **Generate** a random array or enter comma-separated values in the custom input box
2. **Select** a sorting algorithm from the dropdown
3. Click **Play** to start the animation
4. Use **◀ / ▶** buttons to step through manually, or **Pause/Resume** during playback
5. Adjust the **Speed** slider to control animation speed
6. Click **Restart** to replay from the beginning

### Graph Visualizer
1. Click **Custom Graph** to enter your own graph via edge list format:
   ```
   0 1 5
   1 2 3
   2 0 10
   ```
   *(Format: `source target weight`, one edge per line)*
2. Click **Generate** to build the graph with automatic force-directed layout
3. **Drag nodes** to reposition them for a better view
4. Select an algorithm (BFS, DFS, Dijkstra, etc.) and click **Run**

### Tree Visualizer
1. Select a tree type (Segment Tree, Heap, or LCA)
2. Enter a comma-separated array of values (or edge list for LCA)
3. Click **Build** (or **Find LCA**) to visualize
4. Use **Zoom +/-** buttons or scroll wheel to zoom in/out
5. **Click and drag** to pan across the tree
6. Toggle **Auto Focus** to automatically center on highlighted nodes

### Dynamic Programming
1. Select a DP problem (Knapsack or LCS)
2. Enter the problem parameters (weights/values/capacity or two strings)
3. Click **Run** to generate the DP table
4. Use **Prev/Next** buttons to step through the table-filling process

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. **Commit** your changes:
   ```bash
   git commit -m "Add some feature"
   ```
4. **Push** to the branch:
   ```bash
   git push origin feature/my-new-feature
   ```
5. **Open** a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ for learning Data Structures & Algorithms
</p>
