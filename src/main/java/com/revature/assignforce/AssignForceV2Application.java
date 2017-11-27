package com.revature.assignforce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Application Entry Point
 */
@SpringBootApplication
@EnableJpaRepositories(basePackages={"com.revature.assignforce.domain.dao"})
@EntityScan("com.revature.assignforce.domain")
public class AssignForceV2Application {

	public static void main(String[] args) {
		SpringApplication.run(AssignForceV2Application.class, args);
	}

}
