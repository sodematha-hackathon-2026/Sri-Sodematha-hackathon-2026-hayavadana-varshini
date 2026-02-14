package com.seva.platform.controller;

import com.seva.platform.model.History;
import com.seva.platform.model.Parampara;
import com.seva.platform.repository.HistoryRepository;
import com.seva.platform.repository.ParamparaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HistoryController {

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private ParamparaRepository paramparaRepository;

    // --- History Content Endpoints ---

    @GetMapping("/history")
    public History getHistory() {
        return historyRepository.findAll().stream().findFirst().orElse(new History());
    }

    @PostMapping("/history")
    public History saveHistory(@RequestBody History history) {
        // Always ensure only one history record primarily, or update existing
        History existing = historyRepository.findAll().stream().findFirst().orElse(null);
        if (existing != null) {
            existing.setContentEn(history.getContentEn());
            existing.setContentKa(history.getContentKa());
            return historyRepository.save(existing);
        }
        return historyRepository.save(history);
    }

    // --- Parampara Endpoints ---

    @GetMapping("/parampara")
    public List<Parampara> getParampara() {
        return paramparaRepository.findAll();
    }

    @PostMapping("/parampara")
    public Parampara createParampara(@RequestBody Parampara parampara) {
        return paramparaRepository.save(parampara);
    }

    @PutMapping("/parampara/{id}")
    public Parampara updateParampara(@PathVariable Long id, @RequestBody Parampara parampara) {
        return paramparaRepository.findById(id).map(p -> {
            p.setName(parampara.getName());
            p.setPeriod(parampara.getPeriod());
            p.setGuru(parampara.getGuru());
            p.setShishya(parampara.getShishya());
            p.setVrindavanaLocation(parampara.getVrindavanaLocation());
            p.setVrindavanaUrl(parampara.getVrindavanaUrl());
            p.setPhotoUrl(parampara.getPhotoUrl());
            p.setDescriptionEn(parampara.getDescriptionEn());
            p.setDescriptionKa(parampara.getDescriptionKa());
            return paramparaRepository.save(p);
        }).orElse(null);
    }

    @DeleteMapping("/parampara/{id}")
    public void deleteParampara(@PathVariable Long id) {
        paramparaRepository.deleteById(id);
    }

    @PostMapping("/parampara/{id}/image")
    public ResponseEntity<?> uploadParamparaImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return paramparaRepository.findById(id).map(p -> {
            try {
                p.setImage(file.getBytes());
                // Update photoUrl to point to the local API
                p.setPhotoUrl(null); // Clear external URL if any, or maybe keep it as fallback?
                                     // Actually, frontend should prefer the API image if available.
                                     // But for now, let's just save the bytes.
                paramparaRepository.save(p);
                return ResponseEntity.ok("Image uploaded successfully");
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/parampara/{id}/image")
    public ResponseEntity<byte[]> getParamparaImage(@PathVariable Long id) {
        return paramparaRepository.findById(id)
                .filter(p -> p.getImage() != null)
                .map(p -> ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(p.getImage()))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
