package kr.hs.dukyoung.infosec.controller;

import jakarta.validation.Valid;
import kr.hs.dukyoung.infosec.dto.auth.JwtResponse;
import kr.hs.dukyoung.infosec.dto.auth.LoginRequest;
import kr.hs.dukyoung.infosec.dto.auth.SignupRequest;
import kr.hs.dukyoung.infosec.dto.common.ApiResponse;
import kr.hs.dukyoung.infosec.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<JwtResponse>> signup(@Valid @RequestBody SignupRequest request) {
        JwtResponse response = authService.signup(request);
        return ResponseEntity.ok(ApiResponse.success("회원가입이 완료되었습니다.", response));
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest request) {
        JwtResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("로그인 성공", response));
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<JwtResponse>> refreshToken(@RequestParam String refreshToken) {
        JwtResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping("/check-username")
    public ResponseEntity<ApiResponse<Boolean>> checkUsername(@RequestParam String username) {
        Boolean available = authService.isUsernameAvailable(username);
        return ResponseEntity.ok(ApiResponse.success(available));
    }
    
    @GetMapping("/check-email")
    public ResponseEntity<ApiResponse<Boolean>> checkEmail(@RequestParam String email) {
        Boolean available = authService.isEmailAvailable(email);
        return ResponseEntity.ok(ApiResponse.success(available));
    }
}
