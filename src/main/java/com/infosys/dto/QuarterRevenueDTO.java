package com.infosys.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class QuarterRevenueDTO {
    @NotBlank
    private String month;

    @NotNull(message = "{revenue.forecast.invalid}")
    @Min(value = 0, message = "{revenue.forecast.invalid}")
    private Integer forecastedRevenue;

    @NotNull(message = "{revenue.actual.invalid}")
    @Min(value = 0, message = "{revenue.actual.invalid}")
    private Integer actualRevenue;
}
