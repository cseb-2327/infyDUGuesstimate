package com.infosys.repository;

import com.infosys.entity.LobInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LobRepository extends JpaRepository<LobInfo, String> {
}
