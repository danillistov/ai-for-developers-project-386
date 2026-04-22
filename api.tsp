import "@typespec/http";

using TypeSpec.Http;

@service(#{ title: "Calendar Booking API" })
@server("http://localhost:3000", "Local development server")
@doc("""
  API contract for a single-owner calendar booking application.
  The Owner is a pre-configured singleton (no auth/registration) and is therefore
  not exposed as an API resource. The same HTTP surface serves two roles:
    * Owner (admin): POST /event-types, GET /event-types, GET /bookings
    * Guest (public): GET /event-types, GET /event-types/{id}/slots, POST /bookings
  """)
namespace CalendarBooking;

@doc("Error payload returned for 4xx responses.")
@error
model ApiError {
  @doc("Machine-readable error code, e.g. `validation_failed`, `event_type_not_found`, `booking_conflict`.")
  code: string;

  @doc("Human-readable error message.")
  message: string;
}

@doc("Generic 400 Bad Request response.")
model BadRequestResponse {
  @statusCode statusCode: 400;
  @body error: ApiError;
}

@doc("Generic 404 Not Found response.")
model NotFoundResponse {
  @statusCode statusCode: 404;
  @body error: ApiError;
}

@doc("Generic 409 Conflict response, used when a requested booking overlaps an existing one.")
model ConflictResponse {
  @statusCode statusCode: 409;
  @body error: ApiError;
}

@doc("A type of event the owner offers for booking (e.g. a 30-minute intro call).")
model EventType {
  @doc("Server-assigned identifier.")
  @visibility(Lifecycle.Read)
  id: string;

  @doc("Display name of the event type.")
  name: string;

  @doc("Optional longer description shown to guests.")
  description?: string;

  @doc("Event duration in minutes.")
  @minValue(1)
  duration: int32;
}

@doc("Payload for creating a new EventType.")
model EventTypeCreate {
  name: string;
  description?: string;

  @minValue(1)
  duration: int32;
}

@doc("A candidate time window that a guest may book against an EventType.")
model Slot {
  @doc("Inclusive slot start time (UTC).")
  startTime: utcDateTime;

  @doc("Exclusive slot end time (UTC).")
  endTime: utcDateTime;

  @doc("Whether the slot is currently free; only free slots are returned by the listing endpoint.")
  available: boolean;
}

@doc("A confirmed booking for a single EventType.")
model Booking {
  @doc("Server-assigned identifier.")
  @visibility(Lifecycle.Read)
  id: string;

  @doc("ID of the EventType the booking is for.")
  eventTypeId: string;

  @doc("Display name provided by the guest.")
  guestName: string;

  @doc("Contact email provided by the guest.")
  @format("email")
  guestEmail: string;

  @doc("Booking start time (UTC); must match an available slot boundary.")
  startTime: utcDateTime;

  @doc("Booking end time (UTC); startTime + EventType.duration.")
  endTime: utcDateTime;
}

@doc("Payload for creating a new Booking.")
model BookingCreate {
  eventTypeId: string;
  guestName: string;

  @format("email")
  guestEmail: string;

  startTime: utcDateTime;
  endTime: utcDateTime;
}

@route("/event-types")
interface EventTypes {
  @doc("Owner-only: create a new event type.")
  @post
  create(@body body: EventTypeCreate):
    | {
        @statusCode statusCode: 201;
        @body created: EventType;
      }
    | BadRequestResponse;

  @doc("List all event types. Used by both the owner (admin view) and guests (public view).")
  @get
  list(): EventType[];

  @doc("""
    Return free slots for the next 14 days, starting from the current date, for the given EventType.
    Only available windows are returned (Slot.available is always true).
    Responds with 404 if the EventType does not exist.
    """)
  @route("/{id}/slots")
  @get
  listSlots(@path id: string):
    | Slot[]
    | NotFoundResponse;
}

@route("/bookings")
interface Bookings {
  @doc("Owner-only: list upcoming bookings across all event types, sorted by startTime ascending.")
  @get
  list(): Booking[];

  @doc("""
    Guest: create a new booking.
    Business rules:
      * The requested window must match an available slot for the given EventType.
      * Two bookings must not overlap in time, even across different EventTypes.
    Error mapping:
      * 400 — the requested window is not a valid available slot.
      * 404 — eventTypeId does not exist.
      * 409 — the window overlaps an existing booking (any EventType).
    """)
  @post
  create(@body body: BookingCreate):
    | {
        @statusCode statusCode: 201;
        @body created: Booking;
      }
    | BadRequestResponse
    | NotFoundResponse
    | ConflictResponse;
}
