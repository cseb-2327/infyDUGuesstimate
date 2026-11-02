package com.infosys.service;

import com.infosys.dto.GraphDTO;
import com.infosys.entity.Volume;
import com.infosys.exception.InfyDUException;
import com.infosys.repository.VolumeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

@Service
@Slf4j
public class VolumeService {
    private final VolumeRepository repository;

    public VolumeService(VolumeRepository repository) {
        this.repository = repository;
    }

    public List<Volume> getAllQuarterVolume(String lob, int year) {
        log.info("getAllQuarterVolume");
        List<Volume> result = repository.findByLobAndYear(lob, year);
        if (result.isEmpty())
            throw new InfyDUException("Service.VOLUMEID_NOT_FOUND");
        return result;
    }

    public Volume getQuarterVolume(String lob, int year, String quarter) {
        log.info("getQuarterVolume");
        String id = lob + year + quarter.toUpperCase();
        return repository.findById(id)
                .orElseThrow(() -> new InfyDUException("Service.VOLUMELOBQUARTER_NOT_FOUND"));
    }

    public List<GraphDTO> getYearVolume() {
        log.info("getYearVolume");
        int year = LocalDate.now().getYear();
        Map<String, GraphDTO> map = new LinkedHashMap<>();
        for (Volume v : repository.findByYear(year)) {
            GraphDTO dto = map.computeIfAbsent(v.getLob(),
                    x -> new GraphDTO(x, 0, 0, 0, 0, 0, 0, 0));
            dto.setConfident(dto.getConfident() + v.getConfidentSum());
            dto.setOpportunities(dto.getOpportunities() + v.getOpportunitiesSum());
            dto.setSupplySupportNeed(dto.getSupplySupportNeed() + v.getSupplySupportNeedSum());
            dto.setTotalVolume(dto.getConfident() + dto.getOpportunities() + dto.getSupplySupportNeed());
        }
        return new ArrayList<>(map.values());
    }
}
