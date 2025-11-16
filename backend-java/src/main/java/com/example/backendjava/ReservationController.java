package com.example.backendjava;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
public class ReservationController {
    private static final int TABLES = 6;
    private static final int SEATS_PER_TABLE = 9;
    private static final int TOTAL = TABLES * SEATS_PER_TABLE;

    private final Map<String, Map<String, Object>> reservations = new ConcurrentHashMap<>();
    private final Map<Integer, Map<Integer, String>> seats = new HashMap<>();
    private final List<String> waiting = Collections.synchronizedList(new ArrayList<>());

    public ReservationController() {
        for (int t = 1; t <= TABLES; t++) seats.put(t, new HashMap<>());
    }

    @PostMapping("/reserve")
    public ResponseEntity<?> reserve(@RequestBody Map<String, String> body) {
        String first = body.get("first_name");
        String last = body.get("last_name");
        String phone = body.get("phone");
        String email = body.get("email");
        if (first == null || last == null || phone == null) return ResponseEntity.badRequest().body(Map.of("error","first_name,last_name,phone required"));

        String id = UUID.randomUUID().toString();
        Map<String,Object> base = new HashMap<>();
        base.put("id", id); base.put("first_name", first); base.put("last_name", last); base.put("phone", phone); base.put("email", email); base.put("created_at", Instant.now().toString());

        long reserved = reservations.values().stream().filter(r -> "reserved".equals(r.get("status"))).count();
        if (reserved < TOTAL) {
            outer:
            for (int i = 0; i < 100; i++) {
                int t = new Random().nextInt(TABLES) + 1;
                int s = new Random().nextInt(SEATS_PER_TABLE) + 1;
                if (!seats.get(t).containsKey(s)) {
                    seats.get(t).put(s, id);
                    base.put("status","reserved"); base.put("table_number", t); base.put("seat_number", s); base.put("qr","https://tournament.ge/checkin?id="+id);
                    reservations.put(id, base);
                    return ResponseEntity.ok(Map.of("status","reserved","table",t,"seat",s,"qr",base.get("qr")));
                }
            }
            // linear scan
            for (int t = 1; t <= TABLES; t++) for (int s = 1; s <= SEATS_PER_TABLE; s++) if (!seats.get(t).containsKey(s)) {
                seats.get(t).put(s, id);
                base.put("status","reserved"); base.put("table_number", t); base.put("seat_number", s); base.put("qr","https://tournament.ge/checkin?id="+id);
                reservations.put(id, base);
                return ResponseEntity.ok(Map.of("status","reserved","table",t,"seat",s,"qr",base.get("qr")));
            }
        }
        int waitingPos = waiting.size() + 1;
        base.put("status","waiting"); base.put("waiting_position", waitingPos);
        reservations.put(id, base); waiting.add(id);
        return ResponseEntity.ok(Map.of("status","waiting","waiting_number", waitingPos));
    }

    @PostMapping("/checkin")
    public ResponseEntity<?> checkin(@RequestBody Map<String,String> body) {
        String qr = body.get("qr");
        if (qr == null) return ResponseEntity.badRequest().body(Map.of("status","error","message","qr required"));
        var m = qr.split("id=");
        if (m.length < 2) return ResponseEntity.badRequest().body(Map.of("status","error","message","invalid qr format"));
        String id = m[1];
        var r = reservations.get(id);
        if (r == null) return ResponseEntity.status(404).body(Map.of("status","error","message","Reservation not found"));
        if (!"reserved".equals(r.get("status"))) return ResponseEntity.badRequest().body(Map.of("status","error","message","Not in reserved status"));
        if (r.containsKey("checkin_time")) return ResponseEntity.badRequest().body(Map.of("status","error","message","Already checked in"));
        r.put("status","checked_in"); r.put("checkin_time", Instant.now().toString());
        return ResponseEntity.ok(Map.of("status","success","user", r.get("first_name")+" "+r.get("last_name"),"table", r.get("table_number"),"seat", r.get("seat_number")));
    }

    @GetMapping("/reservation/{phone}")
    public ResponseEntity<?> getByPhone(@PathVariable String phone) {
        for (var r : reservations.values()) if (phone.equals(r.get("phone"))) return ResponseEntity.ok(Map.of("status", r.get("status"), "table", r.get("table_number"), "seat", r.get("seat_number")));
        return ResponseEntity.status(404).body(Map.of("error","Not found"));
    }
}
