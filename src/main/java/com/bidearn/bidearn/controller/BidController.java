package com.bidearn.bidearn.controller;

import com.bidearn.bidearn.model.Bid;
import com.bidearn.bidearn.service.BidService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bids")
public class BidController {

    private final BidService bidService;

    public BidController(BidService bidService) {
        this.bidService = bidService;
    }

    @PostMapping
    public ResponseEntity<Bid> placeBid(@RequestBody Map<String, Object> body) {
        Long auctionId = Long.valueOf(body.get("auctionId").toString());
        Long userId = Long.valueOf(body.get("userId").toString());
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        return ResponseEntity.ok(bidService.placeBid(auctionId, userId, amount));
    }

    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<List<Bid>> getForAuction(@PathVariable Long auctionId) {
        return ResponseEntity.ok(bidService.getBidsForAuction(auctionId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Bid>> getForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bidService.getBidsForUser(userId));
    }
}
