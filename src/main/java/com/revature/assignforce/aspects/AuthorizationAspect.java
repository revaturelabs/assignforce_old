package com.revature.assignforce.aspects;

import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.revature.assignforce.security.OAuth2TokenAuthenticator;
import org.aspectj.lang.JoinPoint;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuthorizationAspect {

    @Autowired
    OAuth2TokenAuthenticator theTokenAuthenticator;
    @Around("@annotation(com.revature.assignforce.annotations.Authorize) && args(cookieSessionIdCookie, tokenValue,..)")
    public Object authorize(ProceedingJoinPoint aJoinPoint, String tokenValue, String cookieSessionIdCookie) throws Throwable{

        if(!theTokenAuthenticator.authorize(tokenValue, cookieSessionIdCookie)){
            return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Could not authorize the given CSRF token & Session ID combination."), HttpStatus.FORBIDDEN);
        }
        return aJoinPoint.proceed();
    }

}
