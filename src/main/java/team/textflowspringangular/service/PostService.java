package team.textflowspringangular.service;

import org.springframework.stereotype.Service;
import team.textflowspringangular.dto.PostDTO;
import team.textflowspringangular.dto.PostResponseDTO;
import team.textflowspringangular.model.PostModel;
import team.textflowspringangular.model.UserModel;
import team.textflowspringangular.repository.PostRepository;
import team.textflowspringangular.repository.UserRepository;
import team.textflowspringangular.config.JwtUtil;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public PostService(PostRepository postRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    private String extractUsernameFromToken(String token) {
        return jwtUtil.extractUsername(token);
    }

    public PostResponseDTO createPost(String token, PostDTO postDTO) {
        String username = extractUsernameFromToken(token);
        UserModel user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        PostModel post = new PostModel();
        post.setTitle(postDTO.getTitle());
        post.setContent(postDTO.getContent());
        post.setUser(user);
        postRepository.save(post);

        return new PostResponseDTO(post.getId(), post.getTitle(), post.getContent(), user.getUsername());
    }

    public List<PostResponseDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(post -> new PostResponseDTO(post.getId(), post.getTitle(), post.getContent(), post.getUser().getUsername()))
                .collect(Collectors.toList());
    }

    public PostResponseDTO getPostById(Long id) {
        PostModel post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        return new PostResponseDTO(post.getId(), post.getTitle(), post.getContent(), post.getUser().getUsername());
    }

    public PostResponseDTO updatePost(Long id, String token, PostDTO postDTO) {
        String username = extractUsernameFromToken(token);
        PostModel post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (!post.getUser().getUsername().equals(username)) {
            throw new SecurityException("You can only edit your own posts");
        }

        post.setTitle(postDTO.getTitle());
        post.setContent(postDTO.getContent());
        postRepository.save(post);

        return new PostResponseDTO(post.getId(), post.getTitle(), post.getContent(), post.getUser().getUsername());
    }

    public void deletePost(Long id, String token) {
        String username = extractUsernameFromToken(token);
        PostModel post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (!post.getUser().getUsername().equals(username)) {
            throw new SecurityException("You can only delete your own posts");
        }

        postRepository.delete(post);
    }
}
