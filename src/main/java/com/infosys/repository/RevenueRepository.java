package com.infosys.repository;

import com.infosys.entity.Revenue;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface RevenueRepository extends JpaRepository<Revenue, String> {
    List<Revenue> findByLobAndYear(String lob, Integer year);
    List<Revenue> findByYear(Integer year);
}
