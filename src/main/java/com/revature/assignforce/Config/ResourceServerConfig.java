//package com.revature.assignforce.Config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
//import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
//import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
//
///**
// * Created by Marquis on 7/12/2017.
// */
//@Configuration
//@EnableResourceServer
//public class ResourceServerConfig extends ResourceServerConfigurerAdapter
//{
//    private static final String resource_id = "rest-resources";
//
//    @Override
//    public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
////        super.configure(resources);
//        resources.resourceId(resource_id);
//    }
//
//    @Override
//    public void configure(HttpSecurity http) throws Exception {
//        //super.configure(http);
////        http.authorizeRequests()
////                .antMatchers("/login").authenticated()
////                .antMatchers(HttpMethod.POST, "/api/v2").access("#oauth2.hasScope('resource-server-write')")
//////                .antMatchers(HttpMethod.PUT, "/api/**").access("#oauth2.hasScope('resource-server-write')")
//////                .antMatchers(HttpMethod.DELETE, "/api/**").access("#oauth2.hasScope('resource-server-write')")
////                //.antMatchers(HttpMethod.GET, "/api/v2").access("#oauth2.hasScope('resource-server-read')")
////                //.antMatchers(HttpMethod.OPTIONS).permitAll()
////                .antMatchers("/home").permitAll();
//////                .and()
//////                .formLogin().permitAll()
//////                .and()
//////                .cors();
//
//        http
//                .authorizeRequests()
//                .antMatchers("/home").hasRole("Trainer");
//
//    }
//}
