package com.infosys.repository;

import com.infosys.entity.QuarterRevenue;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface QuarterRevenueRepository extends JpaRepository<QuarterRevenue, Integer> {
    List<QuarterRevenue> findByVolumeRevenueId(String volumeRevenueId);
}
