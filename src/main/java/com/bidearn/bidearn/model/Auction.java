package com.bidearn.bidearn.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "auctions")
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long auctionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @NotNull
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal startingPrice;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal currentPrice;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime startTime;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AuctionStatus status = AuctionStatus.PENDING;

    public Auction() {}

    public Auction(Long auctionId, Item item, User seller, BigDecimal startingPrice, BigDecimal currentPrice, LocalDateTime startTime, LocalDateTime endTime, AuctionStatus status) {
        this.auctionId = auctionId;
        this.item = item;
        this.seller = seller;
        this.startingPrice = startingPrice;
        this.currentPrice = currentPrice;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status != null ? status : AuctionStatus.PENDING;
    }

    public static AuctionBuilder builder() {
        return new AuctionBuilder();
    }

    public static class AuctionBuilder {
        private Long auctionId;
        private Item item;
        private User seller;
        private BigDecimal startingPrice;
        private BigDecimal currentPrice;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private AuctionStatus status = AuctionStatus.PENDING;

        public AuctionBuilder auctionId(Long auctionId) { this.auctionId = auctionId; return this; }
        public AuctionBuilder item(Item item) { this.item = item; return this; }
        public AuctionBuilder seller(User seller) { this.seller = seller; return this; }
        public AuctionBuilder startingPrice(BigDecimal startingPrice) { this.startingPrice = startingPrice; return this; }
        public AuctionBuilder currentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; return this; }
        public AuctionBuilder startTime(LocalDateTime startTime) { this.startTime = startTime; return this; }
        public AuctionBuilder endTime(LocalDateTime endTime) { this.endTime = endTime; return this; }
        public AuctionBuilder status(AuctionStatus status) { this.status = status; return this; }

        public Auction build() {
            return new Auction(auctionId, item, seller, startingPrice, currentPrice, startTime, endTime, status);
        }
    }

    public Long getAuctionId() { return auctionId; }
    public void setAuctionId(Long auctionId) { this.auctionId = auctionId; }

    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }

    public User getSeller() { return seller; }
    public void setSeller(User seller) { this.seller = seller; }

    public BigDecimal getStartingPrice() { return startingPrice; }
    public void setStartingPrice(BigDecimal startingPrice) { this.startingPrice = startingPrice; }

    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public AuctionStatus getStatus() { return status; }
    public void setStatus(AuctionStatus status) { this.status = status; }
}
