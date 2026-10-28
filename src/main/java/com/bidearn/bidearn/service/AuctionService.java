    package com.bidearn.bidearn.service;

    import com.bidearn.bidearn.exception.AuctionNotActiveException;
    import com.bidearn.bidearn.exception.AuctionNotFoundException;
    import com.bidearn.bidearn.model.Auction;
    import com.bidearn.bidearn.model.AuctionStatus;
    import com.bidearn.bidearn.repository.AuctionRepository;
    import org.springframework.stereotype.Service;

    import java.time.LocalDateTime;
    import java.util.List;

    @Service
    public class AuctionService {

        private final AuctionRepository auctionRepository;

        public AuctionService(AuctionRepository auctionRepository) {
            this.auctionRepository = auctionRepository;
        }

        public Auction createAuction(Auction auction) {
            if (!auction.getEndTime().isAfter(auction.getStartTime())) {
                throw new IllegalArgumentException("End time must be after start time");
            }
            auction.setCurrentPrice(auction.getStartingPrice());
            auction.setStatus(AuctionStatus.PENDING); // waits for admin approval
            return auctionRepository.save(auction);
        }

        public Auction approve(Long auctionId) {
            Auction auction = findById(auctionId);
            auction.setStatus(AuctionStatus.ACTIVE);
            return auctionRepository.save(auction);
        }

        public Auction terminate(Long auctionId) {
            Auction auction = findById(auctionId);
            if (auction.getStatus() == AuctionStatus.SOLD
                    || auction.getStatus() == AuctionStatus.UNSOLD
                    || auction.getStatus() == AuctionStatus.TERMINATED) {
                throw new AuctionNotActiveException("Auction is already finished");
            }
            auction.setStatus(AuctionStatus.TERMINATED);
            return auctionRepository.save(auction);
        }

        public Auction close(Long auctionId) {
            Auction auction = findById(auctionId);
            boolean hasBids = auction.getCurrentPrice().compareTo(auction.getStartingPrice()) > 0;
            auction.setStatus(hasBids ? AuctionStatus.SOLD : AuctionStatus.UNSOLD);
            return auctionRepository.save(auction);
        }

        public Auction findById(Long id) {
            return auctionRepository.findByIdWithDetails(id)
                    .orElseGet(() -> auctionRepository.findById(id)
                            .orElseThrow(() -> new AuctionNotFoundException(id)));
        }

        public List<Auction> findActive() {
            return auctionRepository.findByStatus(AuctionStatus.ACTIVE);
        }

        public List<Auction> findPending() {
            return auctionRepository.findByStatus(AuctionStatus.PENDING);
        }

        public List<Auction> findAll() {
            return auctionRepository.findAllWithDetails();
        }

        public List<Auction> findBySeller(Long sellerId) {
            return auctionRepository.findBySeller_UserId(sellerId);
        }

        public List<Auction> findLive() {
            LocalDateTime now = LocalDateTime.now();
            return auctionRepository.findByStatusAndStartTimeBeforeAndEndTimeAfter(
                    AuctionStatus.ACTIVE, now, now);
        }

        public List<Auction> findUpcoming() {
            return auctionRepository.findByStatusAndStartTimeAfter(
                    AuctionStatus.ACTIVE, LocalDateTime.now());
        }
    }