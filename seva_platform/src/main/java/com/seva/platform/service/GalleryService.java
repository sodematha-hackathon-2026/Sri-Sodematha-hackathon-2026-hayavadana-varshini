package com.seva.platform.service;

import com.seva.platform.model.GalleryItem;
import com.seva.platform.repository.GalleryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GalleryService {

    @Autowired
    private GalleryItemRepository galleryItemRepository;

    public List<GalleryItem> getAllItems() {
        return galleryItemRepository.findAllByOrderByUploadedAtDesc();
    }

    public GalleryItem createItem(GalleryItem item) {
        return galleryItemRepository.save(item);
    }

    public GalleryItem updateItem(Long id, GalleryItem itemDetails) {
        GalleryItem item = galleryItemRepository.findById(id).orElseThrow();
        item.setTitle(itemDetails.getTitle());
        item.setImageUrl(itemDetails.getImageUrl());
        item.setCategory(itemDetails.getCategory());
        return galleryItemRepository.save(item);
    }

    public void deleteItem(Long id) {
        galleryItemRepository.deleteById(id);
    }
}
