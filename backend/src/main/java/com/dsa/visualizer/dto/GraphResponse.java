package com.dsa.visualizer.dto;

import java.util.List;

public class GraphResponse {
    public List<GraphNode> nodes;
    public List<GraphEdge> edges;
    public List<GraphStep> steps;

    public GraphResponse(List<GraphNode> n, List<GraphEdge> e, List<GraphStep> s) {
        this.nodes = n; this.edges = e; this.steps = s;
    }
}
