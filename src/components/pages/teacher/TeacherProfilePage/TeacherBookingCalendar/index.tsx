import React, { useState } from "react";
import { EventPropGetter, View } from "react-big-calendar";
import { useAppDispatch } from "../../../../redux/hooks";
import BigBookingCalendar from "../../../../scheduling/BigBookingCalendar";
import {
  AvailabilityCalendarEvent,
  DisplayDatesType,
} from "../../../../scheduling/BigBookingCalendar/types";
import { getDefaultDisplayDates } from "../../../../scheduling/BigBookingCalendar/utils";
import Modal from "react-modal";
import { fetchAvailabilityAsync } from "../../../../redux/reducers/calendar/availabilitySlice";
import { TeacherBookingCalendarProps } from "./types";

export const TeacherBookingCalendar: React.FC<TeacherBookingCalendarProps> = ({
  availabilityEntries,
  teacherId,
}) => {
  const [view, setView] = useState<View>("month");
  const dispatch = useAppDispatch();
  const [displayedDates, setDisplayedDates] = useState<DisplayDatesType>(
    getDefaultDisplayDates()
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const onSelectEvent = (event: AvailabilityCalendarEvent) => {
    console.log(event);
    setModalOpen(true);
  };

  const onDisplayedDatesUpdate = (displayedDates: DisplayDatesType) => {
    dispatch(fetchAvailabilityAsync({ teacherId, ...displayedDates }));
  };

  const eventPropGetter: EventPropGetter<AvailabilityCalendarEvent> = (
    event
  ) => {
    return {
      className: "bg-primary",
      style: {
        border: "none",
      },
    };
  };

  return (
    <div>
      <BigBookingCalendar
        availabilityEntries={availabilityEntries}
        onDisplayedDatesUpdate={onDisplayedDatesUpdate}
        onSelectEvent={onSelectEvent}
        height="600px"
        defaultView="month"
        displayedDates={displayedDates}
        setDisplayedDates={setDisplayedDates}
        eventPropGetter={eventPropGetter}
      />
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="w-max h-max p-4 bg-white m-auto mt-24 border-4 border-solid border-slate-400"
      >
        <div>BOOK A CLASS</div>
        <div></div>
      </Modal>
    </div>
  );
};
