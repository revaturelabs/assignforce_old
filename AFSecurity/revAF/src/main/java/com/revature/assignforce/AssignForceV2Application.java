package com.revature.assignforce;

import com.revature.assignforce.domain.Employee;
import com.revature.assignforce.web.AuthController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Application Entry Point
 */
@SpringBootApplication
@EnableJpaRepositories(basePackages={"com.revature.assignforce.domain.dao"})
@EntityScan("com.revature.assignforce.domain")
@EnableOAuth2Sso
public class AssignForceV2Application {

//	@Autowired
//	private Force force;
//    @Qualifier("oauth2ClientContext")
//    @Autowired
//    private OAuth2ClientContext context;
//

//	@RequestMapping("/home")
//	public List<Force> employees(OAuth2Authentication auth)
//	{
//		System.out.println(force.getRole(auth));
//		System.out.println(auth.getUserAuthentication().getDetails());
//		return (List<Force>) force.getRole(auth);
//
//	}

//	@RequestMapping("/home")
//	public OAuth2Authentication getUser(OAuth2Authentication auth)
//	{
//
//		System.out.println("Authorized XZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" + (OAuth2Authentication) auth.getUserAuthentication().getDetails());
//		return (OAuth2Authentication) auth.getUserAuthentication().getDetails();
//
//
//	}


	public static void main(String[] args) {

		SpringApplication.run(AssignForceV2Application.class, args);
		//OAuth2Authentication auth = new OAuth2Authentication()

		//System.out.println( "DDDDDDDDDDDDDDDDDDD"+  auth.getUserAuthentication().getDetails());
//		AuthController au = new AuthController();
//
//		Object auth;
//		OAuth2Authentication auth;
//		HttpServletResponse res;
//				au.getUser(OAuth2Authentication auth, HttpServletResponse res);
	}

	@Bean
	public OAuth2RestTemplate restTemplate(OAuth2ProtectedResourceDetails resource, @Qualifier("oauth2ClientContext") OAuth2ClientContext context) {
		return new OAuth2RestTemplate(resource, context);
	}

	//public void authManager(AuthenticationManagerBuilder b, )

//    @Configuration
//    @EnableWebSecurity
//    @EnableAuthorizationServer
//    public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
//        @Override
//        protected void configure(HttpSecurity http) throws Exception {
//            http
//                    .authorizeRequests()
//                    .antMatchers("/","/index", "/indexTest").permitAll()
//                    .anyRequest().authenticated();
//
////        @Autowired
////        public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
////            auth
////                    .inMemoryAuthentication()
////                    .withUser("user").password("password").roles("USER");
//        }
//    }

//    @Configuration
//    public class MvcConfig extends WebMvcConfigurerAdapter {
//
//        @Override
//        public void addViewControllers(ViewControllerRegistry registry) {
//            registry.addViewController("/home").setViewName("home");
//            registry.addViewController("/").setViewName("home");
//            registry.addViewController("/hello").setViewName("hello");
//            registry.addViewController("/login").setViewName("login");
//        }
//
//    }

//    @RestController
//    public class Controller {
//
//        @RequestMapping({ "/user", "/me" })
//        public Map<String, String> user(Principal principal) {
//            Map<String, String> map = new LinkedHashMap<>();
//            map.put("name", principal.getName());
//            return map;
//        }
//    }

//    @Configuration
//    @EnableResourceServer
//    public class ResourceServer
//            extends ResourceServerConfigurerAdapter {
//        @Override
//        public void configure(HttpSecurity http) throws Exception {
//            http
//                    .antMatcher("/home")
//                    .authorizeRequests().anyRequest().authenticated();
//        }
//    }
//@RestController
//class UserController{
//    @RequestMapping("/auth/user")
//    public Principal getUser(Principal user){
//        return user;
//    }
//}
//
//    @CrossOrigin
//    @RestController
//    @RequestMapping("/api")
//    class ApiController{
//        private String message="YOU FINALLY GOT ALL THIS CRAP WORKING";
//
//        @RequestMapping(value="/message", method= RequestMethod.GET, produces= MediaType.APPLICATION_JSON_VALUE)
//        public Map<String, String> getMessage(){
//            return Collections.singletonMap("message", message);
//        }
//    }

}
