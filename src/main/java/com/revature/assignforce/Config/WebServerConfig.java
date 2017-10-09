package com.revature.assignforce.Config;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

/**
 * Created by Marquis on 7/12/2017.
 */
@Configuration
@EnableWebSecurity
@EnableOAuth2Sso
public class WebServerConfig extends WebSecurityConfigurerAdapter
{
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .antMatcher("/**")
                .authorizeRequests()
//               .antMatchers("/", "/login**", "/webjars/**")
//               .permitAll()
                .anyRequest().authenticated()
                .and()
                .formLogin().loginPage("/").loginProcessingUrl("/login").defaultSuccessUrl("/home");
//                .and()
//                .logout().deleteCookies("", "JSESSIONID").logoutRequestMatcher(new AntPathRequestMatcher("/logout")).invalidateHttpSession(true);
    }
}