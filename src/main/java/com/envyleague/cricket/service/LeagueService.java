package com.envyleague.cricket.service;

import com.envyleague.cricket.domain.League;
import com.envyleague.cricket.domain.User;
import com.envyleague.cricket.repository.LeagueRepository;
import com.envyleague.cricket.repository.UserRepository;
import com.envyleague.cricket.security.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;

@Service
@Transactional
public class LeagueService {
    private final Logger log = LoggerFactory.getLogger(getClass());

    @Inject
    LeagueRepository leagueRepository;

    @Inject
    UserRepository userRepository;

    public void requestNewLeague(String leagueName, int fee) {
        User currentUser = userRepository.findOne(SecurityUtils.getCurrentLogin());
        log.info("User " + currentUser.getLogin() + " requested for a new League ");
        League league = new League();
        league.setOwner(currentUser);
        league.setFee(fee);
        league.setName(leagueName);
        leagueRepository.save(league);
    }


}