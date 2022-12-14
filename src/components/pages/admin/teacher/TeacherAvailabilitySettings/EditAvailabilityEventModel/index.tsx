import moment from "moment";
import React, { useState } from "react";
import ApiAdaptor from "../../../../../../backend/apiAdaptor";
import { useAppDispatch } from "../../../../../redux/hooks";
import { resetEditAvailabilityState } from "../../../../../redux/reducers/calendar/editAvailabilitySlice";
import {
  AvailabilityCalendarEvent,
  CreateAvailabilityCalendarEvent,
} from "../../../../../scheduling/BigBookingCalendar/types";
import { StandardButton } from "../../../../../styled/Buttons";
import { EditAvailabilityEventModalProps } from "./types";
import { eventHasAllDetails } from "./utils";
import { v4 as uuidv4 } from "uuid";

const EditAvailabilityEventModal: React.FC<EditAvailabilityEventModalProps> = ({
  checkOverlap,
  eventDetails,
  refreshAvailability,
  close,
}) => {
  const dispatch = useAppDispatch();

  const baseEvent: AvailabilityCalendarEvent = eventDetails
    ? {
        ...eventDetails,
        title: eventDetails.title || "",
      }
    : {
        id: uuidv4(),
        title: "",
        status: "available",
      };
  const isNewEvent = !Boolean(eventDetails);
  const [tempEvent, setTempEvent] =
    useState<AvailabilityCalendarEvent>(baseEvent);

  const localTimeToDate = (type: "start" | "end") => (localTime: string) => {
    const _moment = moment(localTime);
    setTempEvent({
      ...tempEvent,
      [type]: _moment.toDate(),
    });
  };

  const displayEndDateInputError = () => {
    if (!tempEvent?.start || !tempEvent?.end) return;
    if (tempEvent.start < tempEvent.end) return;
    return "End date must be after start date";
  };

  const datesAreSet = () =>
    tempEvent.end && tempEvent.start ? null : "Ensure that both dates are set";

  const handleSubmission = async (event: CreateAvailabilityCalendarEvent) => {
    if (isNewEvent) {
      await ApiAdaptor.postAvailability({
        events: [event],
        timeframe: { start: event.start, end: event.end },
      });
    } else {
      if (!event.id) throw new Error("Event has no ID");
      const updateResponse = await ApiAdaptor.updateAvailabilityEntry(
        event.id,
        event
      );
      console.log(updateResponse);
    }
    dispatch(resetEditAvailabilityState({}));
    refreshAvailability();
  };

  const deleteAvailability = async (id: string) => {
    await ApiAdaptor.deleteAvailabilityEntry(id);
    refreshAvailability();
  };

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!eventHasAllDetails(tempEvent)) {
      alert("Please ensure all fields are set");
      return;
    }
    const validators = [displayEndDateInputError, datesAreSet];
    const isInvalid = validators.find((val) => val());
    if (isInvalid) {
      alert(isInvalid());
      return;
    }

    const overlappingEvents = checkOverlap("available", {
      start: tempEvent.start,
      end: tempEvent.end,
    });

    if (overlappingEvents.length) {
      alert("overlapping events found");
      return;
    }

    handleSubmission(tempEvent);
    close();
  };

  return (
    <form className="w-full max-w-lg">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-event-title"
          >
            Event Title
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="grid-event-title"
            placeholder="This event has no title"
            value={tempEvent.title}
            onChange={(e) =>
              setTempEvent({ ...tempEvent, title: e.target.value })
            }
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="event-start"
          >
            From
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="edit-event-start"
            type="datetime-local"
            onChange={(e) => localTimeToDate("start")(e.target.value)}
            value={
              tempEvent?.start
                ? moment(tempEvent.start).format("YYYY-MM-DDTHH:mm")
                : undefined
            }
          />
        </div>
        <div className=" px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="event-start"
          >
            Until
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="edit-event-start"
            type="datetime-local"
            onChange={(e) => localTimeToDate("end")(e.target.value)}
            value={
              tempEvent?.end
                ? moment(tempEvent.end).format("YYYY-MM-DDTHH:mm")
                : undefined
            }
          />
          <p className="text-red-500">{displayEndDateInputError()}</p>
        </div>
      </div>
      <div className="w-full flex justify-between">
        <StandardButton onClick={onSubmit}>
          {!isNewEvent ? "Edit Event" : "Create Event"}
        </StandardButton>
        {eventDetails && (
          <StandardButton
            $color="red"
            onClick={(e: React.SyntheticEvent) => {
              e.preventDefault();
              deleteAvailability(eventDetails.id);
            }}
          >
            {"Delete Event"}
          </StandardButton>
        )}
      </div>
    </form>
  );
};
export default EditAvailabilityEventModal;
