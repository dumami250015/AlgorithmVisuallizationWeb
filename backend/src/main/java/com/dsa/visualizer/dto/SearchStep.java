package com.dsa.visualizer.dto;

import java.util.List;

public class SearchStep {
    private int[] arrayState;
    private List<Integer> highlights;
    private String description;
    private int comparisons;

    public SearchStep(int[] array, List<Integer> highlights, String description, int comparisons) {
        this.arrayState = array.clone();
        this.highlights = List.copyOf(highlights);
        this.description = description;
        this.comparisons = comparisons;
    }

    // Getters
    public int[] getArrayState() { return arrayState; }
    public List<Integer> getHighlights() { return highlights; }
    public String getDescription() { return description; }
    public int getComparisons() { return comparisons; }
}