package com.bidearn.bidearn.controller;

import com.bidearn.bidearn.model.Watchlist;
import com.bidearn.bidearn.service.WatchlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @PostMapping
    public ResponseEntity<Watchlist> add(@RequestParam Long userId, @RequestParam Long auctionId) {
        return ResponseEntity.ok(watchlistService.add(userId, auctionId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        watchlistService.remove(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Watchlist>> getForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(watchlistService.getForUser(userId));
    }
}