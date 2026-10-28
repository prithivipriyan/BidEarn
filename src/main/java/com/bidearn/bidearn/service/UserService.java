package com.bidearn.bidearn.service;

import com.bidearn.bidearn.exception.EmailAlreadyExistsException;
import com.bidearn.bidearn.exception.InvalidCredentialsException;
import com.bidearn.bidearn.exception.UserNotFoundException;
import com.bidearn.bidearn.model.*;
import com.bidearn.bidearn.repository.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final WatchlistRepository watchlistRepository;
    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final ItemRepository itemRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(
            UserRepository userRepository,
            WatchlistRepository watchlistRepository,
            BidRepository bidRepository,
            AuctionRepository auctionRepository,
            ItemRepository itemRepository
    ) {
        this.userRepository = userRepository;
        this.watchlistRepository = watchlistRepository;
        this.bidRepository = bidRepository;
        this.auctionRepository = auctionRepository;
        this.itemRepository = itemRepository;
    }

    public User register(User user) {
        if (userRepository.existsByEmailIgnoreCase(user.getEmail())) {
            throw new EmailAlreadyExistsException(user.getEmail());
        }
        user.setEmail(user.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.CUSTOMER); // Registration is exclusively for Customer accounts
        user.setStatus(UserStatus.ACTIVE);
        return userRepository.save(user);
    }

    public User login(String email, String rawPassword) {
        String lookupEmail = email != null ? email.trim() : "";
        if ("admin".equalsIgnoreCase(lookupEmail)) {
            lookupEmail = "admin@bidearn.com";
        }
        User user = userRepository.findByEmailIgnoreCase(lookupEmail)
                .orElseThrow(InvalidCredentialsException::new);

        boolean matches = false;
        try {
            matches = passwordEncoder.matches(rawPassword, user.getPassword());
        } catch (Exception ignored) {}

        // Fallback for direct SQL inserts where password was stored as plain text
        if (!matches && rawPassword.equals(user.getPassword())) {
            matches = true;
        }

        if (!matches) {
            throw new InvalidCredentialsException();
        }
        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new InvalidCredentialsException();
        }
        return user;
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public List<User> findCustomers() {
        return userRepository.findByRole(Role.CUSTOMER);
    }

    public User updateStatus(Long id, UserStatus status) {
        User user = findById(id);
        user.setStatus(status);
        return userRepository.save(user);
    }

    public User updateRole(Long id, Role role) {
        User user = findById(id);
        user.setRole(role);
        return userRepository.save(user);
    }

    @Transactional
    public void delete(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        // 1. Delete user's watchlist bookmarks
        List<Watchlist> userWatchlists = watchlistRepository.findByUser_UserId(id);
        if (userWatchlists != null && !userWatchlists.isEmpty()) {
            watchlistRepository.deleteAll(userWatchlists);
        }

        // 2. Delete user's bids
        List<Bid> userBids = bidRepository.findByUser_UserId(id);
        if (userBids != null && !userBids.isEmpty()) {
            bidRepository.deleteAll(userBids);
        }

        // 3. Delete user's seller auctions and all associated bids/items
        List<Auction> sellerAuctions = auctionRepository.findBySeller_UserId(id);
        if (sellerAuctions != null && !sellerAuctions.isEmpty()) {
            for (Auction auction : sellerAuctions) {
                // Delete bids on this auction
                List<Bid> auctionBids = bidRepository.findByAuction_AuctionIdOrderByAmountDesc(auction.getAuctionId());
                if (auctionBids != null && !auctionBids.isEmpty()) {
                    bidRepository.deleteAll(auctionBids);
                }

                Item item = auction.getItem();
                auctionRepository.delete(auction);
                if (item != null) {
                    itemRepository.delete(item);
                }
            }
        }

        // 4. Finally delete the user
        userRepository.delete(user);
    }

    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(InvalidCredentialsException::new);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void changePassword(Long id, String currentPassword, String newPassword) {
        User user = findById(id);
        String rawCurrent = currentPassword != null ? currentPassword.trim() : "";
        String rawNew = newPassword != null ? newPassword.trim() : "";

        if (rawNew.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters long");
        }

        boolean matches = false;
        try {
            matches = passwordEncoder.matches(rawCurrent, user.getPassword());
        } catch (Exception ignored) {}

        // Fallback for direct SQL inserts where password was stored as plain text
        if (!matches && rawCurrent.equals(user.getPassword())) {
            matches = true;
        }

        if (!matches) {
            throw new InvalidCredentialsException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(rawNew));
        userRepository.save(user);
    }

    public User updateProfile(Long id, User updates) {
        User user = findById(id);
        if (updates.getFullName() != null) user.setFullName(updates.getFullName());
        if (updates.getCountry() != null) user.setCountry(updates.getCountry());
        if (updates.getPhoneNumber() != null) user.setPhoneNumber(updates.getPhoneNumber());
        return userRepository.save(user);
    }

    public User updatePhoto(Long id, String photoUrl) {
        User user = findById(id);
        user.setProfilePhoto(photoUrl);
        return userRepository.save(user);
    }
}