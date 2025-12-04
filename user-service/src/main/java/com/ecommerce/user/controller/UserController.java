package com.ecommerce.user.controller;

import com.ecommerce.user.model.User;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;



@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", 1L);
        response.put("email", credentials.get("email"));
        response.put("name", "John Doe");
        response.put("token", "jwt_token_" + System.currentTimeMillis());
        return response;
    }

    @GetMapping("/current")
    public User getCurrentUser() {
        return new User(1L, "guest@example.com", "Guest User", "");
    }
}