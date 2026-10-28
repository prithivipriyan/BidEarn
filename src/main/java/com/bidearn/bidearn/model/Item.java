package com.bidearn.bidearn.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 2000)
    private String description;

    private String category;

    private String imageUrl;

    public Item() {}

    public Item(Long itemId, String name, String description, String category, String imageUrl) {
        this.itemId = itemId;
        this.name = name;
        this.description = description;
        this.category = category;
        this.imageUrl = imageUrl;
    }

    public static ItemBuilder builder() {
        return new ItemBuilder();
    }

    public static class ItemBuilder {
        private Long itemId;
        private String name;
        private String description;
        private String category;
        private String imageUrl;

        public ItemBuilder itemId(Long itemId) { this.itemId = itemId; return this; }
        public ItemBuilder name(String name) { this.name = name; return this; }
        public ItemBuilder description(String description) { this.description = description; return this; }
        public ItemBuilder category(String category) { this.category = category; return this; }
        public ItemBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }

        public Item build() {
            return new Item(itemId, name, description, category, imageUrl);
        }
    }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
