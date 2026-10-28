package com.bidearn.bidearn.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bids")
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bidId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDateTime bidTime = LocalDateTime.now();

    public Bid() {}

    public Bid(Long bidId, Auction auction, User user, BigDecimal amount, LocalDateTime bidTime) {
        this.bidId = bidId;
        this.auction = auction;
        this.user = user;
        this.amount = amount;
        this.bidTime = bidTime != null ? bidTime : LocalDateTime.now();
    }

    public static BidBuilder builder() {
        return new BidBuilder();
    }

    public static class BidBuilder {
        private Long bidId;
        private Auction auction;
        private User user;
        private BigDecimal amount;
        private LocalDateTime bidTime = LocalDateTime.now();

        public BidBuilder bidId(Long bidId) { this.bidId = bidId; return this; }
        public BidBuilder auction(Auction auction) { this.auction = auction; return this; }
        public BidBuilder user(User user) { this.user = user; return this; }
        public BidBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public BidBuilder bidTime(LocalDateTime bidTime) { this.bidTime = bidTime; return this; }

        public Bid build() {
            return new Bid(bidId, auction, user, amount, bidTime);
        }
    }

    public Long getBidId() { return bidId; }
    public void setBidId(Long bidId) { this.bidId = bidId; }

    public Auction getAuction() { return auction; }
    public void setAuction(Auction auction) { this.auction = auction; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDateTime getBidTime() { return bidTime; }
    public void setBidTime(LocalDateTime bidTime) { this.bidTime = bidTime; }
}