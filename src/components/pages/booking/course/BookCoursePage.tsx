import { GetServerSideProps } from "next";
import React, { useMemo } from "react";
import { selectUser } from "../../../../auth/userSlice";
import ApiAdaptor from "../../../../backend/apiAdaptor";
import { ClassScheduleTable } from "../../../course/ClassScheduleTable";
import StripePayment from "../../../payment/stripe/StripePayment";
import { useAppSelector } from "../../../redux/hooks";
import { Course } from "../../../types/course/responses";
import { AlternativeCoursesSection } from "./AlternativeCoursesSection";
import { CourseDetails } from "./CourseDetails";
import { EnterStudentDetails } from "./EnterStudentDetails";
import { LiveClassScheduleSection } from "./LiveClassSchedule";
import { StudentDetailsSection } from "./StudentDetailsSection";

interface BookCoursePage {
  course: Course;
  levelCourses: Course[];
}

const BookCoursePage: React.FC<BookCoursePage> = ({ course, levelCourses }) => {
  const otherLevelCourses = useMemo(
    () => levelCourses.filter((l) => l.id !== course.id),
    [course.id, levelCourses]
  );

  const { user, googleProfile } = useAppSelector(selectUser);

  return (
    <section>
      <div className="grid grid-cols-1">
        <div className="text-center text-xl ">
          <h2 className="text-center text-xl font-extrabold p-2">
            Course Details
          </h2>
          <div className="p-4">
            <CourseDetails course={course} />
          </div>
          <div>
            {user ? (
              <StudentDetailsSection user={user} />
            ) : (
              <EnterStudentDetails />
            )}
          </div>
        </div>
      </div>
      {user?.details.email && (
        <StripePayment
          amount={course.price * 100}
          course_id={course.id}
          course_name={course.name}
          currency="usd"
          user_google_id={user.details.google_id || ""}
          user_email={user.details.email}
          user_id={Number(user.details.id)}
        />
      )}
      <LiveClassScheduleSection
        courseClasses={course.live_classes}
        otherLevelCourses={otherLevelCourses}
      />
    </section>
  );
};

export default BookCoursePage;
