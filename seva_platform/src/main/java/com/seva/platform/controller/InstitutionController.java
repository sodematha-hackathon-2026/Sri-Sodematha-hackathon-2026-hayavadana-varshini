package com.seva.platform.controller;

import com.seva.platform.model.Institution;
import com.seva.platform.repository.InstitutionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/institutions")
@CrossOrigin(origins = "*")
public class InstitutionController {

    @Autowired
    private InstitutionRepository institutionRepository;

    @GetMapping
    public List<Institution> getAllInstitutions() {
        return institutionRepository.findAll();
    }

    @PostMapping
    public Institution createInstitution(@RequestBody Institution institution) {
        return institutionRepository.save(institution);
    }

    @PutMapping("/{id}")
    public Institution updateInstitution(@PathVariable Long id, @RequestBody Institution institution) {
        institution.setId(id);
        return institutionRepository.save(institution);
    }

    @DeleteMapping("/{id}")
    public void deleteInstitution(@PathVariable Long id) {
        institutionRepository.deleteById(id);
    }
}
