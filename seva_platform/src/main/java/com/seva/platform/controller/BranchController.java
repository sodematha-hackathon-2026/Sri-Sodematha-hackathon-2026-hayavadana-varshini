package com.seva.platform.controller;

import com.seva.platform.model.Branch;
import com.seva.platform.repository.BranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
@CrossOrigin(origins = "*")
public class BranchController {

    @Autowired
    private BranchRepository branchRepository;

    @GetMapping
    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    @PostMapping
    public Branch createBranch(@RequestBody Branch branch) {
        return branchRepository.save(branch);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Branch> updateBranch(@PathVariable Long id, @RequestBody Branch branchDetails) {
        return branchRepository.findById(id)
                .map(branch -> {
                    branch.setName(branchDetails.getName());
                    branch.setNameKa(branchDetails.getNameKa());
                    branch.setLocation(branchDetails.getLocation());
                    branch.setLocationKa(branchDetails.getLocationKa());
                    branch.setContact(branchDetails.getContact());
                    branch.setEmail(branchDetails.getEmail());
                    branch.setMapUrl(branchDetails.getMapUrl());
                    branch.setImageUrl(branchDetails.getImageUrl());
                    return ResponseEntity.ok(branchRepository.save(branch));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBranch(@PathVariable Long id) {
        return branchRepository.findById(id)
                .map(branch -> {
                    branchRepository.delete(branch);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
