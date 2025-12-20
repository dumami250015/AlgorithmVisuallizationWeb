package com.dsa.visualizer.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Set;
import java.util.Stack;

import org.springframework.stereotype.Service;

import com.dsa.visualizer.dto.GraphEdge;
import com.dsa.visualizer.dto.GraphNode;
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
        if (customNodes == null || customNodes.isEmpty()) {
            return new GraphResponse(new ArrayList<>(), new ArrayList<>(), steps);
        }
        // Build a set of valid node ids
        Set<Integer> nodeIds = new HashSet<>();
        for (GraphNode n : customNodes) nodeIds.add(n.id);
        int startId = customNodes.get(0).id;
        
        switch(type.toLowerCase()) {
            case "bfs": runBFS(startId, customNodes, customEdges, steps, nodeIds); break;
            case "dfs": runDFS(startId, customNodes, customEdges, steps, nodeIds); break;
            case "dijkstra": runDijkstra(startId, customNodes, customEdges, steps, nodeIds); break;
            case "kruskal": runKruskal(customNodes, customEdges, steps); break;
            case "bellmanford": runBellmanFord(startId, customNodes, customEdges, steps, nodeIds); break;
            case "floydwarshall": runFloydWarshall(customNodes, customEdges, steps, nodeIds); break;
            case "prim": runPrim(customNodes, customEdges, steps, nodeIds); break;
            case "topological": runTopologicalSort(customNodes, customEdges, steps, nodeIds); break;
        }
        return new GraphResponse(customNodes, customEdges, steps);
    }

    private void runBFS(int start, List<GraphNode> nodes, List<GraphEdge> edges, List<GraphStep> steps, Set<Integer> nodeIds) {
        Queue<Integer> queue = new LinkedList<>();
        Set<Integer> visited = new HashSet<>();
        queue.add(start);
        visited.add(start);
        steps.add(new GraphStep(new ArrayList<>(visited), new ArrayList<>(), new HashMap<>(), "Start BFS at " + start));
        while(!queue.isEmpty()) {
            int u = queue.poll();
            for(GraphEdge e : edges) {
                int v = -1;
                if(e.source == u && nodeIds.contains(e.target)) v = e.target;
                else if(e.target == u && nodeIds.contains(e.source)) v = e.source; // Treat undirected for BFS traversal visual
                if(v != -1 && !visited.contains(v)) {
                    visited.add(v);
                    queue.add(v);
                    steps.add(new GraphStep(new ArrayList<>(visited), List.of(List.of(u, v)), new HashMap<>(), "Visiting " + v));
                }
            }
        }
    }
    private void runDFS(int start, List<GraphNode> nodes, List<GraphEdge> edges, List<GraphStep> steps, Set<Integer> nodeIds) {
        Stack<Integer> stack = new Stack<>();
        Set<Integer> visited = new HashSet<>();
        stack.push(start);
        while(!stack.isEmpty()) {
            int u = stack.pop();
            if(!visited.contains(u)) {
                visited.add(u);
                steps.add(new GraphStep(new ArrayList<>(visited), new ArrayList<>(), new HashMap<>(), "Visited " + u));
                for(GraphEdge e : edges) {
                    if(e.source == u && nodeIds.contains(e.target) && !visited.contains(e.target)) stack.push(e.target);
                    if(e.target == u && nodeIds.contains(e.source) && !visited.contains(e.source)) stack.push(e.source);
                }
            }
        }
    }
    private void runDijkstra(int start, List<GraphNode> nodes, List<GraphEdge> edges, List<GraphStep> steps, Set<Integer> nodeIds) {
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
            if(!visited.contains(u)) visited.add(u);
            for(GraphEdge e : edges) {
                int v = -1;
                if(e.source == u && nodeIds.contains(e.target)) v = e.target;
                else if(e.target == u && nodeIds.contains(e.source)) v = e.source;
                if(v != -1 && dist.get(u) != Integer.MAX_VALUE && dist.get(u) + e.weight < dist.get(v)) {
                    dist.put(v, dist.get(u) + e.weight);
                    pq.add(new int[]{v, dist.get(v)});
                    labels.put(v, String.valueOf(dist.get(v)));
                    steps.add(new GraphStep(new ArrayList<>(visited), List.of(List.of(u, v)), new HashMap<>(labels), "Update dist for " + v));
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
        if (i >= parent.length) return i; // Safety
        if (parent[i] == i) return i;
        return find(parent, parent[i]);
    }
    private void union(int[] parent, int x, int y) {
        int xroot = find(parent, x);
        int yroot = find(parent, y);
        parent[xroot] = yroot;
    }

    private void runBellmanFord(int start, List<GraphNode> nodes, List<GraphEdge> edges, List<GraphStep> steps, Set<Integer> nodeIds) {
        Map<Integer, Integer> dist = new HashMap<>();
        for(GraphNode n : nodes) dist.put(n.id, Integer.MAX_VALUE);
        dist.put(start, 0);
        Map<Integer, String> labels = new HashMap<>();
        labels.put(start, "0");
        steps.add(new GraphStep(new ArrayList<>(), new ArrayList<>(), new HashMap<>(labels), "Init Distances"));
        int nNodes = nodes.size();
        for(int i=1; i<nNodes; i++) {
            boolean changed = false;
            for(GraphEdge e : edges) {
                int u = e.source, v = e.target;
                if(nodeIds.contains(u) && nodeIds.contains(v) && dist.get(u) != Integer.MAX_VALUE && dist.get(u) + e.weight < dist.get(v)) {
                    dist.put(v, dist.get(u) + e.weight);
                    labels.put(v, String.valueOf(dist.get(v)));
                    steps.add(new GraphStep(new ArrayList<>(), List.of(List.of(u, v)), new HashMap<>(labels), "Relax edge " + u + "->" + v));
                    changed = true;
                }
            }
            if(!changed) break;
        }
    }
    private void runFloydWarshall(List<GraphNode> nodes, List<GraphEdge> edges, List<GraphStep> steps, Set<Integer> nodeIds) {
        int n = nodes.size();
        Map<Integer, Integer> idToIdx = new HashMap<>();
        Map<Integer, Integer> idxToId = new HashMap<>();
        for (int i = 0; i < n; i++) {
            idToIdx.put(nodes.get(i).id, i);
            idxToId.put(i, nodes.get(i).id);
        }
        int[][] dist = new int[n][n];
        for(int[] row : dist) Arrays.fill(row, 99999); // Use finite infinity for FW addition
        for(int i=0; i<n; i++) dist[i][i] = 0;
        for(GraphEdge e : edges) {
            Integer u = idToIdx.get(e.source), v = idToIdx.get(e.target);
            if(u != null && v != null) dist[u][v] = e.weight;
        }
        for(int k=0; k<n; k++) {
            for(int i=0; i<n; i++) {
                for(int j=0; j<n; j++) {
                    if(dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        // Limit steps for performance on large graphs
                        if (steps.size() < 200) {
                            steps.add(new GraphStep(new ArrayList<>(), List.of(List.of(idxToId.get(i), idxToId.get(k)), List.of(idxToId.get(k), idxToId.get(j))), new HashMap<>(), "Updating path " + idxToId.get(i) + "-" + idxToId.get(j)));
                        }
                    }
                }
            }
        }
    }
    private void runPrim(List<GraphNode> nodes, List<GraphEdge> edges, List<GraphStep> steps, Set<Integer> nodeIds) {
        if(nodes.isEmpty()) return;
        int start = nodes.get(0).id;
        Map<Integer, Boolean> visited = new HashMap<>();
        Map<Integer, Integer> key = new HashMap<>();
        for(GraphNode node : nodes) {
            visited.put(node.id, false);
            key.put(node.id, Integer.MAX_VALUE);
        }
        key.put(start, 0);
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
        pq.add(new int[]{start, 0});
        List<List<Integer>> mstEdges = new ArrayList<>();
        
        while(!pq.isEmpty()) {
            int[] curr = pq.poll();
            int u = curr[0];
            if(visited.get(u)) continue;
            visited.put(u, true);
            // Visualization step for visiting node
            steps.add(new GraphStep(new ArrayList<>(mstEdges.stream().map(l->l.get(1)).toList()), new ArrayList<>(mstEdges), new HashMap<>(), "Visited " + u));

            for(GraphEdge e : edges) {
                int v = -1;
                if(e.source == u && nodeIds.contains(e.target)) v = e.target;
                else if(e.target == u && nodeIds.contains(e.source)) v = e.source;
                if(v != -1 && !visited.get(v) && e.weight < key.get(v)) {
                    key.put(v, e.weight);
                    pq.add(new int[]{v, key.get(v)});
                    // This is simplified; normally Prim tracks parent to build edges. 
                    // For viz, we just highlight current selection logic
                }
            }
        }
    }
    private void runTopologicalSort(List<GraphNode> nodes, List<GraphEdge> edges, List<GraphStep> steps, Set<Integer> nodeIds) {
        Map<Integer, List<Integer>> adj = new HashMap<>();
        Map<Integer, Integer> indegree = new HashMap<>();
        for(GraphNode n : nodes) indegree.put(n.id, 0);
        for(GraphEdge e : edges) {
            if(nodeIds.contains(e.source) && nodeIds.contains(e.target)) {
                adj.computeIfAbsent(e.source, k -> new ArrayList<>()).add(e.target);
                indegree.put(e.target, indegree.get(e.target) + 1);
            }
        }
        Queue<Integer> q = new LinkedList<>();
        for(Integer id : nodeIds) if(indegree.get(id) == 0) q.add(id);
        List<Integer> order = new ArrayList<>();
        while(!q.isEmpty()) {
            int u = q.poll();
            order.add(u);
            steps.add(new GraphStep(new ArrayList<>(order), new ArrayList<>(), new HashMap<>(), "Processing node " + u));
            if(adj.containsKey(u)) {
                for(int v : adj.get(u)) {
                    indegree.put(v, indegree.get(v) - 1);
                    if(indegree.get(v) == 0) q.add(v);
                }
            }
        }
    }
}