package com.vikramsfitnessstudio.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;
import com.vikramsfitnessstudio.model.Order;
import com.vikramsfitnessstudio.model.MembershipPlan;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "membership_plan_id", nullable = false)
    private MembershipPlan membershipPlan;

    @Column(nullable = false)
    private String membershipPlanName;

    @Column(nullable = false)
    private BigDecimal priceAtPurchase;

    @Column(nullable = false)
    private Integer durationInMonthsAtPurchase;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public MembershipPlan getMembershipPlan() {
        return membershipPlan;
    }

    public void setMembershipPlan(MembershipPlan membershipPlan) {
        this.membershipPlan = membershipPlan;
    }

    public String getMembershipPlanName() {
        return membershipPlanName;
    }

    public void setMembershipPlanName(String membershipPlanName) {
        this.membershipPlanName = membershipPlanName;
    }

    public BigDecimal getPriceAtPurchase() {
        return priceAtPurchase;
    }

    public void setPriceAtPurchase(BigDecimal priceAtPurchase) {
        this.priceAtPurchase = priceAtPurchase;
    }

    public Integer getDurationInMonthsAtPurchase() {
        return durationInMonthsAtPurchase;
    }

    public void setDurationInMonthsAtPurchase(Integer durationInMonthsAtPurchase) {
        this.durationInMonthsAtPurchase = durationInMonthsAtPurchase;
    }
}