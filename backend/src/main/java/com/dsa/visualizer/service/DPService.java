package com.dsa.visualizer.service;

import org.springframework.stereotype.Service;
import java.util.*;
import com.dsa.visualizer.dto.DPStep;

@Service
public class DPService {

    public List<DPStep> knapsack(int[] weights, int[] values, int capacity) {
        List<DPStep> steps = new ArrayList<>();
        int n = weights.length;
        int[][] dp = new int[n+1][capacity+1];

        // Initial state
        steps.add(new DPStep(copyTable(dp), new ArrayList<>(), "Initialize table"));

        for(int i=0; i<=n; i++) {
            for(int w=0; w<=capacity; w++) {
                List<List<Integer>> highlights = new ArrayList<>();
                if(i==0 || w==0) {
                    dp[i][w] = 0;
                    highlights.add(List.of(i, w));
                    steps.add(new DPStep(copyTable(dp), highlights, "Base case: dp[" + i + "][" + w + "] = 0"));
                }
                else if(weights[i-1] <= w) {
                    int include = values[i-1] + dp[i-1][w - weights[i-1]];
                    int exclude = dp[i-1][w];
                    dp[i][w] = Math.max(include, exclude);
                    
                    highlights.add(List.of(i, w));
                    highlights.add(List.of(i-1, w)); // Exclude dependency
                    highlights.add(List.of(i-1, w-weights[i-1])); // Include dependency
                    
                    String formula = "dp[" + i + "][" + w + "] = max(val[" + (i-1) + "] + dp[" + (i-1) + "][" + (w - weights[i-1]) + "], dp[" + (i-1) + "][" + w + "])";
                    String calc = "max(" + values[i-1] + " + " + dp[i-1][w-weights[i-1]] + ", " + dp[i-1][w] + ") = " + dp[i][w];
                    steps.add(new DPStep(copyTable(dp), highlights, formula + " -> " + calc));
                } else {
                    dp[i][w] = dp[i-1][w];
                    highlights.add(List.of(i, w));
                    highlights.add(List.of(i-1, w));
                    
                    String formula = "dp[" + i + "][" + w + "] = dp[" + (i-1) + "][" + w + "]";
                    String calc = "= " + dp[i][w];
                    steps.add(new DPStep(copyTable(dp), highlights, formula + " -> " + calc));
                }
            }
        }
        return steps;
    }

    public List<DPStep> lcs(String s1, String s2) {
        List<DPStep> steps = new ArrayList<>();
        int m = s1.length(), n = s2.length();
        int[][] dp = new int[m+1][n+1];

        steps.add(new DPStep(copyTable(dp), new ArrayList<>(), "Initialize table"));

        for(int i=0; i<=m; i++) {
            for(int j=0; j<=n; j++) {
                List<List<Integer>> highlights = new ArrayList<>();
                if(i==0 || j==0) {
                    dp[i][j] = 0;
                    highlights.add(List.of(i, j));
                    steps.add(new DPStep(copyTable(dp), highlights, "Base case: dp[" + i + "][" + j + "] = 0"));
                }
                else if(s1.charAt(i-1) == s2.charAt(j-1)) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                    highlights.add(List.of(i, j));
                    highlights.add(List.of(i-1, j-1));
                    
                    String formula = "s1[" + (i-1) + "] == s2[" + (j-1) + "] ('" + s1.charAt(i-1) + "') -> dp[" + i + "][" + j + "] = 1 + dp[" + (i-1) + "][" + (j-1) + "]";
                    String calc = "1 + " + dp[i-1][j-1] + " = " + dp[i][j];
                    steps.add(new DPStep(copyTable(dp), highlights, formula + " -> " + calc));
                } else {
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                    highlights.add(List.of(i, j));
                    highlights.add(List.of(i-1, j));
                    highlights.add(List.of(i, j-1));
                    
                    String formula = "s1[" + (i-1) + "] != s2[" + (j-1) + "] -> dp[" + i + "][" + j + "] = max(dp[" + (i-1) + "][" + j + "], dp[" + i + "][" + (j-1) + "])";
                    String calc = "max(" + dp[i-1][j] + ", " + dp[i][j-1] + ") = " + dp[i][j];
                    steps.add(new DPStep(copyTable(dp), highlights, formula + " -> " + calc));
                }
            }
        }
        return steps;
    }

    private int[][] copyTable(int[][] source) {
        int[][] dest = new int[source.length][];
        for(int i = 0; i < source.length; i++) {
            dest[i] = source[i].clone();
        }
        return dest;
    }
}