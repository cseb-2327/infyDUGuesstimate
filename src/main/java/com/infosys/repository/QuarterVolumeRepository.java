package com.infosys.repository;

import com.infosys.entity.QuarterVolume;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface QuarterVolumeRepository extends JpaRepository<QuarterVolume, Integer> {
    List<QuarterVolume> findByVolumeRevenueId(String volumeRevenueId);
}
