package com.infosys.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import java.util.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class QuarterVolumeRevenueDTO {
    @Valid
    @NotEmpty
    private List<QuarterVolumeDTO> quarterVolume = new ArrayList<>();

    @Valid
    @NotEmpty
    private List<QuarterRevenueDTO> quarterRevenue = new ArrayList<>();
}
