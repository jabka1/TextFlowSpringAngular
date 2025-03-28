package team.textflowspringangular.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import team.textflowspringangular.model.UserModel;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserModel, Long> {
    Optional<UserModel> findByUsername(String username);
    Optional<UserModel> findByEmail(String email);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
