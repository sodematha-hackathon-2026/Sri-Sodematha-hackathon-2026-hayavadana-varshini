package com.seva.platform.controller;

import com.seva.platform.model.LiteraryWork;
import com.seva.platform.repository.LiteraryWorkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/literary-works")
@CrossOrigin(origins = "*")
public class LiteraryWorkController {

    @Autowired
    private LiteraryWorkRepository literaryWorkRepository;

    @GetMapping
    public List<LiteraryWork> getAllWorks() {
        return literaryWorkRepository.findAll();
    }

    @PostMapping
    public LiteraryWork createWork(@RequestBody LiteraryWork work) {
        return literaryWorkRepository.save(work);
    }

    @PutMapping("/{id}")
    public LiteraryWork updateWork(@PathVariable Long id, @RequestBody LiteraryWork work) {
        work.setId(id);
        return literaryWorkRepository.save(work);
    }

    @DeleteMapping("/{id}")
    public void deleteWork(@PathVariable Long id) {
        literaryWorkRepository.deleteById(id);
    }
}
