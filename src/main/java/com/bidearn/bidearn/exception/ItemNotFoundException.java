package com.bidearn.bidearn.exception;

public class ItemNotFoundException extends RuntimeException {
    public ItemNotFoundException(Long id) { super("Item not found: id=" + id); }
}