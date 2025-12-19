package com.dsa.visualizer.dto;

import java.util.List;

public class DPStep {
    private int[][] dpTable;
    private List<int[]> highlights;
    private String description;

    public DPStep(int[][] dpTable, List<int[]> highlights, String description) {
        this.dpTable = dpTable.clone();
        this.highlights = List.copyOf(highlights);
        this.description = description;
    }

    // Getters
    public int[][] getDpTable() { return dpTable; }
    public List<int[]> getHighlights() { return highlights; }
    public String getDescription() { return description; }
}