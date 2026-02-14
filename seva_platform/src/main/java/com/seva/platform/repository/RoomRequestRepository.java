package com.seva.platform.repository;

import com.seva.platform.model.RoomRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoomRequestRepository extends JpaRepository<RoomRequest, Long> {
    List<RoomRequest> findByStatus(RoomRequest.Status status);

    List<RoomRequest> findByMobileNumber(String mobileNumber);
}
