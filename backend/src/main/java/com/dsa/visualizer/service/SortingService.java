package com.dsa.visualizer.service;

import org.springframework.stereotype.Service;
import java.util.*;
import com.dsa.visualizer.dto.SortStep;

@Service
public class SortingService {

    // --- SORTING ALGORITHMS ---

    public List<SortStep> getSteps(String type, int[] array) {
        switch(type.toLowerCase()) {
            case "bubble": return bubbleSort(array);
            case "insertion": return insertionSort(array);
            case "selection": return selectionSort(array);
            case "merge": return mergeSort(array);
            case "quick": return quickSort(array);
            default: return new ArrayList<>();
        }
    }

    private List<SortStep> bubbleSort(int[] inputArr) {
        List<SortStep> steps = new ArrayList<>();
        int[] arr = inputArr.clone();
        int n = arr.length;
        
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                steps.add(new SortStep(arr, List.of(j, j+1), "Comparing"));
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp;
                    steps.add(new SortStep(arr, List.of(j, j+1), "Swap"));
                }
            }
        }
        steps.add(new SortStep(arr, List.of(), "Sorted"));
        return steps;
    }

    private List<SortStep> insertionSort(int[] inputArr) {
        List<SortStep> steps = new ArrayList<>();
        int[] arr = inputArr.clone();
        int n = arr.length;

        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            steps.add(new SortStep(arr, List.of(i), "Current Key: " + key));

            while (j >= 0 && arr[j] > key) {
                steps.add(new SortStep(arr, List.of(j, j+1), "Shifting " + arr[j]));
                arr[j + 1] = arr[j];
                j = j - 1;
                steps.add(new SortStep(arr, List.of(j+1), "Shifted"));
            }
            arr[j + 1] = key;
            steps.add(new SortStep(arr, List.of(j+1), "Inserted Key"));
        }
        return steps;
    }

    private List<SortStep> selectionSort(int[] inputArr) {
        List<SortStep> steps = new ArrayList<>();
        int[] arr = inputArr.clone();
        int n = arr.length;

        for (int i = 0; i < n - 1; i++) {
            int min_idx = i;
            for (int j = i + 1; j < n; j++) {
                steps.add(new SortStep(arr, List.of(min_idx, j), "Finding Minimum"));
                if (arr[j] < arr[min_idx])
                    min_idx = j;
            }
            int temp = arr[min_idx]; arr[min_idx] = arr[i]; arr[i] = temp;
            steps.add(new SortStep(arr, List.of(i, min_idx), "Swapping Minimum"));
        }
        return steps;
    }

    // Merge Sort Helpers
    private List<SortStep> mergeSort(int[] inputArr) {
        List<SortStep> steps = new ArrayList<>();
        int[] arr = inputArr.clone();
        mergeSortRecursive(arr, 0, arr.length - 1, steps);
        return steps;
    }

    private void mergeSortRecursive(int[] arr, int l, int r, List<SortStep> steps) {
        if (l < r) {
            int m = l + (r - l) / 2;
            mergeSortRecursive(arr, l, m, steps);
            mergeSortRecursive(arr, m + 1, r, steps);
            merge(arr, l, m, r, steps);
        }
    }

    private void merge(int[] arr, int l, int m, int r, List<SortStep> steps) {
        int n1 = m - l + 1;
        int n2 = r - m;
        int[] L = new int[n1];
        int[] R = new int[n2];

        for (int i = 0; i < n1; ++i) L[i] = arr[l + i];
        for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];

        int i = 0, j = 0;
        int k = l;
        while (i < n1 && j < n2) {
            steps.add(new SortStep(arr, List.of(k), "Merging index " + k));
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }
        while (i < n1) {
            arr[k] = L[i];
            i++; k++;
            steps.add(new SortStep(arr, List.of(k-1), "Copying remaining L"));
        }
        while (j < n2) {
            arr[k] = R[j];
            j++; k++;
            steps.add(new SortStep(arr, List.of(k-1), "Copying remaining R"));
        }
    }

    // Quick Sort Helpers
    private List<SortStep> quickSort(int[] inputArr) {
        List<SortStep> steps = new ArrayList<>();
        int[] arr = inputArr.clone();
        quickSortRecursive(arr, 0, arr.length - 1, steps);
        return steps;
    }

    private void quickSortRecursive(int[] arr, int low, int high, List<SortStep> steps) {
        if (low < high) {
            int pi = partition(arr, low, high, steps);
            quickSortRecursive(arr, low, pi - 1, steps);
            quickSortRecursive(arr, pi + 1, high, steps);
        }
    }

    private int partition(int[] arr, int low, int high, List<SortStep> steps) {
        int pivot = arr[high];
        int i = (low - 1);
        steps.add(new SortStep(arr, List.of(high), "Pivot: " + pivot));
        
        for (int j = low; j < high; j++) {
            steps.add(new SortStep(arr, List.of(j, high), "Comparing with Pivot"));
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
                steps.add(new SortStep(arr, List.of(i, j), "Swapping smaller element"));
            }
        }
        int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
        steps.add(new SortStep(arr, List.of(i+1, high), "Placing Pivot"));
        return i + 1;
    }
}