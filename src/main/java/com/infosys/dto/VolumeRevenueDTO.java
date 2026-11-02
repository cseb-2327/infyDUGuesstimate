package com.infosys.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class VolumeRevenueDTO {
    @NotBlank(message = "{volume.lob.absent}")
    private String lob;

    @NotBlank(message = "{volume.quarter.absent}")
    private String quarter;

    @NotNull(message = "{volume.year.invalid}")
    private Integer year;

    @Valid
    @NotEmpty
    private List<QuarterVolumeDTO> quarterVolume = new ArrayList<>();

    @Valid
    @NotEmpty
    private List<QuarterRevenueDTO> quarterRevenue = new ArrayList<>();
}
