package com.vikramsfitnessstudio.controller;

import com.vikramsfitnessstudio.dto.GoogleReviewDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
public class GoogleReviewController {

    @Value("${google.places.api.key}")
    private String googlePlacesApiKey;

    @Value("${google.places.place.id}")
    private String googlePlacesPlaceId;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public ResponseEntity<List<GoogleReviewDto>> getGoogleReviews() {
        String url = String.format("https://maps.googleapis.com/maps/api/place/details/json?place_id=%s&fields=reviews&key=%s",
                googlePlacesPlaceId, googlePlacesApiKey);

        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode reviewsNode = root.path("result").path("reviews");

            List<GoogleReviewDto> reviews = new ArrayList<>();
            if (reviewsNode.isArray()) {
                for (JsonNode reviewNode : reviewsNode) {
                    reviews.add(GoogleReviewDto.builder()
                            .authorName(reviewNode.path("author_name").asText())
                            .profilePhotoUrl(reviewNode.path("profile_photo_url").asText())
                            .rating(reviewNode.path("rating").asInt())
                            .relativePublishTime(reviewNode.path("relative_publish_time").asText())
                            .text(reviewNode.path("text").asText())
                            .build());
                }
            }
            return new ResponseEntity<>(reviews, HttpStatus.OK);
        } catch (Exception e) {
            // In a real application, you would log the error and potentially return a more specific error DTO
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}