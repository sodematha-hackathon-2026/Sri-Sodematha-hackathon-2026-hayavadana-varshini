package com.seva.platform.controller;

import com.seva.platform.model.PoojaTiming;
import com.seva.platform.repository.PoojaTimingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pooja-timings")
@CrossOrigin(origins = "*")
public class PoojaTimingController {

    @Autowired
    private PoojaTimingRepository poojaTimingRepository;

    @GetMapping
    public List<PoojaTiming> getTimings(@RequestParam(defaultValue = "EN") String lang) {
        return poojaTimingRepository.findByLanguage(lang);
    }

    @PostMapping
    public PoojaTiming createTiming(@RequestBody PoojaTiming timing) {
        return poojaTimingRepository.save(timing);
    }

    @PutMapping("/{id}")
    public PoojaTiming updateTiming(@PathVariable Long id, @RequestBody PoojaTiming timing) {
        timing.setId(id);
        return poojaTimingRepository.save(timing);
    }

    @DeleteMapping("/{id}")
    public void deleteTiming(@PathVariable Long id) {
        poojaTimingRepository.deleteById(id);
    }
}
