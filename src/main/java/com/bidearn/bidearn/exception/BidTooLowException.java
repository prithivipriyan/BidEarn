package com.bidearn.bidearn.exception;

// Matches SRS Appendix D naming directly
public class BidTooLowException extends RuntimeException {
    public BidTooLowException(String message) { super(message); }
}