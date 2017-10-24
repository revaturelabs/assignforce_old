package com.revature.assignforce.utils;

import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.OAuth2Request;

import java.io.Serializable;
import java.util.*;

public class OAuthMockery {

    public Authentication getOauthTestAuthentication() {
        return new OAuth2Authentication(getOauth2Request(), getAuthentication());
    }

    private OAuth2Request getOauth2Request() {

        String clientId = "3MVG9ahGHqp.k2_wb8eUMtoR38zX8fWod2YBcK5.4RRrWling4BGamz7JanMJTUGcXxI9qda4fQh3xU0Q9EBH";
        Map<String, String> requestParameters = Collections.emptyMap();
        boolean approved = true;
        String redirectUrl = "https://localhost:8443/home";
        Set<String> responseTypes = Collections.emptySet();
        Set<String> scopes = Collections.emptySet();
        Set<String> resourceIds = Collections.emptySet();
        Map<String, Serializable> extensionProperties = Collections.emptyMap();
        List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("Everything");

        OAuth2Request oAuth2Request = new OAuth2Request(requestParameters, clientId, authorities, approved, scopes, resourceIds, redirectUrl, responseTypes, extensionProperties);

        return oAuth2Request;
    }

    private Authentication getAuthentication() {
        List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("Everything");

        User userPrincipal = new User("user", "", true, true, true, true, authorities);

        HashMap<String, String> details = new HashMap<String, String>();
//        details.put("user_name", "test.trainer");
//        details.put("email", "test.trainer@revature.com.int1");
//        details.put("name", "Test Trainer");
        details.put("family", "Trainer");

        TestingAuthenticationToken token = new TestingAuthenticationToken(userPrincipal, null, authorities);
        token.setAuthenticated(true);
        token.setDetails(details);

        return token;
    }
}
