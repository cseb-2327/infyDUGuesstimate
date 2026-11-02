package com.infosys.controller;

import com.infosys.entity.Volume;
import com.infosys.dto.GraphDTO;
import com.infosys.service.VolumeService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/volume")
@CrossOrigin
public class VolumeController {
    private final VolumeService service;

    public VolumeController(VolumeService service) {
        this.service = service;
    }

    @GetMapping("/{lob}/{year}")
    public ResponseEntity<List<Volume>> getAllQuartersVolume(
            @PathVariable String lob, @PathVariable int year) {
        return ResponseEntity.ok(service.getAllQuarterVolume(lob, year));
    }

    @GetMapping("/{lob}/{year}/{quarter}")
    public ResponseEntity<Volume> getQuarterVolume(
            @PathVariable String lob, @PathVariable int year,
            @PathVariable String quarter) {
        return ResponseEntity.ok(service.getQuarterVolume(lob, year, quarter));
    }

    @GetMapping("/year")
    public ResponseEntity<List<GraphDTO>> getYearVolume() {
        return ResponseEntity.ok(service.getYearVolume());
    }
}
