package com.infosys.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name = "Revenue")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Revenue {
    @Id
    @Column(name = "VolumeRevenueId", nullable = false, length = 180)
    private String volumeRevenueId;

    @Column(nullable = false, length = 100)
    private String lob;

    @Column(nullable = false, length = 150)
    private String duanchor;

    @Column(nullable = false, length = 10)
    private String quarter;

    @Column(nullable = false)
    private Integer year;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "volumeRevenueId", referencedColumnName = "VolumeRevenueId",
            insertable = false, updatable = false)
    private List<QuarterRevenue> quarterRevenue = new ArrayList<>();

    @Column(name = "ForecastedRevenue_Sum", nullable = false)
    private Integer forecastedRevenueSum = 0;

    @Column(name = "ActualRevenue_Sum", nullable = false)
    private Integer actualRevenueSum = 0;
}
