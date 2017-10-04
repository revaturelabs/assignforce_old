package com.revature.assignforce.web;

import org.springframework.security.test.context.support.WithSecurityContext;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
@WithSecurityContext(factory = WithOauth2SecurityContextFactory.class)
public @interface WithOAuth2Authentication {
    String clientId() default "client-id";
    String username() default "username";
    String family() default "Trainer";
}
