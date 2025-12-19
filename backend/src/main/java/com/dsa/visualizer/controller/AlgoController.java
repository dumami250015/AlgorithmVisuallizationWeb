package com.dsa.visualizer.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;
import com.dsa.visualizer.service.SortingService;
import com.dsa.visualizer.service.GraphService;
import com.dsa.visualizer.service.TreeService;
import com.dsa.visualizer.service.SearchService;
import com.dsa.visualizer.service.DPService;
import com.dsa.visualizer.dto.SortStep;
import com.dsa.visualizer.dto.GraphResponse;
import com.dsa.visualizer.dto.TreeStep;
import com.dsa.visualizer.dto.SearchStep;
import com.dsa.visualizer.dto.TreeOperationStep;
import com.dsa.visualizer.dto.DPStep;
import com.dsa.visualizer.dto.GraphNode;
import com.dsa.visualizer.dto.GraphEdge;

// We can reuse SortStep class from the previous file or define it here if creating a new project
// Assuming SortStep, GraphResponse, TreeStep are visible (in same package)

@RestController
@RequestMapping("/api/algo")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class AlgoController {

    private final SortingService sortService;
    private final GraphService graphService;
    private final TreeService treeService;
    private final SearchService searchService;
    private final DPService dpService;

    public AlgoController(SortingService s, GraphService g, TreeService t, SearchService se, DPService d) {
        this.sortService = s;
        this.graphService = g;
        this.treeService = t;
        this.searchService = se;
        this.dpService = d;
    }

    // --- SORTING ---
    @PostMapping("/sort/{type}")
    public List<SortStep> getSort(@PathVariable String type, @RequestBody int[] array) {
        return sortService.getSteps(type, array);
    }

    // --- GRAPH ---
    @PostMapping("/graph/{type}")
    public GraphResponse getGraph(@PathVariable String type, @RequestBody(required = false) Map<String, Object> payload) {
        if (payload == null || !payload.containsKey("nodes") || !payload.containsKey("edges")) {
            // Use default graph
            return graphService.getGraphAlgo(type);
        }
        // Parse custom graph
        List<Map<String, Object>> nodeMaps = (List<Map<String, Object>>) payload.get("nodes");
        List<Map<String, Object>> edgeMaps = (List<Map<String, Object>>) payload.get("edges");
        
        List<GraphNode> customNodes = nodeMaps.stream()
            .map(m -> new GraphNode(
                ((Number) m.get("id")).intValue(),
                ((Number) m.get("x")).intValue(),
                ((Number) m.get("y")).intValue()
            ))
            .collect(Collectors.toList());
            
        List<GraphEdge> customEdges = edgeMaps.stream()
            .map(m -> new GraphEdge(
                ((Number) m.get("source")).intValue(),
                ((Number) m.get("target")).intValue(),
                ((Number) m.get("weight")).intValue()
            ))
            .collect(Collectors.toList());
            
        return graphService.getGraphAlgo(type, customNodes, customEdges);
    }

    // --- TREE ---
    @PostMapping("/tree/build")
    public List<TreeStep> getTreeBuild(@RequestBody int[] array) {
        return treeService.buildSegmentTree(array);
    }

    @GetMapping("/tree/query")
    public int getTreeQuery(@RequestParam int[] tree, @RequestParam int n, @RequestParam int left, @RequestParam int right) {
        return treeService.querySegmentTree(tree, n, left, right);
    }

    @PostMapping("/tree/update")
    public void updateTree(@RequestParam int[] tree, @RequestParam int n, @RequestParam int index, @RequestParam int value) {
        treeService.updateSegmentTree(tree, n, index, value);
    }

    @PostMapping("/tree/bst/insert")
    public List<TreeOperationStep> bstInsert(@RequestBody int[] values) {
        return treeService.bstInsert(values);
    }

    // --- SEARCH ---
    @PostMapping("/search/{type}")
    public List<SearchStep> getSearch(@PathVariable String type, @RequestBody Map<String, Object> payload) {
        List<Integer> list = (List<Integer>) payload.get("array");
        int[] array = list.stream().mapToInt(Integer::intValue).toArray();
        int target = (Integer) payload.get("target");
        switch(type.toLowerCase()) {
            case "linear": return searchService.linearSearch(array, target);
            case "binary": return searchService.binarySearch(array, target);
            default: return new ArrayList<>();
        }
    }

    // --- DP ---
    @PostMapping("/dp/knapsack")
    public List<DPStep> knapsack(@RequestBody Map<String, Object> payload) {
        int[] weights = (int[]) payload.get("weights");
        int[] values = (int[]) payload.get("values");
        int capacity = (int) payload.get("capacity");
        return dpService.knapsack(weights, values, capacity);
    }

    @PostMapping("/dp/lcs")
    public List<DPStep> lcs(@RequestBody Map<String, Object> payload) {
        String s1 = (String) payload.get("s1");
        String s2 = (String) payload.get("s2");
        return dpService.lcs(s1, s2);
    }

    @PostMapping("/dp/matrixchain")
    public List<DPStep> matrixChain(@RequestBody int[] dims) {
        return dpService.matrixChain(dims);
    }

    // --- METADATA ---
    @GetMapping("/complexity/{type}")
    public Map<String, String> getComplexity(@PathVariable String type) {
        Map<String, String> info = new HashMap<>();
        switch(type.toLowerCase()) {
            case "bubble": info.put("time", "O(n²)"); info.put("space", "O(1)"); break;
            case "linearsearch": info.put("time", "O(n)"); info.put("space", "O(1)"); break;
            // Add more
            default: info.put("time", "Unknown"); info.put("space", "Unknown");
        }
        return info;
    }

    @ExceptionHandler(Exception.class)
    public Map<String, String> handleException(Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        return error;
    }
}