package com.vikramsfitnessstudio.service;

import com.vikramsfitnessstudio.exception.ResourceNotFoundException;
import com.vikramsfitnessstudio.model.Membership;
import com.vikramsfitnessstudio.model.MembershipPlan;
import com.vikramsfitnessstudio.model.MembershipStatus;
import com.vikramsfitnessstudio.model.User;
import com.vikramsfitnessstudio.repository.MembershipPlanRepository;
import com.vikramsfitnessstudio.repository.MembershipRepository;
import com.vikramsfitnessstudio.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MembershipService {

    private final MembershipPlanRepository membershipPlanRepository;
    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;

    @Autowired
    public MembershipService(MembershipPlanRepository membershipPlanRepository,
                             MembershipRepository membershipRepository,
                             UserRepository userRepository) {
        this.membershipPlanRepository = membershipPlanRepository;
        this.membershipRepository = membershipRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public MembershipPlan createMembershipPlan(MembershipPlan membershipPlan) {
        if (membershipPlan == null) {
            throw new IllegalArgumentException("Membership plan cannot be null.");
        }
        if (membershipPlan.getName() == null || membershipPlan.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Membership plan name cannot be empty.");
        }
        if (membershipPlanRepository.findAll().stream().anyMatch(plan -> plan.getName().equalsIgnoreCase(membershipPlan.getName()))) {
            throw new IllegalArgumentException("Membership plan with name '" + membershipPlan.getName() + "' already exists.");
        }
        if (membershipPlan.getPrice() == null || membershipPlan.getPrice().signum() <= 0) {
            throw new IllegalArgumentException("Membership plan price must be positive.");
        }
        if (membershipPlan.getDurationInMonths() == null || membershipPlan.getDurationInMonths() <= 0) {
            throw new IllegalArgumentException("Membership plan duration in months must be positive.");
        }

        membershipPlan.setIsActive(true);
        return membershipPlanRepository.save(membershipPlan);
    }

    @Transactional
    public MembershipPlan updateMembershipPlan(UUID id, MembershipPlan membershipPlanDetails) {
        MembershipPlan existingPlan = membershipPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found with id: " + id));

        if (membershipPlanDetails.getName() == null || membershipPlanDetails.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Membership plan name cannot be empty.");
        }
        if (membershipPlanDetails.getPrice() == null || membershipPlanDetails.getPrice().signum() <= 0) {
            throw new IllegalArgumentException("Membership plan price must be positive.");
        }
        if (membershipPlanDetails.getDurationInMonths() == null || membershipPlanDetails.getDurationInMonths() <= 0) {
            throw new IllegalArgumentException("Membership plan duration in months must be positive.");
        }

        // Check for unique name if name is changed
        if (!existingPlan.getName().equalsIgnoreCase(membershipPlanDetails.getName())) {
            if (membershipPlanRepository.findAll().stream().anyMatch(plan -> plan.getName().equalsIgnoreCase(membershipPlanDetails.getName()))) {
                throw new IllegalArgumentException("Membership plan with name '" + membershipPlanDetails.getName() + "' already exists.");
            }
        }

        existingPlan.setName(membershipPlanDetails.getName());
        existingPlan.setDescription(membershipPlanDetails.getDescription());
        existingPlan.setPrice(membershipPlanDetails.getPrice());
        existingPlan.setDurationInMonths(membershipPlanDetails.getDurationInMonths());
        existingPlan.setIsActive(membershipPlanDetails.getIsActive());

        return membershipPlanRepository.save(existingPlan);
    }

    @Transactional
    public void deleteMembershipPlan(UUID id) {
        if (!membershipPlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Membership plan not found with id: " + id);
        }
        membershipPlanRepository.deleteById(id);
    }

    public List<MembershipPlan> getAllMembershipPlans() {
        return membershipPlanRepository.findAll();
    }

    public MembershipPlan getMembershipPlanById(UUID id) {
        return membershipPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found with id: " + id));
    }

    @Transactional
    public Membership assignMembershipToUser(Long userId, UUID planId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        MembershipPlan membershipPlan = membershipPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found with id: " + planId));

        // Check if user already has an active membership for this plan
        Optional<Membership> existingActiveMembership = membershipRepository.findByUserIdAndStatus(userId, MembershipStatus.ACTIVE)
                .stream()
                .filter(m -> m.getMembershipPlan().getId().equals(planId))
                .findFirst();

        if (existingActiveMembership.isPresent()) {
            throw new IllegalStateException("User already has an active membership for this plan.");
        }

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusMonths(membershipPlan.getDurationInMonths());

        Membership newMembership = new Membership(user, membershipPlan, startDate, endDate, MembershipStatus.ACTIVE);
        return membershipRepository.save(newMembership);
    }

    @Transactional
    public Membership updateMembershipStatus(UUID membershipId, MembershipStatus newStatus) {
        Membership existingMembership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found with id: " + membershipId));

        // Basic validation for status transitions (can be expanded)
        if (existingMembership.getStatus() == MembershipStatus.EXPIRED && newStatus == MembershipStatus.ACTIVE) {
            throw new IllegalArgumentException("Cannot reactivate an expired membership directly. A new membership should be assigned.");
        }
        if (existingMembership.getStatus() == MembershipStatus.CANCELLED && newStatus == MembershipStatus.ACTIVE) {
            throw new IllegalArgumentException("Cannot reactivate a cancelled membership directly. A new membership should be assigned.");
        }

        existingMembership.setStatus(newStatus);
        return membershipRepository.save(existingMembership);
    }

    public List<Membership> getUserMemberships(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return membershipRepository.findByUserId(userId);
    }
}