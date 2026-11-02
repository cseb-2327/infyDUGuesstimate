package com.infosys.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class QuarterVolumeDTO {
    @NotBlank
    private String month;

    @NotNull(message = "{volume.confident.invalid}")
    @Min(value = 0, message = "{volume.confident.invalid}")
    private Integer confident;

    @NotNull(message = "{volume.opportunities.invalid}")
    @Min(value = 0, message = "{volume.opportunities.invalid}")
    private Integer opportunities;

    @NotNull(message = "{volume.supply.invalid}")
    @Min(value = 0, message = "{volume.supply.invalid}")
    private Integer supplySupportNeed;
}
