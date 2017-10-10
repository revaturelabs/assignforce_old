package com.revature.assignforce;

import com.revature.assignforce.domain.Force;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;

/**
 * Application Entry Point
 */
@SpringBootApplication
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableAutoConfiguration
@EnableJpaRepositories(basePackages={"com.revature.assignforce.domain.dao"})
@EntityScan("com.revature.assignforce.domain")
public class AssignForceV2Application {

    @Autowired
    private Force force;

    public static void main(String[] args) {
        SpringApplication.run(AssignForceV2Application.class, args);
    }

    @Bean
    public OAuth2RestTemplate restTemplate(OAuth2ProtectedResourceDetails resource,OAuth2ClientContext context) {
        return new OAuth2RestTemplate(resource, context);
    }
}

