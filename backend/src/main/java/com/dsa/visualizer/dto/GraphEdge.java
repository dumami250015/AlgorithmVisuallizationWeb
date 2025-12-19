package com.dsa.visualizer.dto;

public class GraphEdge { 
    public int source; 
    public int target; 
    public int weight; 

    public GraphEdge(int s, int t, int w) {
        this.source = s;
        this.target = t;
        this.weight = w;
    }
}
