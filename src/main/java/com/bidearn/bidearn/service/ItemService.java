package com.bidearn.bidearn.service;

import com.bidearn.bidearn.exception.ItemNotFoundException;
import com.bidearn.bidearn.model.Item;
import com.bidearn.bidearn.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public Item create(Item item) {
        return itemRepository.save(item);
    }

    public Item findById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException(id));
    }

    public List<Item> findAll() {
        return itemRepository.findAll();
    }
}