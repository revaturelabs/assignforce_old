package  com.revature.assignforce.Config;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
/**
 * Created by Marquis on 7/12/2017.
 */
@Configuration
@EnableWebSecurity

public class ResourceServerConfig extends ResourceServerConfigurerAdapter
{
//    private static final String resource_id = "rest-resources";
//    //    @Override
////    public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
////        super.configure(resources);
////        resources.resourceId(resource_id);
////    }
//    @Override
//    public void configure(WebSecurity web) throws Exception{
//        web.ignoring().antMatchers("/**");
//    }
    @Override
    public void configure(HttpSecurity http) throws Exception {

        http.authorizeRequests()


//                .antMatchers(HttpMethod.PUT, "/api/**").access("#oauth2.hasScope('resource-server-write')")
//                .antMatchers(HttpMethod.DELETE, "/api/**").access("#oauth2.hasScope('resource-server-write')")
//                .antMatchers(HttpMethod.GET, "/api/v2").access("#oauth2.hasScope('resource-server-read')")
//                .antMatchers(HttpMethod.OPTIONS).permitAll()
                //.antMatchers("/").permitAll()

               .antMatchers(HttpMethod.POST, "/api/v2/test").permitAll();
//                .anyRequest().authenticated();
//                .antMatchers("/").permitAll();
//                .and()
//                .formLogin().permitAll();
//                .and()
//                .cors();

//        http
//                .authorizeRequests()
//                .antMatchers("/home").hasRole("Trainer");

    }
}