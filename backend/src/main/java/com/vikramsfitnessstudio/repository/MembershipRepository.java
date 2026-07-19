package com.vikramsfitnessstudio.repository;

import com.vikramsfitnessstudio.model.Membership;
import com.vikramsfitnessstudio.model.MembershipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface MembershipRepository extends JpaRepository<Membership, UUID> {
    List<Membership> findByUserId(Long userId);
    List<Membership> findByUserIdAndStatus(Long userId, MembershipStatus status);
}