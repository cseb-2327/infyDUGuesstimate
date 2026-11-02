package com.infosys.controller;

import com.infosys.dto.GraphDTO;
import com.infosys.service.VolumeService;
import com.infosys.service.RevenueService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/graph")
@CrossOrigin
public class GraphController {
    private final VolumeService volumeService;
    private final RevenueService revenueService;

    public GraphController(VolumeService volumeService, RevenueService revenueService) {
        this.volumeService = volumeService;
        this.revenueService = revenueService;
    }

    @GetMapping("/year-volume")
    public ResponseEntity<List<GraphDTO>> getYearVolume() {
        return ResponseEntity.ok(volumeService.getYearVolume());
    }

    @GetMapping("/year-revenue")
    public ResponseEntity<List<GraphDTO>> getYearRevenue() {
        return ResponseEntity.ok(revenueService.getYearRevenue());
    }
}
