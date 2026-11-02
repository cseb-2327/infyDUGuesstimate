package com.infosys.controller;

import com.infosys.entity.Revenue;
import com.infosys.dto.GraphDTO;
import com.infosys.service.RevenueService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/revenue")
@CrossOrigin
public class RevenueController {
    private final RevenueService service;

    public RevenueController(RevenueService service) {
        this.service = service;
    }

    @GetMapping("/{lob}/{year}")
    public ResponseEntity<List<Revenue>> getAllQuartersRevenue(
            @PathVariable String lob, @PathVariable int year) {
        return ResponseEntity.ok(service.getAllQuarterRevenue(lob, year));
    }

    @GetMapping("/{lob}/{year}/{quarter}")
    public ResponseEntity<Revenue> getQuarterRevenue(
            @PathVariable String lob, @PathVariable int year,
            @PathVariable String quarter) {
        return ResponseEntity.ok(service.getQuarterRevenue(lob, year, quarter));
    }

    @GetMapping("/year")
    public ResponseEntity<List<GraphDTO>> getYearRevenue() {
        return ResponseEntity.ok(service.getYearRevenue());
    }
}
