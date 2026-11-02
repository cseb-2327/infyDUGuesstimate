package com.infosys.service;

import com.infosys.dto.LobDTO;
import com.infosys.entity.LobInfo;
import com.infosys.exception.InfyDUException;
import com.infosys.repository.LobRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@Slf4j
public class LobService {
    private final LobRepository repository;

    public LobService(LobRepository repository) {
        this.repository = repository;
    }

    public LobInfo addLobs(LobDTO dto) {
        log.info("addLobs");
        if (repository.existsById(dto.getLobName()))
            throw new InfyDUException("LOB already exists");
        return repository.save(new LobInfo(dto.getLobName(), dto.getDuAnchor()));
    }

    public LobInfo updateLob(String lob, LobDTO dto) {
        log.info("updateLob");
        LobInfo entity = repository.findById(lob)
                .orElseThrow(() -> new InfyDUException("Service.LOB_NOT_FOUND"));
        entity.setDuAnchor(dto.getDuAnchor());
        return repository.save(entity);
    }

    public void deleteLob(String lob) {
        log.info("deleteLob");
        if (!repository.existsById(lob))
            throw new InfyDUException("Service.LOB_NOT_FOUND");
        repository.deleteById(lob);
    }

    public LobInfo getLob(String lob) {
        log.info("getLob");
        return repository.findById(lob)
                .orElseThrow(() -> new InfyDUException("Service.LOB_NOT_FOUND"));
    }

    public List<LobInfo> getLobs() {
        log.info("getLobs");
        return repository.findAll();
    }
}
