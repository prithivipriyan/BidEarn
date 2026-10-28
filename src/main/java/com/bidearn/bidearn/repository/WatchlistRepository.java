package com.bidearn.bidearn.repository;

import com.bidearn.bidearn.model.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    @Query("SELECT w FROM Watchlist w JOIN FETCH w.auction a JOIN FETCH a.item JOIN FETCH a.seller WHERE w.user.userId = :userId")
    List<Watchlist> findByUser_UserId(@Param("userId") Long userId);

    Optional<Watchlist> findByUser_UserIdAndAuction_AuctionId(Long userId, Long auctionId);
}

