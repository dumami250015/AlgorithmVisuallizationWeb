package com.dsa.visualizer.dto;

import java.util.List;
import java.util.ArrayList;

public class SortStep {
    private int[] arrayState;       // The array at this specific moment
    private List<Integer> highlights; // Indices to highlight (e.g., red for comparison)
    private String description;     // "Swapping 5 and 3"

    public SortStep(int[] array, List<Integer> highlights, String description) {
        this.arrayState = array.clone(); // IMPORTANT: Clone to save snapshot, not reference
        this.highlights = new ArrayList<>(highlights);
        this.description = description;
    }

    public int[] getArrayState() { return arrayState; }
    public List<Integer> getHighlights() { return highlights; }
    public String getDescription() { return description; }
}
