package com.dsa.visualizer.service;

import org.springframework.stereotype.Service;
import java.util.*;
import com.dsa.visualizer.dto.SearchStep;

@Service
public class SearchService {

    public List<SearchStep> linearSearch(int[] array, int target) {
        List<SearchStep> steps = new ArrayList<>();
        int comparisons = 0;
        for (int i = 0; i < array.length; i++) {
            comparisons++;
            steps.add(new SearchStep(array, List.of(i), "Checking index " + i + " (value: " + array[i] + ")", comparisons));
            if (array[i] == target) {
                steps.add(new SearchStep(array, List.of(i), "Found target at index " + i, comparisons));
                return steps;
            }
        }
        steps.add(new SearchStep(array, List.of(), "Target not found", comparisons));
        return steps;
    }

    public List<SearchStep> binarySearch(int[] array, int target) {
        List<SearchStep> steps = new ArrayList<>();
        int left = 0, right = array.length - 1;
        int comparisons = 0;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            comparisons++;
            steps.add(new SearchStep(array, List.of(mid), "Checking mid index " + mid + " (value: " + array[mid] + ")", comparisons));
            if (array[mid] == target) {
                steps.add(new SearchStep(array, List.of(mid), "Found target at index " + mid, comparisons));
                return steps;
            } else if (array[mid] < target) {
                left = mid + 1;
                steps.add(new SearchStep(array, List.of(mid), "Target > mid, search right half", comparisons));
            } else {
                right = mid - 1;
                steps.add(new SearchStep(array, List.of(mid), "Target < mid, search left half", comparisons));
            }
        }
        steps.add(new SearchStep(array, List.of(), "Target not found", comparisons));
        return steps;
    }
}