package com.dsa.visualizer.dto;

import java.util.List;

public class TreeOperationStep {
    private List<Integer> highlights;
    private String description;
    private int[] treeState; // for segment tree
    private Object treeStructure; // for BST, etc.

    public TreeOperationStep(List<Integer> highlights, String description, int[] treeState, Object treeStructure) {
        this.highlights = List.copyOf(highlights);
        this.description = description;
        this.treeState = treeState != null ? treeState.clone() : null;
        this.treeStructure = treeStructure;
    }

    // Getters
    public List<Integer> getHighlights() { return highlights; }
    public String getDescription() { return description; }
    public int[] getTreeState() { return treeState; }
    public Object getTreeStructure() { return treeStructure; }
}