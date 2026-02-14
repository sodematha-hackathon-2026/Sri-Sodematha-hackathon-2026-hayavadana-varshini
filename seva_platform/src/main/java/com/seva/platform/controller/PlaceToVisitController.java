package com.seva.platform.controller;

import com.seva.platform.model.PlaceToVisit;
import com.seva.platform.repository.PlaceToVisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@CrossOrigin(origins = "*")
public class PlaceToVisitController {

    @Autowired
    private PlaceToVisitRepository repository;

    @GetMapping
    public List<PlaceToVisit> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public PlaceToVisit create(@RequestBody PlaceToVisit place) {
        return repository.save(place);
    }

    @PutMapping("/{id}")
    public PlaceToVisit update(@PathVariable Long id, @RequestBody PlaceToVisit place) {
        place.setId(id);
        return repository.save(place);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
