package com.bidearn.bidearn.exception;

public class AuctionNotFoundException extends RuntimeException {
    public AuctionNotFoundException(Long id) { super("Auction not found: id=" + id); }
}