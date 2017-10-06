//package com.revature.assignforce.Config;
//import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.builders.WebSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
//
///**
// * Created by Marquis on 7/12/2017.
// */
//@Configuration
//@EnableWebSecurity
//@EnableOAuth2Sso
//public class WebServerConfig extends WebSecurityConfigurerAdapter
//{
//    @Override
//    public void configure(HttpSecurity http) throws Exception {
//        http.authorizeRequests()
//                .antMatchers(HttpMethod.POST, "/api/v2/**").permitAll();
////                .antMatchers("/*").permitAll()
////            .and()
////                .csrf().disable();
//    }
//}