package com.bidearn.bidearn.service;

import com.bidearn.bidearn.exception.AuctionNotActiveException;
import com.bidearn.bidearn.exception.BidTooLowException;
import com.bidearn.bidearn.exception.SelfBidException;
import com.bidearn.bidearn.model.Auction;
import com.bidearn.bidearn.model.AuctionStatus;
import com.bidearn.bidearn.model.Bid;
import com.bidearn.bidearn.model.User;
import com.bidearn.bidearn.repository.AuctionRepository;
import com.bidearn.bidearn.repository.BidRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BidService {

    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final AuctionService auctionService;
    private final UserService userService;

    public BidService(BidRepository bidRepository, AuctionRepository auctionRepository, AuctionService auctionService, UserService userService) {
        this.bidRepository = bidRepository;
        this.auctionRepository = auctionRepository;
        this.auctionService = auctionService;
        this.userService = userService;
    }

    @Transactional
    public Bid placeBid(Long auctionId, Long userId, BigDecimal amount) {
        Auction auction = auctionService.findById(auctionId);
        User bidder = userService.findById(userId);

        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            throw new AuctionNotActiveException("Auction is not active");
        }
        if (LocalDateTime.now().isBefore(auction.getStartTime())) {
            throw new AuctionNotActiveException("Auction has not started yet");
        }
        if (LocalDateTime.now().isAfter(auction.getEndTime())) {
            throw new AuctionNotActiveException("Auction has ended");
        }
        if (auction.getSeller().getUserId().equals(userId)) {
            throw new SelfBidException();
        }
        if (amount.compareTo(auction.getCurrentPrice()) <= 0) {
            throw new BidTooLowException("Bid must be higher than current price");
        }

        Bid bid = Bid.builder()
                .auction(auction)
                .user(bidder)
                .amount(amount)
                .build();
        bidRepository.save(bid);

        auction.setCurrentPrice(amount);
        auctionRepository.save(auction);
        return bid;
    }

    public List<Bid> getBidsForAuction(Long auctionId) {
        return bidRepository.findByAuction_AuctionIdOrderByAmountDesc(auctionId);
    }

    public List<Bid> getBidsForUser(Long userId) {
        return bidRepository.findByUser_UserId(userId);
    }
}