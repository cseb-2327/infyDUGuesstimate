package com.infosys.service;

import com.infosys.dto.GraphDTO;
import com.infosys.entity.Revenue;
import com.infosys.exception.InfyDUException;
import com.infosys.repository.RevenueRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

@Service
@Slf4j
public class RevenueService {
    private final RevenueRepository repository;

    public RevenueService(RevenueRepository repository) {
        this.repository = repository;
    }

    public List<Revenue> getAllQuarterRevenue(String lob, int year) {
        log.info("getAllQuarterRevenue");
        List<Revenue> result = repository.findByLobAndYear(lob, year);
        if (result.isEmpty())
            throw new InfyDUException("Service.REVENUEID_NOT_FOUND");
        return result;
    }

    public Revenue getQuarterRevenue(String lob, int year, String quarter) {
        log.info("getQuarterRevenue");
        String id = lob + year + quarter.toUpperCase();
        return repository.findById(id)
                .orElseThrow(() -> new InfyDUException("Service.REVENUELOBQUARTER_NOT_FOUND"));
    }

    public List<GraphDTO> getYearRevenue() {
        log.info("getYearRevenue");
        int year = LocalDate.now().getYear();
        Map<String, GraphDTO> map = new LinkedHashMap<>();
        for (Revenue r : repository.findByYear(year)) {
            GraphDTO dto = map.computeIfAbsent(r.getLob(),
                    x -> new GraphDTO(x, 0, 0, 0, 0, 0, 0, 0));
            dto.setForecastedRevenue(dto.getForecastedRevenue() + r.getForecastedRevenueSum());
            dto.setActualRevenue(dto.getActualRevenue() + r.getActualRevenueSum());
            dto.setTotalRevenue(dto.getForecastedRevenue() + dto.getActualRevenue());
        }
        return new ArrayList<>(map.values());
    }
}
