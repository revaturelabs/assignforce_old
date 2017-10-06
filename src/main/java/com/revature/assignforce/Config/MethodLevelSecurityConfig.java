package com.revature.assignforce.Config;

import com.revature.assignforce.security.CustomSecurity;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.GlobalMethodSecurityConfiguration;

@Configuration
@EnableAutoConfiguration
public class MethodLevelSecurityConfig {//extends GlobalMethodSecurityConfiguration {

//    @Override
    @Bean
    protected MethodSecurityExpressionHandler createExpressionHandler() {
        DefaultMethodSecurityExpressionHandler expressionHandler = new DefaultMethodSecurityExpressionHandler();
        expressionHandler.setPermissionEvaluator(new CustomSecurity());
        return expressionHandler;
    }

//    @Bean
//    public DefaultMethodSecurityExpressionHandler expressionHandler()
//    {
//        DefaultMethodSecurityExpressionHandler handler = new DefaultMethodSecurityExpressionHandler();
//        handler.setPermissionEvaluator(new CustomSecurity());
//        return handler;
//    }
}