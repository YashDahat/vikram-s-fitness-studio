package com.vikramsfitnessstudio.controller.admin;

import com.vikramsfitnessstudio.dto.MembershipPlanDto;
import com.vikramsfitnessstudio.model.MembershipPlan;
import com.vikramsfitnessstudio.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/memberships/plans")
public class AdminMembershipPlanController {

    private final MembershipService membershipService;

    @Autowired
    public AdminMembershipPlanController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @GetMapping
    public ResponseEntity<List<MembershipPlanDto>> getAllMembershipPlans() {
        List<MembershipPlanDto> plans = membershipService.getAllMembershipPlans().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MembershipPlanDto> getMembershipPlanById(@PathVariable UUID id) {
        MembershipPlan membershipPlan = membershipService.getMembershipPlanById(id);
        return ResponseEntity.ok(convertToDto(membershipPlan));
    }

    @PostMapping
    public ResponseEntity<MembershipPlanDto> createMembershipPlan(@Valid @RequestBody MembershipPlanDto membershipPlanDto) {
        MembershipPlan membershipPlan = convertToEntity(membershipPlanDto);
        MembershipPlan createdPlan = membershipService.createMembershipPlan(membershipPlan);
        return new ResponseEntity<>(convertToDto(createdPlan), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MembershipPlanDto> updateMembershipPlan(@PathVariable UUID id, @Valid @RequestBody MembershipPlanDto membershipPlanDto) {
        MembershipPlan membershipPlanDetails = convertToEntity(membershipPlanDto);
        MembershipPlan updatedPlan = membershipService.updateMembershipPlan(id, membershipPlanDetails);
        return ResponseEntity.ok(convertToDto(updatedPlan));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMembershipPlan(@PathVariable UUID id) {
        membershipService.deleteMembershipPlan(id);
        return ResponseEntity.noContent().build();
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

    private MembershipPlan convertToEntity(MembershipPlanDto membershipPlanDto) {
        MembershipPlan membershipPlan = new MembershipPlan();
        membershipPlan.setId(membershipPlanDto.getId());
        membershipPlan.setName(membershipPlanDto.getName());
        membershipPlan.setDescription(membershipPlanDto.getDescription());
        membershipPlan.setPrice(membershipPlanDto.getPrice());
        membershipPlan.setDurationInMonths(membershipPlanDto.getDurationInMonths());
        membershipPlan.setIsActive(membershipPlanDto.getIsActive() != null ? membershipPlanDto.getIsActive() : true); // Default to true if not provided
        return membershipPlan;
    }
}