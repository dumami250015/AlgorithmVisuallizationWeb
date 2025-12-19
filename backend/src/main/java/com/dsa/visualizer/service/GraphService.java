package com.dsa.visualizer.service;

import org.springframework.stereotype.Service;
import java.util.*;
import com.dsa.visualizer.dto.GraphNode;
import com.dsa.visualizer.dto.GraphEdge;
import com.dsa.visualizer.dto.GraphResponse;
import com.dsa.visualizer.dto.GraphStep;

@Service
public class GraphService {

    private final List<GraphNode> nodes = new ArrayList<>();
    private final List<GraphEdge> edges = new ArrayList<>();
    
    public GraphService() {
        // Init a fixed graph layout for visualization
        nodes.add(new GraphNode(0, 100, 100)); // Top Left
        nodes.add(new GraphNode(1, 300, 50));  // Top Right
        nodes.add(new GraphNode(2, 100, 300)); // Bottom Left
        nodes.add(new GraphNode(3, 300, 300)); // Bottom Right
        nodes.add(new GraphNode(4, 200, 175)); // Center
        nodes.add(new GraphNode(5, 400, 175)); // Far Right

        edges.add(new GraphEdge(0, 1, 4));
        edges.add(new GraphEdge(0, 2, 2));
        edges.add(new GraphEdge(1, 4, 3));
        edges.add(new GraphEdge(2, 3, 5));
        edges.add(new GraphEdge(2, 4, 1));
        edges.add(new GraphEdge(4, 3, 8));
        edges.add(new GraphEdge(1, 5, 2));
        edges.add(new GraphEdge(3, 5, 6));
    }

    public GraphResponse getGraphAlgo(String type) {
        return getGraphAlgo(type, nodes, edges);
    }

    public GraphResponse getGraphAlgo(String type, List<GraphNode> customNodes, List<GraphEdge> customEdges) {
        List<GraphStep> steps = new ArrayList<>();
        switch(type.toLowerCase()) {
            case "bfs": runBFS(0, customNodes, customEdges, steps); break;
            case "dfs": runDFS(0, customNodes, customEdges, steps); break;
            case "dijkstra": runDijkstra(0, customNodes, customEdges, steps); break;
            case "kruskal": runKruskal(customNodes, customEdges, steps); break;
            case "bellmanford": runBellmanFord(0, customNodes, customEdges, steps); break;
            case "floydwarshall": runFloydWarshall(customNodes, customEdges, steps); break;
            case "prim": runPrim(customNodes, customEdges, steps); break;
            case "topological": runTopologicalSort(customNodes, customEdges, steps); break;
        }
        return new GraphResponse(customNodes, customEdges, steps);
    }

    private void runBFS(int start, List<GraphNode> nodes, List<GraphEdge> edges, List<GraphStep> steps) {
        Queue<Integer> queue = new LinkedList<>();
        Set<Integer> visited = new HashSet<>();
        queue.add(start);
        visited.add(start);
        
        steps.add(new GraphStep(new ArrayList<>(visited), new ArrayList<>(), new HashMap<>(), "Start BFS at 0"));

        while(!queue.isEmpty()) {
            int u = queue.poll();
            
            for(GraphEdge e : edges) {
                // Check both directions for undirected graph visual
                int v = -1;
                if(e.source == u) v = e.target;
                else if(e.target == u) v = e.source;

                if(v != -1 && !visited.contains(v)) {
                    visited.add(v);
                    queue.add(v);
                    steps.add(new GraphStep(new ArrayList<>(visited), List.of(List.of(u, v)), new HashMap<>(), "Visiting " + v));
                }
            }
        }
    }

    private void runDFS(int start, List<GraphNode> nodes, List<GraphEdge> edges, List<GraphStep> steps) {
        Stack<Integer> stack = new Stack<>();
        Set<Integer> visited = new HashSet<>();
        stack.push(start);
        
        while(!stack.isEmpty()) {
            int u = stack.pop();
            if(!visited.contains(u)) {
                visited.add(u);
                steps.add(new GraphStep(new ArrayList<>(visited), new ArrayList<>(), new HashMap<>(), "Visited " + u));
                
                for(GraphEdge e : edges) {
                    if(e.source == u && !visited.contains(e.target)) stack.push(e.target);
                    if(e.target == u && !visited.contains(e.source)) stack.push(e.source);
                }
            }
        }
    }

    private void runDijkstra(int start, List<GraphNode> nodes, List<GraphEdge> edges, List<GraphStep> steps) {
        Map<Integer, Integer> dist = new HashMap<>();
        for(GraphNode n : nodes) dist.put(n.id, Integer.MAX_VALUE);
        dist.put(start, 0);

        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
        pq.add(new int[]{start, 0});
        
        List<Integer> visited = new ArrayList<>();
        Map<Integer, String> labels = new HashMap<>();
        labels.put(start, "0");

        steps.add(new GraphStep(visited, new ArrayList<>(), labels, "Init Distances"));

        while(!pq.isEmpty()) {
            int[] curr = pq.poll();
            int u = curr[0];
            int d = curr[1];

            if(d > dist.get(u)) continue;
            visited.add(u);

            for(GraphEdge e : edges) {
                int v = -1; 
                if(e.source == u) v = e.target;
                else if(e.target == u) v = e.source;

                if(v != -1) {
                    int newDist = d + e.weight;
                    if(newDist < dist.get(v)) {
                        dist.put(v, newDist);
                        labels.put(v, String.valueOf(newDist));
                        pq.add(new int[]{v, newDist});
                        steps.add(new GraphStep(visited, List.of(List.of(u, v)), new HashMap<>(labels), "Relaxing edge to " + v));
                    }
                }
            }
        }
    }

    private void runKruskal(List<GraphNode> nodes, List<GraphEdge> edges, List<GraphStep> steps) {
        List<GraphEdge> sortedEdges = new ArrayList<>(edges);
        sortedEdges.sort(Comparator.comparingInt(a -> a.weight));
        
        List<List<Integer>> mstEdges = new ArrayList<>();
        int[] parent = new int[nodes.size()];
        for(int i=0; i<parent.length; i++) parent[i] = i;

        for(GraphEdge e : sortedEdges) {
            steps.add(new GraphStep(new ArrayList<>(), new ArrayList<>(mstEdges), new HashMap<>(), "Checking edge " + e.source + "-" + e.target + " w:" + e.weight));
            
            int setU = find(parent, e.source);
            int setV = find(parent, e.target);

            if(setU != setV) {
                mstEdges.add(List.of(e.source, e.target));
                union(parent, setU, setV);
                steps.add(new GraphStep(new ArrayList<>(), new ArrayList<>(mstEdges), new HashMap<>(), "Added to MST"));
            }
        }
    }
    
    private int find(int[] parent, int i) {
        if (parent[i] == i) return i;
        return find(parent, parent[i]);
    }
    private void union(int[] parent, int x, int y) {
        int xroot = find(parent, x);
        int yroot = find(parent, y);
        parent[xroot] = yroot;
    }

    private void runBellmanFord(int start, List<GraphNode> nodes, List<GraphEdge> edges, List<GraphStep> steps) {
        Map<Integer, Integer> dist = new HashMap<>();
        for(GraphNode n : nodes) dist.put(n.id, Integer.MAX_VALUE);
        dist.put(start, 0);

        Map<Integer, String> labels = new HashMap<>();
        labels.put(start, "0");
        steps.add(new GraphStep(new ArrayList<>(), new ArrayList<>(), labels, "Init Distances"));

        for(int i=0; i<nodes.size()-1; i++) {
            for(GraphEdge e : edges) {
                int u = e.source, v = e.target;
                if(dist.get(u) != Integer.MAX_VALUE && dist.get(u) + e.weight < dist.get(v)) {
                    dist.put(v, dist.get(u) + e.weight);
                    labels.put(v, String.valueOf(dist.get(v)));
                    steps.add(new GraphStep(new ArrayList<>(), List.of(List.of(u, v)), new HashMap<>(labels), "Relaxing edge " + u + "-" + v));
                }
            }
        }
    }

    private void runFloydWarshall(List<GraphNode> nodes, List<GraphEdge> edges, List<GraphStep> steps) {
        int n = nodes.size();
        int[][] dist = new int[n][n];
        for(int i=0; i<n; i++) Arrays.fill(dist[i], Integer.MAX_VALUE/2);
        for(int i=0; i<n; i++) dist[i][i] = 0;
        for(GraphEdge e : edges) {
            dist[e.source][e.target] = e.weight;
            dist[e.target][e.source] = e.weight; // undirected
        }

        for(int k=0; k<n; k++) {
            for(int i=0; i<n; i++) {
                for(int j=0; j<n; j++) {
                    if(dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        steps.add(new GraphStep(new ArrayList<>(), List.of(List.of(i, k), List.of(k, j)), new HashMap<>(), "Updating path " + i + "-" + j + " via " + k));
                    }
                }
            }
        }
    }

    private void runPrim(List<GraphNode> nodes, List<GraphEdge> edges, List<GraphStep> steps) {
        int n = nodes.size();
        boolean[] visited = new boolean[n];
        int[] key = new int[n];
        Arrays.fill(key, Integer.MAX_VALUE);
        key[0] = 0;

        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
        pq.add(new int[]{0, 0});

        List<List<Integer>> mstEdges = new ArrayList<>();

        while(!pq.isEmpty()) {
            int[] curr = pq.poll();
            int u = curr[0];
            if(visited[u]) continue;
            visited[u] = true;

            for(GraphEdge e : edges) {
                int v = -1;
                if(e.source == u) v = e.target;
                else if(e.target == u) v = e.source;
                if(v != -1 && !visited[v] && e.weight < key[v]) {
                    key[v] = e.weight;
                    pq.add(new int[]{v, key[v]});
                    mstEdges.add(List.of(u, v));
                    steps.add(new GraphStep(new ArrayList<>(), new ArrayList<>(mstEdges), new HashMap<>(), "Adding edge to MST"));
                }
            }
        }
    }

    private void runTopologicalSort(List<GraphNode> nodes, List<GraphEdge> edges, List<GraphStep> steps) {
        // Assume directed graph for topological sort
        Map<Integer, List<Integer>> adj = new HashMap<>();
        int[] indegree = new int[nodes.size()];
        for(GraphEdge e : edges) {
            adj.computeIfAbsent(e.source, k -> new ArrayList<>()).add(e.target);
            indegree[e.target]++;
        }

        Queue<Integer> q = new LinkedList<>();
        for(int i=0; i<nodes.size(); i++) if(indegree[i] == 0) q.add(i);

        List<Integer> order = new ArrayList<>();
        while(!q.isEmpty()) {
            int u = q.poll();
            order.add(u);
            steps.add(new GraphStep(order, new ArrayList<>(), new HashMap<>(), "Processing node " + u));
            for(int v : adj.getOrDefault(u, new ArrayList<>())) {
                indegree[v]--;
                if(indegree[v] == 0) q.add(v);
            }
        }
    }
}