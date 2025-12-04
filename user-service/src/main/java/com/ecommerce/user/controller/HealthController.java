package com.ecommerce.user.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/users/health")
    public String health() {
        return "OK";
    }
}
