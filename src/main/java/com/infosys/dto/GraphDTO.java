package com.infosys.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class GraphDTO {
    private String lob;
    private Integer confident;
    private Integer opportunities;
    private Integer supplySupportNeed;
    private Integer totalVolume;
    private Integer forecastedRevenue;
    private Integer actualRevenue;
    private Integer totalRevenue;
}
