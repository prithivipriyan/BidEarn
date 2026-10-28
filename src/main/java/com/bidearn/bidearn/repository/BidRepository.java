package com.bidearn.bidearn.repository;

import com.bidearn.bidearn.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {
    @Query("SELECT b FROM Bid b JOIN FETCH b.user WHERE b.auction.auctionId = :auctionId ORDER BY b.amount DESC")
    List<Bid> findByAuction_AuctionIdOrderByAmountDesc(@Param("auctionId") Long auctionId);

    @Query("SELECT b FROM Bid b JOIN FETCH b.auction a JOIN FETCH a.item JOIN FETCH a.seller WHERE b.user.userId = :userId ORDER BY b.bidTime DESC")
    List<Bid> findByUser_UserId(@Param("userId") Long userId);
}