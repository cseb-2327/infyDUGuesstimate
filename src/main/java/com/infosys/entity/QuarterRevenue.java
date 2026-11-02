package com.infosys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "QuarterRevenue")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class QuarterRevenue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 180)
    private String volumeRevenueId;

    @Column(nullable = false)
    private Integer forecastedRevenue;

    @Column(nullable = false)
    private Integer actualRevenue;

    @Column(name = "Month", nullable = false, length = 20)
    private String month;
}
