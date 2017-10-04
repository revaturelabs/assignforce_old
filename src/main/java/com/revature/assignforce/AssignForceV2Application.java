package com.revature.assignforce;

//import com.revature.assignforce.domain.Force;
import com.revature.assignforce.domain.Force;
import org.springframework.beans.factory.annotation.Autowired;
        import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;

/**
 * Application Entry Point
 */
@SpringBootApplication
@EnableJpaRepositories(basePackages={"com.revature.assignforce.domain.dao"})
@EntityScan("com.revature.assignforce.domain")
@EnableOAuth2Sso
public class AssignForceV2Application {

    @Autowired
    private Force force;

//    @RequestMapping("/accounts")
//    public List<Force.Account> accounts(OAuth2Authentication principal) {
//        return force.accounts(principal);
//    }

    public static void main(String[] args) {
        SpringApplication.run(AssignForceV2Application.class, args);
    }

    @Bean
    public OAuth2RestTemplate restTemplate(OAuth2ProtectedResourceDetails resource,OAuth2ClientContext context) {
        return new OAuth2RestTemplate(resource, context);
    }
}

