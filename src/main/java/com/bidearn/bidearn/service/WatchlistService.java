package com.bidearn.bidearn.service;

import com.bidearn.bidearn.exception.AlreadyInWatchlistException;
import com.bidearn.bidearn.model.Auction;
import com.bidearn.bidearn.model.User;
import com.bidearn.bidearn.model.Watchlist;
import com.bidearn.bidearn.repository.WatchlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final UserService userService;
    private final AuctionService auctionService;

    public WatchlistService(WatchlistRepository watchlistRepository, UserService userService, AuctionService auctionService) {
        this.watchlistRepository = watchlistRepository;
        this.userService = userService;
        this.auctionService = auctionService;
    }

    public Watchlist add(Long userId, Long auctionId) {
        watchlistRepository.findByUser_UserIdAndAuction_AuctionId(userId, auctionId)
                .ifPresent(w -> {
                    throw new AlreadyInWatchlistException();
                });

        User user = userService.findById(userId);
        Auction auction = auctionService.findById(auctionId);

        return watchlistRepository.save(Watchlist.builder().user(user).auction(auction).build());
    }

    public void remove(Long watchlistId) {
        watchlistRepository.deleteById(watchlistId);
    }

    public List<Watchlist> getForUser(Long userId) {
        return watchlistRepository.findByUser_UserId(userId);
    }
}