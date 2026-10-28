package com.bidearn.bidearn.exception;

public class SelfBidException extends RuntimeException {
    public SelfBidException() { super("You cannot bid on your own auction"); }
}