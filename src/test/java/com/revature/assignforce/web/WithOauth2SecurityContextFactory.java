package com.revature.assignforce.web;

import com.google.gson.Gson;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.OAuth2Request;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

import java.util.Collections;
import java.util.HashMap;

public class WithOauth2SecurityContextFactory implements WithSecurityContextFactory<WithOAuth2Authentication> {

    @Override
    public SecurityContext createSecurityContext(WithOAuth2Authentication withOAuth2Authentication) {
        System.out.println("Creating security context");
        OAuth2Request oAuth2Request= new OAuth2Request(null, withOAuth2Authentication.clientId(),
                null, true, Collections.emptySet(), null, null, null, null);

        TestingAuthenticationToken token = new TestingAuthenticationToken(withOAuth2Authentication.username(), null, "everything");
        HashMap<String, String> details = new HashMap<>();
        details.put("family", withOAuth2Authentication.family());
        token.setDetails(details);

        Authentication authentication = new OAuth2Authentication(oAuth2Request,token);
        String principal = new Gson().toJson(authentication);
        System.out.println(principal);

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        return context;
    }
}
