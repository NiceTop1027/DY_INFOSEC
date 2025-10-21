package kr.hs.dukyoung.infosec.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;
    
    @NotBlank
    @Size(max = 100)
    @Email
    private String email;
    
    @NotBlank
    @Size(min = 6, max = 100)
    private String password;
    
    @NotBlank
    @Size(max = 50)
    private String name;
    
    @Size(max = 20)
    private String phone;
    
    @Size(max = 10)
    private String birthDate;
    
    @Size(max = 10)
    private String gender;
}
