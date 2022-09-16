import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ApiAdaptor from "../../../backend/apiAdaptor";
import {
  Course,
  CourseClass,
  CourseClassResponse,
  CourseMinimal,
} from "../../types/course/responses";
import { parseDbTime } from "../../utils/dateMethods";
import { ClassScheduleTable } from "../ClassScheduleTable";
import { BookCourseButton } from "./BookCourseButton";
import { CourseInfoEntry } from "./CourseInfoEntry";
import { CourseCollapseProps } from "./types";

export const formatCourseDate = (val: string | Date) => {
  const d = val instanceof Date ? val : parseDbTime(val);
  return moment(d).format("dddd d MMMM");
};

export const CourseCollapse: React.FC<CourseCollapseProps> = ({
  course,
  showBookNowButton,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [classes, setClasses] = useState<CourseClassResponse[]>([]);

  useEffect(() => {
    ApiAdaptor.getCourseById(course.id).then((course: Course) => {
      const classes: CourseClassResponse[] = course.live_classes.map((c) => ({
        ...c,
      }));
      setClasses(classes);
    });
  }, [course]);

  return (
    <div
      className={clsx(
        "collapse collapse-arrow border border-base-300 bg-base-100 rounded-box m-6",

        isOpen && "collapse-open"
      )}
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <div className="collapse-title border-t-8 border-primary/50 flex items-center gap-8">
        <div className="flex flex-col border-t-6 border-primary w-full">
          <div className=" p-1 flex justify-between items-center w-full border-t-2 border-b-2">
            <div className="font-medium text-primary font-bold border-r-2 px-8 py-4 w-1/3">
              {course.name}
            </div>
            <div className="border-r-2 p-4 font-bold w-1/3 text-center">
              Online
            </div>
            <div className="font-bold w-1/3 text-center">300 hours</div>
          </div>
          <div className="flex p-2">
            <div className="w-1/2 px-4 py-2">
              <CourseInfoEntry
                title="Starts: "
                value={formatCourseDate(course.start_time)}
              />
              <CourseInfoEntry
                title="Ends: "
                value={formatCourseDate(course.end_time)}
              />
            </div>
            <div className="w-1/2 flex justify-center items-center  border-l-2 ">
              <CourseInfoEntry
                title="Class Time: "
                value={moment(parseDbTime(course.start_time)).format("HH:mm")}
              />
            </div>
          </div>
        </div>
        <div className="grow-0">
           {showBookNowButton && <BookCourseButton courseId={course.id} />}
        </div>
       
      </div>
      <div className="collapse-content">
        <p>List live class data here</p>
        <ClassScheduleTable courseClasses={classes} />
      </div>
    </div>
  );
};
