//package com.revature.assignforce.Config;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
//import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurer;
//import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
//import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
//import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
//import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
//
///**
// * Created by Marquis on 7/12/2017.
// */
//@Configuration
//@EnableAuthorizationServer
//public class AuthServerConfig implements AuthorizationServerConfigurer
//{
//    @Autowired
//    private AuthenticationManager authenticationManager;
//
//    @Override
//    public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {
//        //super.configure(security);
//        security.tokenKeyAccess("permittAll()")
//                .checkTokenAccess("isAuthenticated()");
//
//    }
//
//    @Override
//    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
//        //super.configure(clients);
//        clients.inMemory()
//                .withClient("client-one")
//                //.authorizedGrantTypes("3MVG9ahGHqp.k2_wb8eUMtoR38zX8fWod2YBcK5.4RRrWling4BGamz7JanMJTUGcXxI9qda4fQh3xU0Q9EBH", "password")
//                //.authorities("ROLE_CLIENT", "ROLE_TRUSTED_CLIENT")
//                .authorizedGrantTypes("implicit")
//                .scopes("resource-server-read", "resource-server-write")
//                .resourceIds("oauth2-resource")
//                .accessTokenValiditySeconds(3000)
//                .redirectUris("http://localhost:8080/home.html")
//                .secret("627716562932653016");
//
//    }
//
//    @Override
//    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
//        //super.configure(endpoints);
//        endpoints//.tokenStore(tokenStore())
//                .authenticationManager(authenticationManager);
//
//    }
//}
