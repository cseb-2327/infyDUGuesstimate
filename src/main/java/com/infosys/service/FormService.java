package com.infosys.service;

import com.infosys.dto.*;
import com.infosys.entity.*;
import com.infosys.exception.InfyDUException;
import com.infosys.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.*;

@Service
@Slf4j
public class FormService {
    private static final Set<String> QUARTERS = Set.of("Q1","Q2","Q3","Q4");
    private static final Map<String, Set<String>> MONTHS = Map.of(
            "Q1", Set.of("Apr","May","Jun"),
            "Q2", Set.of("Jul","Aug","Sep"),
            "Q3", Set.of("Oct","Nov","Dec"),
            "Q4", Set.of("Jan","Feb","Mar")
    );

    private final LobRepository lobRepository;
    private final VolumeRepository volumeRepository;
    private final RevenueRepository revenueRepository;
    private final QuarterVolumeRepository quarterVolumeRepository;
    private final QuarterRevenueRepository quarterRevenueRepository;

    public FormService(LobRepository lobRepository, VolumeRepository volumeRepository,
                       RevenueRepository revenueRepository,
                       QuarterVolumeRepository quarterVolumeRepository,
                       QuarterRevenueRepository quarterRevenueRepository) {
        this.lobRepository = lobRepository;
        this.volumeRepository = volumeRepository;
        this.revenueRepository = revenueRepository;
        this.quarterVolumeRepository = quarterVolumeRepository;
        this.quarterRevenueRepository = quarterRevenueRepository;
    }

    @Transactional
    public Volume postVolume(VolumeRevenueDTO dto) {
        log.info("postVolume");
        validateBase(dto);
        LobInfo lob = getLob(dto.getLob());
        String id = makeId(dto.getLob(), dto.getYear(), dto.getQuarter());

        if (volumeRepository.existsById(id))
            throw new InfyDUException("Volume details already exist for " + id);

        validateMonths(dto.getQuarter(), dto.getQuarterVolume());

        Volume v = new Volume();
        v.setVolumeRevenueId(id);
        v.setLob(lob.getLobName());
        v.setDuanchor(lob.getDuAnchor());
        v.setQuarter(dto.getQuarter());
        v.setYear(dto.getYear());
        v.setQuarterVolume(dto.getQuarterVolume().stream().map(x ->
                new QuarterVolume(null, id, x.getConfident(), x.getOpportunities(),
                        x.getSupplySupportNeed(), x.getMonth())).toList());
        recalcVolume(v);
        return volumeRepository.save(v);
    }

    @Transactional
    public Revenue postRevenue(VolumeRevenueDTO dto) {
        log.info("postRevenue");
        validateBase(dto);
        LobInfo lob = getLob(dto.getLob());
        String id = makeId(dto.getLob(), dto.getYear(), dto.getQuarter());

        if (revenueRepository.existsById(id))
            throw new InfyDUException("Revenue details already exist for " + id);

        validateMonthsRevenue(dto.getQuarter(), dto.getQuarterRevenue());

        Revenue r = new Revenue();
        r.setVolumeRevenueId(id);
        r.setLob(lob.getLobName());
        r.setDuanchor(lob.getDuAnchor());
        r.setQuarter(dto.getQuarter());
        r.setYear(dto.getYear());
        r.setQuarterRevenue(dto.getQuarterRevenue().stream().map(x ->
                new QuarterRevenue(null, id, x.getForecastedRevenue(),
                        x.getActualRevenue(), x.getMonth())).toList());
        recalcRevenue(r);
        return revenueRepository.save(r);
    }

    @Transactional
    public Volume updateVolume(String lob, String quarter, QuarterVolumeRevenueDTO dto) {
        log.info("updateVolume");
        quarter = normalizeQuarter(quarter);
        int year = LocalDate.now().getYear();
        String id = makeId(lob, year, quarter);

        Volume v = volumeRepository.findById(id)
                .orElseThrow(() -> new InfyDUException("Service.VOLUMEREVENUEIDQUARTER_NOT_FOUND"));

        validateMonths(quarter, dto.getQuarterVolume());
        List<QuarterVolume> existing = quarterVolumeRepository.findByVolumeRevenueId(id);
        for (QuarterVolumeDTO incoming : dto.getQuarterVolume()) {
            QuarterVolume target = existing.stream()
                    .filter(x -> x.getMonth().equalsIgnoreCase(incoming.getMonth()))
                    .findFirst()
                    .orElseGet(() -> new QuarterVolume(null, id, 0, 0, 0, incoming.getMonth()));
            target.setConfident(incoming.getConfident());
            target.setOpportunities(incoming.getOpportunities());
            target.setSupplySupportNeed(incoming.getSupplySupportNeed());
            quarterVolumeRepository.save(target);
        }
        v.setQuarterVolume(quarterVolumeRepository.findByVolumeRevenueId(id));
        recalcVolume(v);
        return volumeRepository.save(v);
    }

    @Transactional
    public Revenue updateRevenue(String lob, String quarter, QuarterVolumeRevenueDTO dto) {
        log.info("updateRevenue");
        quarter = normalizeQuarter(quarter);
        int year = LocalDate.now().getYear();
        String id = makeId(lob, year, quarter);

        Revenue r = revenueRepository.findById(id)
                .orElseThrow(() -> new InfyDUException("Service.VOLUMEREVENUEIDQUARTER_NOT_FOUND"));

        validateMonthsRevenue(quarter, dto.getQuarterRevenue());
        List<QuarterRevenue> existing = quarterRevenueRepository.findByVolumeRevenueId(id);
        for (QuarterRevenueDTO incoming : dto.getQuarterRevenue()) {
            QuarterRevenue target = existing.stream()
                    .filter(x -> x.getMonth().equalsIgnoreCase(incoming.getMonth()))
                    .findFirst()
                    .orElseGet(() -> new QuarterRevenue(null, id, 0, 0, incoming.getMonth()));
            target.setForecastedRevenue(incoming.getForecastedRevenue());
            target.setActualRevenue(incoming.getActualRevenue());
            quarterRevenueRepository.save(target);
        }
        r.setQuarterRevenue(quarterRevenueRepository.findByVolumeRevenueId(id));
        recalcRevenue(r);
        return revenueRepository.save(r);
    }

    private LobInfo getLob(String lob) {
        return lobRepository.findById(lob)
                .orElseThrow(() -> new InfyDUException("Service.LOB_NOT_FOUND"));
    }

    private void validateBase(VolumeRevenueDTO dto) {
        String q = normalizeQuarter(dto.getQuarter());
        dto.setQuarter(q);
        if (!Objects.equals(dto.getYear(), LocalDate.now().getYear()))
            throw new InfyDUException("Service.YEAR_INVALID");
    }

    private String normalizeQuarter(String q) {
        if (q == null || !QUARTERS.contains(q.toUpperCase()))
            throw new InfyDUException("Service.QUARTER_INVALID");
        return q.toUpperCase();
    }

    private String makeId(String lob, int year, String quarter) {
        return lob + year + quarter;
    }

    private void validateMonths(String quarter, List<QuarterVolumeDTO> list) {
        Set<String> allowed = MONTHS.get(quarter);
        for (QuarterVolumeDTO x : list) {
            if (x.getMonth() == null || !allowed.contains(cap(x.getMonth())))
                throw new InfyDUException("Service." + quarter + "_INVALID");
        }
    }

    private void validateMonthsRevenue(String quarter, List<QuarterRevenueDTO> list) {
        Set<String> allowed = MONTHS.get(quarter);
        for (QuarterRevenueDTO x : list) {
            if (x.getMonth() == null || !allowed.contains(cap(x.getMonth())))
                throw new InfyDUException("Service." + quarter + "_INVALID");
        }
    }

    private String cap(String s) {
        s = s.trim().toLowerCase();
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }

    private void recalcVolume(Volume v) {
        List<QuarterVolume> q = v.getQuarterVolume() == null ? List.of() : v.getQuarterVolume();
        v.setConfidentSum(q.stream().mapToInt(x -> Optional.ofNullable(x.getConfident()).orElse(0)).sum());
        v.setOpportunitiesSum(q.stream().mapToInt(x -> Optional.ofNullable(x.getOpportunities()).orElse(0)).sum());
        v.setSupplySupportNeedSum(q.stream().mapToInt(x -> Optional.ofNullable(x.getSupplySupportNeed()).orElse(0)).sum());
    }

    private void recalcRevenue(Revenue r) {
        List<QuarterRevenue> q = r.getQuarterRevenue() == null ? List.of() : r.getQuarterRevenue();
        r.setForecastedRevenueSum(q.stream().mapToInt(x -> Optional.ofNullable(x.getForecastedRevenue()).orElse(0)).sum());
        r.setActualRevenueSum(q.stream().mapToInt(x -> Optional.ofNullable(x.getActualRevenue()).orElse(0)).sum());
    }
}
