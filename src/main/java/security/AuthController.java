package security;

import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by Mituldeveloper on 7/13/2017.
 */
@RestController
@RequestMapping(value = "/api/v2")
public class AuthController {


    //    @Autowired
//    private Force force;
//
//    @RequestMapping("/auth")
//    public List<Force.Trainer> accounts(OAuth2Authentication principal) {
//        return force.accounts(principal);
//    }
    @RequestMapping(value = "/auth", method = RequestMethod.POST)
    public OAuth2Authentication getUser(OAuth2Authentication auth, HttpServletResponse response) {
        System.out.println("Authorized");
        return auth;
    }
}

