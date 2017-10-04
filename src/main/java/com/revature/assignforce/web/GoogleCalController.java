package com.revature.assignforce.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.json.Json;
import com.google.api.services.calendar.model.CalendarListEntry;
import com.google.api.services.calendar.model.EventDateTime;
import com.revature.assignforce.domain.Unavailable;
import com.revature.assignforce.domain.dao.UnavailableRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import com.google.api.services.calendar.Calendar;
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
public class GoogleCalController {

    private final static Log logger = LogFactory.getLog(GoogleCalController.class);
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

    private Set<Event> events = new HashSet<>();

    @Autowired
    private UnavailableRepository UDAO;

    public void setEvents(Set<Event> events) {
        this.events = events;
    }

    @RequestMapping(value = "/google", method = RequestMethod.GET)
    public RedirectView googleConnectionStatus(HttpServletRequest request) throws Exception {
        System.out.println("inside googleConnectionStatus");
        return new RedirectView(authorize());
    }

    @RequestMapping(value = "/google", method = RequestMethod.GET, params = "code")
    public String oauth2Callback(@RequestParam(value = "code") String code) {
        System.out.println("inside oauth2Callback");
        com.google.api.services.calendar.model.Events eventList;
        String message = "";
        try {
            TokenResponse response = flow.newTokenRequest(code).setRedirectUri(redirectURI).execute();
            credential = flow.createAndStoreCredential(response, "userID");

            client = new com.google.api.services.calendar.Calendar.Builder(httpTransport, JSON_FACTORY, credential)
                    .setApplicationName(APPLICATION_NAME).build();

        } catch (Exception e) {
            logger.warn("Exception while handling OAuth2 callback (" + e.getMessage() + ")."
                    + " Redirecting to google connection status page.");
            message = "Exception while handling OAuth2 callback (" + e.getMessage() + ")."
                    + " Redirecting to google connection status page.";
        }
        return "redirect:/";
    }

    @RequestMapping(value = "/api/v2/googleStatus", method = RequestMethod.GET, params = "code")
    public boolean googleStatus(@RequestParam(value = "code") String code) {
        return (client != null);
    }

    private String authorize() throws Exception {
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
        System.out.println("cal authorizationUrl->" + authorizationUrl);
        return authorizationUrl.build();
    }
    @RequestMapping(value = "/api/v2/addEvent")
    private String addEvent(@RequestBody String json) throws Exception {
        System.out.println("INSIDE ADD EVENT BRUH!!!!!!!!!!!!!!!");
        System.out.println("This is the json string send from angular: "  + json);
        ObjectMapper mapper = new ObjectMapper();
        JsonNode node = mapper.readTree(json);
        String name = node.get("summary").textValue();
        String startDate = node.get("start").get("date").textValue();
        String endDate =  node.get("end").get("date").textValue();
        Event event = newEvent(name, startDate, endDate);
        Event result = client.events().insert("5qson8h19ikisfa137b1bsbjrc@group.calendar.google.com",event).execute();
        return "redirect:/";
    }
    private Event newEvent(String name,String startDate, String endDate) {
        Event event = new Event();
        String pattern = "yyyy-MM-dd";
        Date startdate = null;
        Date enddate = null;
        SimpleDateFormat format = new SimpleDateFormat(pattern);
        try {
            startdate = format.parse(startDate);
            enddate = format.parse(endDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }
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
        UDAO.save(u);
        return event;
    }
}