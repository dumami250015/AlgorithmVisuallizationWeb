package com.dsa.visualizer.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.LinkedList;

import org.springframework.stereotype.Service;

import com.dsa.visualizer.dto.TreeOperationStep;
import com.dsa.visualizer.dto.TreeStep;

@Service
public class TreeService {

    // --- SEGMENT TREE ---
    public List<TreeStep> buildSegmentTree(int[] input) {
        return buildSegmentTree(input, "sum");
    }

    public List<TreeStep> buildSegmentTree(int[] input, String type) {
        List<TreeStep> steps = new ArrayList<>();
        int n = input.length;
        int[] tree = new int[4 * n];
        int neutral = 0;
        if (type.equalsIgnoreCase("min")) neutral = Integer.MAX_VALUE;
        else if (type.equalsIgnoreCase("max")) neutral = Integer.MIN_VALUE;
        Arrays.fill(tree, neutral);

        steps.add(new TreeStep(tree, List.of(), "Empty Tree"));
        build(input, tree, 0, n - 1, 1, steps, type);
        steps.add(new TreeStep(tree, List.of(), "Build Complete (" + type + ")"));
        return steps;
    }

    private void build(int[] arr, int[] tree, int start, int end, int node, List<TreeStep> steps, String type) {
        if (start == end) {
            tree[node] = arr[start];
            steps.add(new TreeStep(tree, List.of(node), "Leaf Node [" + start + "] = " + arr[start]));
            return;
        }
        int mid = (start + end) / 2;
        steps.add(new TreeStep(tree, List.of(node), "Splitting [" + start + "-" + end + "]"));
        build(arr, tree, start, mid, 2 * node, steps, type);
        build(arr, tree, mid + 1, end, 2 * node + 1, steps, type);
        
        if (type.equalsIgnoreCase("min")) {
            tree[node] = Math.min(tree[2 * node], tree[2 * node + 1]);
            steps.add(new TreeStep(tree, List.of(node, 2*node, 2*node+1), "Min(" + tree[2*node] + ", " + tree[2*node+1] + ") = " + tree[node]));
        } else if (type.equalsIgnoreCase("max")) {
            tree[node] = Math.max(tree[2 * node], tree[2 * node + 1]);
            steps.add(new TreeStep(tree, List.of(node, 2*node, 2*node+1), "Max(" + tree[2*node] + ", " + tree[2*node+1] + ") = " + tree[node]));
        } else {
            tree[node] = tree[2 * node] + tree[2 * node + 1];
            steps.add(new TreeStep(tree, List.of(node, 2*node, 2*node+1), "Sum(" + tree[2*node] + " + " + tree[2*node+1] + ") = " + tree[node]));
        }
    }

    // --- HEAPS ---
    public List<TreeStep> buildHeap(int[] input, String type) {
        List<TreeStep> steps = new ArrayList<>();
        int n = input.length;
        int[] heap = new int[n + 1]; 
        for (int i = 0; i < n; i++) heap[i + 1] = input[i];

        steps.add(new TreeStep(heap, List.of(), "Initial Array"));

        for (int i = n / 2; i >= 1; i--) {
            heapify(heap, n, i, steps, type);
        }
        steps.add(new TreeStep(heap, List.of(), "Heap Build Complete (" + type + ")"));
        return steps;
    }

    private void heapify(int[] heap, int n, int i, List<TreeStep> steps, String type) {
        int target = i; 
        int left = 2 * i;
        int right = 2 * i + 1;
        boolean isMin = type.equalsIgnoreCase("min");

        steps.add(new TreeStep(heap, List.of(i), "Heapify at index " + i));

        if (left <= n) {
            boolean condition = isMin ? (heap[left] < heap[target]) : (heap[left] > heap[target]);
            if (condition) target = left;
        }

        if (right <= n) {
            boolean condition = isMin ? (heap[right] < heap[target]) : (heap[right] > heap[target]);
            if (condition) target = right;
        }

        if (target != i) {
            int temp = heap[i];
            heap[i] = heap[target];
            heap[target] = temp;
            steps.add(new TreeStep(heap, List.of(i, target), "Swap " + heap[i] + " and " + heap[target]));
            heapify(heap, n, target, steps, type);
        }
    }

    // --- LOWEST COMMON ANCESTOR (Arbitrary Graph Input) ---
    public List<TreeStep> findLCA(List<List<Integer>> edges, int n1, int n2) {
        List<TreeStep> steps = new ArrayList<>();
        
        // 1. Build Adjacency List
        Map<Integer, List<Integer>> adj = new HashMap<>();
        // Also track all nodes to find root (node with no parent)
        Map<Integer, Integer> parentMap = new HashMap<>(); 
        int root = -1;
        
        for (List<Integer> edge : edges) {
            int u = edge.get(0);
            int v = edge.get(1);
            adj.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
            parentMap.put(v, u);
            if (!parentMap.containsKey(u)) root = u; // potential root
        }
        
        // Verify root (trace up from any node)
        if (root == -1 && !edges.isEmpty()) root = edges.get(0).get(0);
        while (parentMap.containsKey(root)) {
            root = parentMap.get(root);
        }

        // 2. Map arbitrary tree to Array Representation (1-based index) for Visualization
        // We use BFS to assign array indices: Root -> 1. Children -> 2*i, 2*i+1
        // Note: This only works well for Binary Trees. If a node has > 2 children, visualization breaks.
        // We assume input is Binary Tree for this visualizer limitation.
        Map<Integer, Integer> nodeToArrayIdx = new HashMap<>();
        Map<Integer, Integer> arrayIdxToNode = new HashMap<>();
        
        // Use a safe large size for sparse tree visualization
        int[] treeArray = new int[64]; 
        
        Queue<Integer> q = new LinkedList<>();
        Queue<Integer> idxQ = new LinkedList<>();
        
        q.add(root);
        idxQ.add(1);
        
        while(!q.isEmpty()) {
            int curr = q.poll();
            int idx = idxQ.poll();
            
            // Auto-resize if needed (simple approach)
            if (idx >= treeArray.length) {
                treeArray = Arrays.copyOf(treeArray, Math.max(idx * 2, treeArray.length * 2));
            }
            
            treeArray[idx] = curr;
            nodeToArrayIdx.put(curr, idx);
            arrayIdxToNode.put(idx, curr);
            
            if (adj.containsKey(curr)) {
                List<Integer> children = adj.get(curr);
                // Assign Left/Right based on order in input
                if (children.size() > 0) {
                    q.add(children.get(0));
                    idxQ.add(2 * idx);
                }
                if (children.size() > 1) {
                    q.add(children.get(1));
                    idxQ.add(2 * idx + 1);
                }
            }
        }

        steps.add(new TreeStep(treeArray, List.of(), "Tree Built from Edges. Root: " + root));

        // 3. Find LCA Logic (using parent pointers from input map)
        if (!parentMap.containsKey(n1) && n1 != root) {
             steps.add(new TreeStep(treeArray, List.of(), "Node " + n1 + " not in tree"));
             return steps;
        }
        if (!parentMap.containsKey(n2) && n2 != root) {
             steps.add(new TreeStep(treeArray, List.of(), "Node " + n2 + " not in tree"));
             return steps;
        }

        List<Integer> path1 = new ArrayList<>();
        int curr = n1;
        while (curr != root) {
            path1.add(curr);
            curr = parentMap.get(curr);
        }
        path1.add(root);
        Collections.reverse(path1); // Root -> n1

        List<Integer> path2 = new ArrayList<>();
        curr = n2;
        while (curr != root) {
            path2.add(curr);
            curr = parentMap.get(curr);
        }
        path2.add(root);
        Collections.reverse(path2); // Root -> n2

        // Highlight paths
        List<Integer> path1Indices = path1.stream().map(nodeToArrayIdx::get).toList();
        List<Integer> path2Indices = path2.stream().map(nodeToArrayIdx::get).toList();
        
        steps.add(new TreeStep(treeArray, path1Indices, "Path to " + n1));
        steps.add(new TreeStep(treeArray, path2Indices, "Path to " + n2));

        // Find mismatch
        int lca = root;
        for (int i = 0; i < Math.min(path1.size(), path2.size()); i++) {
            if (path1.get(i).equals(path2.get(i))) {
                lca = path1.get(i);
            } else {
                break;
            }
        }

        steps.add(new TreeStep(treeArray, List.of(nodeToArrayIdx.get(lca)), "LCA is " + lca));
        
        return steps;
    }

    // Stubs
    public int querySegmentTree(int[] tree, int n, int left, int right) { return 0; }
    public void updateSegmentTree(int[] tree, int n, int index, int value) {}
    public List<TreeOperationStep> bstInsert(int[] values) { return new ArrayList<>(); }
    
    // Kept for backward compatibility if needed, though now using graph logic
    public List<TreeStep> findLCA(int[] values, int n1, int n2) { return new ArrayList<>(); }
}