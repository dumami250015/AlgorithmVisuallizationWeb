package com.dsa.visualizer.dto;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

public class GraphStep {
    public List<Integer> visitedNodes;
    public List<List<Integer>> highlightedEdges; // [source, target] pairs
    public Map<Integer, String> nodeLabels; // e.g. Distances
    public String description;

    public GraphStep(List<Integer> v, List<List<Integer>> e, Map<Integer, String> l, String d) {
        this.visitedNodes = new ArrayList<>(v);
        this.highlightedEdges = new ArrayList<>(e);
        this.nodeLabels = new HashMap<>(l);
        this.description = d;
    }
}
