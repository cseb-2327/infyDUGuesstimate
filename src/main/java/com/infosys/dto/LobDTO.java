package com.infosys.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class LobDTO {
    @NotBlank(message = "{lob.name.absent}")
    private String lobName;

    @NotBlank(message = "{lob.anchor.absent}")
    private String duAnchor;
}
