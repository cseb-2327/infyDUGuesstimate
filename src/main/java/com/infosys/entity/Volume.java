package com.infosys.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name = "Volume")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Volume {
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
    private List<QuarterVolume> quarterVolume = new ArrayList<>();

    @Column(name = "Confident_Sum", nullable = false)
    private Integer confidentSum = 0;

    @Column(name = "Opportunities_Sum", nullable = false)
    private Integer opportunitiesSum = 0;

    @Column(name = "SupplySupportNeed_Sum", nullable = false)
    private Integer supplySupportNeedSum = 0;
}
