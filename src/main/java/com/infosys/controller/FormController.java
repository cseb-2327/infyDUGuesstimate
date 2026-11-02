package com.infosys.controller;

import com.infosys.dto.*;
import com.infosys.entity.*;
import com.infosys.service.FormService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forms")
@CrossOrigin
public class FormController {
    private final FormService service;

    public FormController(FormService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<String> postVolumeRevenue(@Valid @RequestBody VolumeRevenueDTO dto) {
        Volume volume = service.postVolume(dto);
        Revenue revenue = service.postRevenue(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Volume details for LOB inserted successfully" + volume.getVolumeRevenueId()
                        + " Revenue details for LOB inserted successfully" + revenue.getVolumeRevenueId());
    }

    @PutMapping("/{lob}/{quarter}")
    public ResponseEntity<String> updateVolumeRevenue(
            @PathVariable String lob,
            @PathVariable String quarter,
            @Valid @RequestBody QuarterVolumeRevenueDTO dto) {

        Volume volume = service.updateVolume(lob, quarter, dto);
        Revenue revenue = service.updateRevenue(lob, quarter, dto);
        return ResponseEntity.ok("Volume details for LOB inserted successfully" + volume.getVolumeRevenueId()
                + " Revenue details for LOB inserted successfully" + revenue.getVolumeRevenueId());
    }
}
