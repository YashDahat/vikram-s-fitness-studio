package com.vikramsfitnessstudio.dto;

import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleReviewDto {
    private String authorName;
    private String profilePhotoUrl;
    private Integer rating;
    private String relativePublishTime;
    private String text;
}
