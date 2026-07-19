package com.vikramsfitnessstudio.controller;

import com.vikramsfitnessstudio.dto.MembershipPlanDto;
import com.vikramsfitnessstudio.dto.UserMembershipDto;
import com.vikramsfitnessstudio.model.MembershipPlan;
import com.vikramsfitnessstudio.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/memberships")
public class MembershipController {

    private final MembershipService membershipService;

    @Autowired
    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @GetMapping("/plans")
    public ResponseEntity<List<MembershipPlanDto>> getMembershipPlans() {
        List<MembershipPlanDto> activePlans = membershipService.getAllMembershipPlans().stream()
                .filter(MembershipPlan::getIsActive)
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(activePlans);
    }

    @GetMapping("/my-memberships")
    public ResponseEntity<List<UserMembershipDto>> getUserMemberships(Principal principal) {
        if (principal == null || principal.getName() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Long userId = Long.valueOf(principal.getName()); // Assuming principal name is the user ID

        List<UserMembershipDto> userMemberships = membershipService.getUserMemberships(userId).stream()
                .map(membership -> UserMembershipDto.builder()
                        .id(membership.getId())
                        .membershipPlanName(membership.getMembershipPlan().getName())
                        .startDate(membership.getStartDate())
                        .endDate(membership.getEndDate())
                        .status(membership.getStatus().name())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(userMemberships);
    }

    private MembershipPlanDto convertToDto(MembershipPlan membershipPlan) {
        return MembershipPlanDto.builder()
                .id(membershipPlan.getId())
                .name(membershipPlan.getName())
                .description(membershipPlan.getDescription())
                .price(membershipPlan.getPrice())
                .durationInMonths(membershipPlan.getDurationInMonths())
                .isActive(membershipPlan.getIsActive())
                .build();
    }
}