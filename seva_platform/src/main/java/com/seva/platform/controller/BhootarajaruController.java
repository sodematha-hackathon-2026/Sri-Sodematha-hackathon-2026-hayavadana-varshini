package com.seva.platform.controller;

import com.seva.platform.model.Bhootarajaru;
import com.seva.platform.repository.BhootarajaruRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/bhootarajaru")
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class BhootarajaruController {

    @Autowired
    private BhootarajaruRepository repository;

    @GetMapping
    public List<Bhootarajaru> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Bhootarajaru create(@RequestBody Bhootarajaru item) {
        return repository.save(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bhootarajaru> update(@PathVariable Long id, @RequestBody Bhootarajaru item) {
        return repository.findById((Long) id).map(existing -> {
            existing.setName(item.getName());
            existing.setDescriptionEn(item.getDescriptionEn());
            existing.setDescriptionKa(item.getDescriptionKa());
            return ResponseEntity.ok(repository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<?> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return repository.findById(id).map(item -> {
            try {
                item.setImage(file.getBytes());
                repository.save(item);
                return ResponseEntity.ok("Image uploaded successfully");
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        return repository.findById((Long) id)
                .filter(item -> item.getImage() != null)
                .map(item -> ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(item.getImage()))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
