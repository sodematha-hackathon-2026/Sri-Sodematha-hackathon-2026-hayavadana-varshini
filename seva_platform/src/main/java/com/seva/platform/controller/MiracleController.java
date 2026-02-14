package com.seva.platform.controller;

import com.seva.platform.model.Miracle;
import com.seva.platform.repository.MiracleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/miracles")
@CrossOrigin(origins = "*")
public class MiracleController {

    @Autowired
    private MiracleRepository miracleRepository;

    @GetMapping
    public List<Miracle> getAllMiracles() {
        return miracleRepository.findAll();
    }

    @PostMapping
    public Miracle createMiracle(@RequestBody Miracle miracle) {
        return miracleRepository.save(miracle);
    }

    @PutMapping("/{id}")
    public Miracle updateMiracle(@PathVariable Long id, @RequestBody Miracle miracle) {
        miracle.setId(id);
        return miracleRepository.save(miracle);
    }

    @DeleteMapping("/{id}")
    public void deleteMiracle(@PathVariable Long id) {
        miracleRepository.deleteById(id);
    }
}
