package com.revature.assignforce.security;

import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Component
public class OAuth2TokenAuthenticator {

    private OAuth2TokenStore theTokenStore = null;

    private SecureRandom rando = null;

    public OAuth2TokenAuthenticator(){
        theTokenStore = new OAuth2TokenStore();
        rando = new SecureRandom(
                new Long(LocalDateTime.now()
                        .toEpochSecond(ZoneOffset.UTC))
                        .toString().getBytes());
    }

    public Integer createSession(OAuth2AccessToken aToken,
                                 OAuth2Authentication anAuth){
        Integer aSessionId = rando.nextInt();
        theTokenStore.createSession(aSessionId, aToken, anAuth);
        return aSessionId;
    }

    public Boolean authorize(String OAuthString, Integer sessionId){
        return null;
    }
}
