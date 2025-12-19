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

        for(int i=0; i<=n; i++) {
            for(int w=0; w<=capacity; w++) {
                if(i==0 || w==0) dp[i][w] = 0;
                else if(weights[i-1] <= w) {
                    dp[i][w] = Math.max(values[i-1] + dp[i-1][w - weights[i-1]], dp[i-1][w]);
                } else {
                    dp[i][w] = dp[i-1][w];
                }
                steps.add(new DPStep(dp, List.of(new int[]{i, w}), "Filling dp[" + i + "][" + w + "] = " + dp[i][w]));
            }
        }
        return steps;
    }

    public List<DPStep> lcs(String s1, String s2) {
        List<DPStep> steps = new ArrayList<>();
        int m = s1.length(), n = s2.length();
        int[][] dp = new int[m+1][n+1];

        for(int i=0; i<=m; i++) {
            for(int j=0; j<=n; j++) {
                if(i==0 || j==0) dp[i][j] = 0;
                else if(s1.charAt(i-1) == s2.charAt(j-1)) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                }
                steps.add(new DPStep(dp, List.of(new int[]{i, j}), "dp[" + i + "][" + j + "] = " + dp[i][j]));
            }
        }
        return steps;
    }

    public List<DPStep> matrixChain(int[] dims) {
        List<DPStep> steps = new ArrayList<>();
        int n = dims.length - 1;
        int[][] dp = new int[n][n];

        for(int len=2; len<=n; len++) {
            for(int i=0; i<n-len+1; i++) {
                int j = i + len - 1;
                dp[i][j] = Integer.MAX_VALUE;
                for(int k=i; k<j; k++) {
                    int cost = dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1];
                    if(cost < dp[i][j]) dp[i][j] = cost;
                }
                steps.add(new DPStep(dp, List.of(new int[]{i, j}), "dp[" + i + "][" + j + "] = " + dp[i][j]));
            }
        }
        return steps;
    }
}