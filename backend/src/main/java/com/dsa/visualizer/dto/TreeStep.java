package com.dsa.visualizer.dto;

import java.util.ArrayList;
import java.util.List;

public class TreeStep {
    public int[] treeArray;
    public List<Integer> highlights;
    public String description;

    public TreeStep(int[] t, List<Integer> h, String d) {
        this.treeArray = t != null ? t.clone() : null;
        this.highlights = new ArrayList<>(h);
        this.description = d;
    }
}
