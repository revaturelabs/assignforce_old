////package  com.revature.assignforce.Config;
//<<<<<<< HEAD
////        import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
////        import org.springframework.context.annotation.Configuration;
////        import org.springframework.http.HttpMethod;
////        import org.springframework.security.config.annotation.web.builders.HttpSecurity;
////        import org.springframework.security.config.annotation.web.builders.WebSecurity;
////        import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
////        import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration;
////        import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
////        import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
////        import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
////        import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
//=======
////import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
////import org.springframework.context.annotation.Configuration;
////import org.springframework.http.HttpMethod;
////import org.springframework.security.config.annotation.web.builders.HttpSecurity;
////import org.springframework.security.config.annotation.web.builders.WebSecurity;
////import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
////import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration;
////import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
////import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
////import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
////import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
//>>>>>>> 1a1e01efd677acad396284083481ef4ff6be09a0
/////**
//// * Created by Marquis on 7/12/2017.
//// */
////@Configuration
//<<<<<<< HEAD
////
////
//=======
////@EnableWebSecurity
////@EnableOAuth2Sso
//>>>>>>> 1a1e01efd677acad396284083481ef4ff6be09a0
////public class ResourceServerConfig extends ResourceServerConfigurerAdapter
////{
//////    private static final String resource_id = "rest-resources";
//////    //    @Override
////////    public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
////////        super.configure(resources);
////////        resources.resourceId(resource_id);
////////    }
//////    @Override
//////    public void configure(WebSecurity web) throws Exception{
//////        web.ignoring().antMatchers("/**");
//////    }
////    @Override
////    public void configure(HttpSecurity http) throws Exception {
////
////        http.authorizeRequests()
//<<<<<<< HEAD
////
////
//////                .antMatchers(HttpMethod.POST, "/api/v2").access("#oauth2.hasScope('resource-server-write')")
//=======
//>>>>>>> 1a1e01efd677acad396284083481ef4ff6be09a0
//////                .antMatchers(HttpMethod.PUT, "/api/**").access("#oauth2.hasScope('resource-server-write')")
//////                .antMatchers(HttpMethod.DELETE, "/api/**").access("#oauth2.hasScope('resource-server-write')")
//////                .antMatchers(HttpMethod.GET, "/api/v2").access("#oauth2.hasScope('resource-server-read')")
//////                .antMatchers(HttpMethod.OPTIONS).permitAll()
////                //.antMatchers("/").permitAll()
//<<<<<<< HEAD
//////                .antMatchers("/").permitAll()
////                .antMatchers("/api/**").permitAll();
//=======
//////                .antMatchers(HttpMethod.POST, "/api/v2/**").permitAll();
////            .antMatchers("/api/v2/**").permitAll();
//>>>>>>> 1a1e01efd677acad396284083481ef4ff6be09a0
//////                .anyRequest().authenticated();
//////                .antMatchers("/").permitAll();
//////                .and()
//////                .formLogin().permitAll();
//////                .and()
//////                .cors();
////
//////        http
//////                .authorizeRequests()
//////                .antMatchers("/home").hasRole("Trainer");
////
////    }
////}