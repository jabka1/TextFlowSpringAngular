package team.textflowspringangular.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team.textflowspringangular.config.JwtUtil;
import team.textflowspringangular.dto.UpdateEmailDTO;
import team.textflowspringangular.dto.UpdatePasswordDTO;
import team.textflowspringangular.dto.UserResponseDTO;
import team.textflowspringangular.service.CustomUserDetailsService;

@RestController
@RequestMapping("/account")
public class AccountController {

    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    public AccountController(CustomUserDetailsService userDetailsService, JwtUtil jwtUtil) {
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getUser(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            var user = userDetailsService.getUserByEmail(email);
            return ResponseEntity.ok(new UserResponseDTO(user.getUsername(), user.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/update-email")
    public ResponseEntity<?> updateEmail(@RequestHeader("Authorization") String token,
                                         @RequestBody UpdateEmailDTO updateEmailDTO) {
        try {
            userDetailsService.updateEmail(token.substring(7), updateEmailDTO.getNewEmail());
            return ResponseEntity.ok("Email updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestHeader("Authorization") String token,
                                            @RequestBody UpdatePasswordDTO updatePasswordDTO) {
        try {
            userDetailsService.updatePassword(token.substring(7), updatePasswordDTO.getNewPassword());
            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteAccount(@RequestHeader("Authorization") String token) {
        try {
            userDetailsService.deleteAccount(token.substring(7));
            return ResponseEntity.ok("Account deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}

