package com.bidearn.bidearn.exception;

public class InvalidTokenException extends RuntimeException {
    public InvalidTokenException() { super("Missing or invalid authentication token"); }
}