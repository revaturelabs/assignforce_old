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

    public String createSession(String jSessionId,
                                OAuth2AccessToken aToken,
                                 OAuth2Authentication anAuth){
        String aSessionId = String.valueOf(rando.nextInt());
        theTokenStore.createSession(jSessionId, aToken, anAuth);
        return aSessionId;
    }

    public Boolean authorize(String oAuthString, String sessionId){
        OAuthTokenWrapper anOAuthTokenWrapper = theTokenStore.getTokenWrapper(oAuthString);
        Boolean flag = (anOAuthTokenWrapper != null);
        flag = flag && sessionId.equals(anOAuthTokenWrapper.getjSessionId());
        return flag;
    }

    public void setSessionIdFor(OAuth2AccessToken accessToken, String jSessionId) {
        theTokenStore.setSessionIdFor(accessToken, jSessionId);
    }

    public OAuthTokenWrapper getWrapperFor(String tokenValue){
        return theTokenStore.getTokenWrapper(tokenValue);
    }
}
