package com.infosys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "LobInfo")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class LobInfo {
    @Id
    @Column(name = "LOBNAME", nullable = false, length = 100)
    private String lobName;

    @Column(name = "DUAnchor", nullable = false, length = 150)
    private String duAnchor;
}
