package com.infosys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "QuarterVolume")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class QuarterVolume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String volumeRevenueId;

    @Column(nullable = false)
    private Integer confident;

    @Column(nullable = false)
    private Integer opportunities;

    @Column(nullable = false)
    private Integer supplySupportNeed;

    @Column(name = "Month", nullable = false, length = 20)
    private String month;
}
