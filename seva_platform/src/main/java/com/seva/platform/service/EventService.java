package com.seva.platform.service;

import com.seva.platform.model.Event;
import com.seva.platform.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAllByOrderByEventDateDesc();
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }
}
