package com.seva.platform.repository;

import com.seva.platform.model.SevaBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SevaBookingRepository extends JpaRepository<SevaBooking, Long> {
    List<SevaBooking> findByStatus(String status);

    List<SevaBooking> findByUserMobileNumber(String mobileNumber);
}
