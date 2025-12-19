package com.dsa.visualizer.service;

import org.springframework.stereotype.Service;
import java.util.*;
import com.dsa.visualizer.dto.TreeStep;
import com.dsa.visualizer.dto.TreeOperationStep;

@Service
public class TreeService {

    // Segment Tree
    public List<TreeStep> buildSegmentTree(int[] input) {
        List<TreeStep> steps = new ArrayList<>();
        int n = input.length;
        int[] tree = new int[4 * n];
        Arrays.fill(tree, 0);

        steps.add(new TreeStep(tree, List.of(), "Empty Tree"));
        build(input, tree, 0, n - 1, 1, steps);
        steps.add(new TreeStep(tree, List.of(), "Build Complete"));
        return steps;
    }

    private void build(int[] arr, int[] tree, int start, int end, int node, List<TreeStep> steps) {
        if (start == end) {
            tree[node] = arr[start];
            steps.add(new TreeStep(tree, List.of(node), "Leaf Node [" + start + "] = " + arr[start]));
            return;
        }
        int mid = (start + end) / 2;
        
        steps.add(new TreeStep(tree, List.of(node), "Splitting [" + start + "-" + end + "]"));
        
        build(arr, tree, start, mid, 2 * node, steps);
        build(arr, tree, mid + 1, end, 2 * node + 1, steps);
        
        tree[node] = tree[2 * node] + tree[2 * node + 1];
        steps.add(new TreeStep(tree, List.of(node, 2*node, 2*node+1), "Merging Sum: " + tree[node]));
    }

    public int querySegmentTree(int[] tree, int n, int left, int right) {
        return query(tree, 0, n-1, left, right, 1);
    }

    private int query(int[] tree, int start, int end, int left, int right, int node) {
        if (right < start || end < left) return 0;
        if (left <= start && end <= right) return tree[node];
        int mid = (start + end) / 2;
        return query(tree, start, mid, left, right, 2*node) + query(tree, mid+1, end, left, right, 2*node+1);
    }

    public void updateSegmentTree(int[] tree, int n, int index, int value) {
        update(tree, 0, n-1, index, value, 1);
    }

    private void update(int[] tree, int start, int end, int index, int value, int node) {
        if (start == end) {
            tree[node] = value;
            return;
        }
        int mid = (start + end) / 2;
        if (index <= mid) update(tree, start, mid, index, value, 2*node);
        else update(tree, mid+1, end, index, value, 2*node+1);
        tree[node] = tree[2*node] + tree[2*node+1];
    }

    // BST
    static class BSTNode {
        int val;
        BSTNode left, right;
        BSTNode(int val) { this.val = val; }
    }

    public List<TreeOperationStep> bstInsert(int[] values) {
        List<TreeOperationStep> steps = new ArrayList<>();
        BSTNode root = null;
        for (int val : values) {
            root = insertBST(root, val, steps);
        }
        return steps;
    }

    private BSTNode insertBST(BSTNode node, int val, List<TreeOperationStep> steps) {
        if (node == null) {
            steps.add(new TreeOperationStep(List.of(), "Inserting " + val + " as new node", null, val));
            return new BSTNode(val);
        }
        if (val < node.val) {
            steps.add(new TreeOperationStep(List.of(), "Going left from " + node.val, null, node.val));
            node.left = insertBST(node.left, val, steps);
        } else {
            steps.add(new TreeOperationStep(List.of(), "Going right from " + node.val, null, node.val));
            node.right = insertBST(node.right, val, steps);
        }
        return node;
    }

    // Similar for delete and search, but keeping simple for now

    // AVL Tree (basic insert with rotations)
    // This is complex, so placeholder

    // B-Tree placeholder
}