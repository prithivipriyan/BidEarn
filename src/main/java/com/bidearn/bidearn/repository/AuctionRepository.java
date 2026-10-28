package com.bidearn.bidearn.repository;

import com.bidearn.bidearn.model.Auction;
import com.bidearn.bidearn.model.AuctionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AuctionRepository extends JpaRepository<Auction, Long> {
    @Query("SELECT a FROM Auction a JOIN FETCH a.item JOIN FETCH a.seller WHERE a.auctionId = :id")
    java.util.Optional<Auction> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT a FROM Auction a JOIN FETCH a.item JOIN FETCH a.seller")
    List<Auction> findAllWithDetails();

    @Query("SELECT a FROM Auction a JOIN FETCH a.item JOIN FETCH a.seller WHERE a.seller.userId = :sellerId ORDER BY a.auctionId DESC")
    List<Auction> findBySeller_UserId(@Param("sellerId") Long sellerId);

    @Query("SELECT a FROM Auction a JOIN FETCH a.item JOIN FETCH a.seller WHERE a.status = :status AND a.startTime <= :now1 AND a.endTime >= :now2")
    List<Auction> findByStatusAndStartTimeBeforeAndEndTimeAfter(
            @Param("status") AuctionStatus status, @Param("now1") LocalDateTime now1, @Param("now2") LocalDateTime now2);

    @Query("SELECT a FROM Auction a JOIN FETCH a.item JOIN FETCH a.seller WHERE a.status = :status AND a.startTime > :now")
    List<Auction> findByStatusAndStartTimeAfter(@Param("status") AuctionStatus status, @Param("now") LocalDateTime now);

    @Query("SELECT a FROM Auction a JOIN FETCH a.item JOIN FETCH a.seller WHERE a.status = :status")
    List<Auction> findByStatus(@Param("status") AuctionStatus status);
}