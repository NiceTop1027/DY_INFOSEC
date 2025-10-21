package kr.hs.dukyoung.infosec;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class InfoSecApplication {
    public static void main(String[] args) {
        SpringApplication.run(InfoSecApplication.class, args);
    }
}
