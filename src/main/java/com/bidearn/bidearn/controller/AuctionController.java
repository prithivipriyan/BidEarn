package com.bidearn.bidearn.controller;

import com.bidearn.bidearn.model.Auction;
import com.bidearn.bidearn.service.AuctionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    private final AuctionService auctionService;

    public AuctionController(AuctionService auctionService) {
        this.auctionService = auctionService;
    }

    @PostMapping
    public ResponseEntity<Auction> create(@RequestBody Auction auction) {
        return ResponseEntity.ok(auctionService.createAuction(auction));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Auction> approve(@PathVariable Long id) {
        return ResponseEntity.ok(auctionService.approve(id));
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<Auction> close(@PathVariable Long id) {
        return ResponseEntity.ok(auctionService.close(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Auction> getById(@PathVariable Long id) {
        return ResponseEntity.ok(auctionService.findById(id));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Auction>> getActive() {
        return ResponseEntity.ok(auctionService.findActive());
    }

    @GetMapping
    public ResponseEntity<List<Auction>> getAll() {
        return ResponseEntity.ok(auctionService.findAll());
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Auction>> getBySeller(@PathVariable Long sellerId) {
        return ResponseEntity.ok(auctionService.findBySeller(sellerId));
    }
    @PutMapping("/{id}/terminate")
    public ResponseEntity<Auction> terminate(@PathVariable Long id) {
        return ResponseEntity.ok(auctionService.terminate(id));
    }
    @GetMapping("/live")
    public ResponseEntity<List<Auction>> getLive() {
        return ResponseEntity.ok(auctionService.findLive());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Auction>> getUpcoming() {
        return ResponseEntity.ok(auctionService.findUpcoming());
    }
    @GetMapping("/pending")
    public ResponseEntity<List<Auction>> getPending() {
        return ResponseEntity.ok(auctionService.findPending());
    }
}