package com.infosys.repository;

import com.infosys.entity.Volume;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface VolumeRepository extends JpaRepository<Volume, String> {
    List<Volume> findByLobAndYear(String lob, Integer year);
    List<Volume> findByYear(Integer year);
}
