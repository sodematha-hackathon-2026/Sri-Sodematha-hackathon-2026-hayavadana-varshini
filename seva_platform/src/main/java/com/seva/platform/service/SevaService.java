package com.seva.platform.service;

import com.seva.platform.model.Seva;
import com.seva.platform.repository.SevaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SevaService {

    @Autowired
    private SevaRepository sevaRepository;

    public List<Seva> getAllSevas() {
        return sevaRepository.findByActiveTrue();
    }

    public Seva createSeva(Seva seva) {
        return sevaRepository.save(seva);
    }
}
