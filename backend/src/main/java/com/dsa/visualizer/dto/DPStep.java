package com.dsa.visualizer.dto;

import java.util.ArrayList;
import java.util.List;

public class DPStep {
    private int[][] dpTable;
    // Changed from List<int[]> to List<List<Integer>> for better JSON serialization and type safety
    private List<List<Integer>> highlights;
    private String description;

    public DPStep(int[][] dpTable, List<List<Integer>> highlights, String description) {
        this.dpTable = dpTable; // Array cloning should be done by the caller (Service) to avoid overhead if already cloned
        // Create a defensive copy of the highlights list
        this.highlights = new ArrayList<>(highlights);
        this.description = description;
    }

    // Getters
    public int[][] getDpTable() { return dpTable; }
    public List<List<Integer>> getHighlights() { return highlights; }
    public String getDescription() { return description; }
}