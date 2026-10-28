package com.bidearn.bidearn.exception;

public class AuctionNotActiveException extends RuntimeException {
    public AuctionNotActiveException(String message) { super(message); }
}