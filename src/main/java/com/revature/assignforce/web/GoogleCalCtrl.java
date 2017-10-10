package com.revature.assignforce.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.services.calendar.model.EventDateTime;
import com.revature.assignforce.domain.Unavailable;
import com.revature.assignforce.domain.dao.UnavailableRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import com.google.api.client.auth.oauth2.AuthorizationCodeRequestUrl;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets.Details;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.Event;

@Controller
@Api(value = "Google Calendar Controller", description = "CRUD with the google API")
public class GoogleCalCtrl {

    private final static Log logger = LogFactory.getLog(GoogleCalCtrl.class);
    private static final String APPLICATION_NAME = "";
    private static HttpTransport httpTransport;
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    private static com.google.api.services.calendar.Calendar client;

    GoogleClientSecrets clientSecrets;
    GoogleAuthorizationCodeFlow flow;
    Credential credential;

    @Value("${google.client.client-id}")
    private String clientId;
    @Value("${google.client.client-secret}")
    private String clientSecret;
    @Value("${google.client.redirectUri}")
    private String redirectURI;

    @Value("${google.calendar.id}")
    private String googleCalendarId;

    @Autowired
    private UnavailableRepository uDAO;

    @ApiOperation(value = "redirect the view")
    @ApiResponses({
            @ApiResponse(code=200, message ="Successfully authorized the redirection of the view"),
            @ApiResponse(code=400, message ="Bad Request, something broke"),
            @ApiResponse(code=500, message ="Cannot authorize the redirect view ")
    })
    @RequestMapping(value = "/api/v2/google/google", method = RequestMethod.GET)
    public RedirectView googleConnectionStatus() {
        try {
            return new RedirectView(authorize());
        } catch(GeneralSecurityException e) {
            logger.warn(e);
        } catch(IOException e) {
            logger.warn(e);
        }
        return null;
    }

    @ApiOperation(value = "outh2 callback", response = String.class )
    @ApiResponses({
            @ApiResponse(code=200, message ="Successfully redirected"),
            @ApiResponse(code=400, message ="Bad Request, something broke"),
            @ApiResponse(code=500, message ="Cannot receive the token due to a server error ")
    })
    @RequestMapping(value = "/api/v2/google/google", method = RequestMethod.GET, params = "code")
    public synchronized String oauth2Callback(@RequestParam(value = "code") String code) {
        try {
            TokenResponse response = flow.newTokenRequest(code).setRedirectUri(redirectURI).execute();
            credential = flow.createAndStoreCredential(response, "userID");

            client = new com.google.api.services.calendar.Calendar.Builder(httpTransport, JSON_FACTORY, credential)
                    .setApplicationName(APPLICATION_NAME).build();

        } catch (IOException e) {
            logger.warn("Exception while handling OAuth2 callback (" + e.getMessage() + ")."
                    + " Redirecting to google connection status page.");
            logger.warn(e);
        }
        return "redirect:/trainers";
    }

    private synchronized String authorize() throws GeneralSecurityException, IOException {
        AuthorizationCodeRequestUrl authorizationUrl;
        if (flow == null) {
            Details web = new Details();
            web.setClientId(clientId);
            web.setClientSecret(clientSecret);
            clientSecrets = new GoogleClientSecrets().setWeb(web);
            httpTransport = GoogleNetHttpTransport.newTrustedTransport();
            flow = new GoogleAuthorizationCodeFlow.Builder(httpTransport, JSON_FACTORY, clientSecrets,
                    Collections.singleton(CalendarScopes.CALENDAR)).build();
        }
        authorizationUrl = flow.newAuthorizationUrl().setRedirectUri(redirectURI);
        logger.debug("cal authorizationUrl->" + authorizationUrl);
        return authorizationUrl.build();
    }

    @ApiOperation(value = "google status", response = String.class)
    @ApiResponses({
            @ApiResponse(code=200, message ="Successfully retrieved the google status"),
            @ApiResponse(code=400, message ="Bad Request, something broke"),
            @ApiResponse(code=500, message ="Cannot retrieve the google status")
    })
    @RequestMapping(value = "/api/v2/google/googleStatus", produces = MediaType.TEXT_PLAIN_VALUE)
    public @ResponseBody String googleStatus() {
        if(client != null)
            return "good";
        return null;
    }

    @ApiOperation(value = "add event", response = String.class )
    @ApiResponses({
            @ApiResponse(code=200, message ="Successfully added an event"),
            @ApiResponse(code=400, message ="Bad Request, something broke"),
            @ApiResponse(code=500, message ="Cannot add an event due to a server error")
    })
    @RequestMapping(value = "/api/v2/google/addEvent")
    public String addEvent(@RequestBody String json, HttpServletResponse res) throws IOException, ParseException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode node = mapper.readTree(json);
        String name = node.get("summary").textValue();
        String startDate = node.get("start").get("date").textValue();
        String endDate =  node.get("end").get("date").textValue();
        Event event = newEvent(name, startDate, endDate);
        try {
            client.events().insert(googleCalendarId, event).execute();
            return "redirect:/";
        }catch (NullPointerException e){
            logger.warn(e);
            res.sendError(500);
        }
        return null;
    }

    private Event newEvent(String name,String startDate, String endDate) {
        Event event = new Event();
        String pattern = "yyyy-MM-dd";
        Date startdate;
        Date enddate;
        SimpleDateFormat format = new SimpleDateFormat(pattern);
        try {
            startdate = format.parse(startDate);
            enddate = format.parse(endDate);

            event.setSummary(name);
            DateTime start = new DateTime(startdate, TimeZone.getTimeZone("EST"));
            event.setStart(new EventDateTime().setDateTime(start));
            DateTime end = new DateTime(enddate, TimeZone.getTimeZone("EST"));
            event.setEnd(new EventDateTime().setDateTime(end));

            Unavailable u = new Unavailable();
            Timestamp t = new Timestamp(startdate.getTime());
            u.setStartDate(t);
            t = new Timestamp(enddate.getTime());
            u.setEndDate(t);
            uDAO.save(u);

            return event;

        } catch (ParseException e) {
            logger.warn(e);
        }
        return null;
    }
}