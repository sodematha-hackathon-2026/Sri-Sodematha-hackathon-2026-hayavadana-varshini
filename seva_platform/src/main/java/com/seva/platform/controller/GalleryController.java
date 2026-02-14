package com.seva.platform.controller;

import com.seva.platform.model.GalleryItem;
import com.seva.platform.service.GalleryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@CrossOrigin(origins = "*")
public class GalleryController {

    @Autowired
    private GalleryService galleryService;

    @GetMapping
    public List<GalleryItem> getAllItems() {
        return galleryService.getAllItems();
    }

    @PostMapping
    public ResponseEntity<GalleryItem> createItem(@RequestBody GalleryItem item) {
        return ResponseEntity.ok(galleryService.createItem(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GalleryItem> updateItem(@PathVariable Long id, @RequestBody GalleryItem item) {
        return ResponseEntity.ok(galleryService.updateItem(id, item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        galleryService.deleteItem(id);
        return ResponseEntity.ok().build();
    }
}
