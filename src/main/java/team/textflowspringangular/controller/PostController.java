package team.textflowspringangular.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team.textflowspringangular.config.JwtUtil;
import team.textflowspringangular.dto.PostDTO;
import team.textflowspringangular.dto.PostResponseDTO;
import team.textflowspringangular.service.PostService;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;
    private final JwtUtil jwtUtil;

    public PostController(PostService postService, JwtUtil jwtUtil) {
        this.postService = postService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/create_post")
    public ResponseEntity<PostResponseDTO> createPost(@RequestHeader("Authorization") String token,
                                                      @RequestBody PostDTO postDTO) {
        String jwtToken = token.substring(7);
        try {
            PostResponseDTO postResponse = postService.createPost(jwtToken, postDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(postResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<PostResponseDTO>> getAllPosts() {
        List<PostResponseDTO> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDTO> getPostById(@PathVariable Long id) {
        PostResponseDTO post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    @PutMapping("edit_post/{id}")
    public ResponseEntity<PostResponseDTO> updatePost(@RequestHeader("Authorization") String token,
                                                      @PathVariable Long id,
                                                      @RequestBody PostDTO postDTO) {
        String jwtToken = token.substring(7);
        try {
            PostResponseDTO updatedPost = postService.updatePost(id, jwtToken, postDTO);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("delete_post/{id}")
    public ResponseEntity<String> deletePost(@RequestHeader("Authorization") String token,
                                             @PathVariable Long id) {
        String jwtToken = token.substring(7);
        try {
            postService.deletePost(id, jwtToken);
            return ResponseEntity.ok("Post deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error deleting post");
        }
    }
}
