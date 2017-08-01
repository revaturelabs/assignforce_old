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

    @Around("@annotation(com.RequestMapping) && args(oAuthString, aSessionId)")
    public Object authorize(ProceedingJoinPoint aJoinPoint, String oAuthString, String aSessionId) throws Throwable{
        Integer sessionId = Integer.valueOf(aSessionId);
        if(!theTokenAuthenticator.authorize(oAuthString, sessionId)){
            return new ResponseEntity<ResponseErrorDTO>(HttpStatus.FORBIDDEN);
        }
        return aJoinPoint.proceed();
    }

}
