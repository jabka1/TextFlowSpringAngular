package team.textflowspringangular.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import team.textflowspringangular.model.UserModel;
import team.textflowspringangular.repository.UserRepository;
import team.textflowspringangular.config.JwtUtil;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public CustomUserDetailsService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public UserModel getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public void updateEmail(String token, String newEmail) {
        String username = jwtUtil.extractUsername(token);
        UserModel user = getUserByEmail(username);
        if (userRepository.findByEmail(newEmail).isPresent()) {
            throw new IllegalArgumentException("Email is already in use");
        }
        user.setEmail(newEmail);
        userRepository.save(user);
    }

    public void updatePassword(String token, String newPassword) {
        String username = jwtUtil.extractUsername(token);
        UserModel user = getUserByEmail(username);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);
    }

    public void deleteAccount(String token) {
        String username = jwtUtil.extractUsername(token);
        UserModel user = getUserByEmail(username);
        userRepository.delete(user);
    }
}
