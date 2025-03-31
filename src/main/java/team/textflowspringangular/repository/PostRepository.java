package team.textflowspringangular.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import team.textflowspringangular.model.PostModel;
import team.textflowspringangular.model.UserModel;

import java.util.List;

public interface PostRepository extends JpaRepository<PostModel, Long> {
    List<PostModel> findByUserId(Long userId);

    @Transactional
    void deleteByUser(UserModel user);
}
