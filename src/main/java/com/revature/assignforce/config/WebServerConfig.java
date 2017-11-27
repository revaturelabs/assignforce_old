package com.revature.assignforce.config;

import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * Created by Marquis on 7/12/2017.
 */
@Configuration
@EnableWebSecurity
@EnableOAuth2Sso
public class WebServerConfig extends WebSecurityConfigurerAdapter {
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// require https
		http.requiresChannel().antMatchers("/**").requiresSecure();
		http.csrf().disable().antMatcher("/**").authorizeRequests().anyRequest().authenticated().and().formLogin()
				.loginPage("/").loginProcessingUrl("/login").defaultSuccessUrl("/home");
	}
}