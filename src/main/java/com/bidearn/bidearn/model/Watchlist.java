package com.bidearn.bidearn.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "watchlist",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "auction_id"})
)
public class Watchlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long watchlistId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;

    @Column(nullable = false)
    private LocalDateTime addedAt = LocalDateTime.now();

    public Watchlist() {}

    public Watchlist(Long watchlistId, User user, Auction auction, LocalDateTime addedAt) {
        this.watchlistId = watchlistId;
        this.user = user;
        this.auction = auction;
        this.addedAt = addedAt != null ? addedAt : LocalDateTime.now();
    }

    public static WatchlistBuilder builder() {
        return new WatchlistBuilder();
    }

    public static class WatchlistBuilder {
        private Long watchlistId;
        private User user;
        private Auction auction;
        private LocalDateTime addedAt = LocalDateTime.now();

        public WatchlistBuilder watchlistId(Long watchlistId) { this.watchlistId = watchlistId; return this; }
        public WatchlistBuilder user(User user) { this.user = user; return this; }
        public WatchlistBuilder auction(Auction auction) { this.auction = auction; return this; }
        public WatchlistBuilder addedAt(LocalDateTime addedAt) { this.addedAt = addedAt; return this; }

        public Watchlist build() {
            return new Watchlist(watchlistId, user, auction, addedAt);
        }
    }

    public Long getWatchlistId() { return watchlistId; }
    public void setWatchlistId(Long watchlistId) { this.watchlistId = watchlistId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Auction getAuction() { return auction; }
    public void setAuction(Auction auction) { this.auction = auction; }

    public LocalDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }
}