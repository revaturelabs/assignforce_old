package com.revature.assignforce.security;

import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2RefreshToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;

public class OAuthTokenWrapper {



    private OAuth2Authentication oAuth2Authentication = null;

    private OAuth2AccessToken oAuth2AccessToken = null;

    private OAuth2RefreshToken oAuth2RefreshToken = null;

    private Integer jSessionId = 0;

    public OAuthTokenWrapper(){}

    public OAuthTokenWrapper(OAuth2AccessToken token, OAuth2Authentication auth){
        oAuth2Authentication = auth;
        oAuth2AccessToken = token;
    }

    public OAuthTokenWrapper(OAuth2RefreshToken token, OAuth2Authentication auth){
        oAuth2Authentication = auth;
        oAuth2RefreshToken = token;
    }

    public OAuth2AccessToken getAuth2AccessToken() {
        return oAuth2AccessToken;
    }

    public OAuth2Authentication getOAuth2Authentication() {
        return oAuth2Authentication;
    }

    public void setOAuth2Authentication(OAuth2Authentication auth){
        oAuth2Authentication = auth;
    }

    public void setoAuth2AccessToken(OAuth2AccessToken token){
        oAuth2AccessToken = token;
    }

    public Integer getjSessionId() {
        return jSessionId;
    }

    public void setjSessionId(Integer jSessionId) {
        this.jSessionId = jSessionId;
    }
    public OAuth2RefreshToken getOAuth2RefreshToken() {
        return oAuth2RefreshToken;
    }

    public void setOAuth2RefreshToken(OAuth2RefreshToken oAuth2RefreshToken) {
        this.oAuth2RefreshToken = oAuth2RefreshToken;
    }

}
