package com.revature.assignforce.security;

import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2RefreshToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Component
public class OAuth2TokenStore implements TokenStore {

    private Map<String, OAuthTokenWrapper> theTokens;

    public OAuth2TokenStore(){
        theTokens = new HashMap<String, OAuthTokenWrapper>();
    }

    public void createSession(Integer aSessionId, OAuth2AccessToken aToken,
                              OAuth2Authentication anAuth){
        storeAccessToken(aToken, anAuth);
        OAuthTokenWrapper tokenWrapper = theTokens.get(aToken.getValue());
        tokenWrapper.setjSessionId(aSessionId);

    }

    @Override
    public OAuth2Authentication readAuthentication(OAuth2AccessToken oAuth2AccessToken) {
        return theTokens.get(oAuth2AccessToken.getValue()).getOAuth2Authentication();
    }

    @Override
    public OAuth2Authentication readAuthentication(String s) {
        return theTokens.get(s).getOAuth2Authentication();
    }

    @Override
    public void storeAccessToken(OAuth2AccessToken oAuth2AccessToken, OAuth2Authentication oAuth2Authentication) {
        OAuthTokenWrapper tokenWrapper = new OAuthTokenWrapper(oAuth2AccessToken, oAuth2Authentication);
        theTokens.put(oAuth2AccessToken.getValue(), tokenWrapper);
    }

    @Override
    public OAuth2AccessToken readAccessToken(String s) {
        return theTokens.get(s).getAuth2AccessToken();
    }

    @Override
    public void removeAccessToken(OAuth2AccessToken oAuth2AccessToken) {
        theTokens.remove(oAuth2AccessToken.getValue());
    }

    @Override
    public void storeRefreshToken(OAuth2RefreshToken oAuth2RefreshToken, OAuth2Authentication oAuth2Authentication) {
        theTokens.put(oAuth2RefreshToken.getValue(),
                new OAuthTokenWrapper(oAuth2RefreshToken, oAuth2Authentication));
    }

    @Override
    public OAuth2RefreshToken readRefreshToken(String s) {
        return theTokens.get(s).getOAuth2RefreshToken();
    }

    @Override
    public OAuth2Authentication readAuthenticationForRefreshToken(OAuth2RefreshToken oAuth2RefreshToken) {
        return theTokens.get(oAuth2RefreshToken.getValue()).getOAuth2Authentication();
    }

    @Override
    public void removeRefreshToken(OAuth2RefreshToken oAuth2RefreshToken) {
        theTokens.remove(oAuth2RefreshToken.getValue());
    }

    @Override
    public void removeAccessTokenUsingRefreshToken(OAuth2RefreshToken oAuth2RefreshToken) {
        theTokens.remove(oAuth2RefreshToken.getValue());
    }

    //NOT IMPLEMENTED
    @Override
    public OAuth2AccessToken getAccessToken(OAuth2Authentication oAuth2Authentication) {
        return null;
    }

    //NOT IMPLEMENTED
    @Override
    public Collection<OAuth2AccessToken> findTokensByClientIdAndUserName(String s, String s1) {
        return null;
    }

    //NOT IMPLEMENTED
    @Override
    public Collection<OAuth2AccessToken> findTokensByClientId(String s) {
        return null;
    }
}
