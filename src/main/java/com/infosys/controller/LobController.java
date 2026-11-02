package com.infosys.controller;

import com.infosys.dto.LobDTO;
import com.infosys.entity.LobInfo;
import com.infosys.service.LobService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/lobs")
@CrossOrigin
public class LobController {
    private final LobService service;

    public LobController(LobService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<String> addLobs(@Valid @RequestBody LobDTO dto) {
        LobInfo saved = service.addLobs(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(saved.getLobName() + "LOB successfully inserted");
    }

    @PutMapping("/{lob}")
    public ResponseEntity<String> updateLob(@PathVariable String lob, @Valid @RequestBody LobDTO dto) {
        service.updateLob(lob, dto);
        return ResponseEntity.ok("LOB details updated successfully");
    }

    @DeleteMapping("/{lob}")
    public ResponseEntity<String> deleteLob(@PathVariable String lob) {
        service.deleteLob(lob);
        return ResponseEntity.ok("LOB details deleted successfully");
    }

    @GetMapping("/{lob}")
    public ResponseEntity<LobInfo> getLob(@PathVariable String lob) {
        return ResponseEntity.ok(service.getLob(lob));
    }

    @GetMapping
    public ResponseEntity<List<LobInfo>> getLobs() {
        return ResponseEntity.ok(service.getLobs());
    }
}
