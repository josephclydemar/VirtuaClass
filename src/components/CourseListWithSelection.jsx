import SelectCourse from "./SelectCourse";

const CourseListWithSelection = ({ courses, setCourses, setSelectedCoursesIds, coursesExpanded, setCoursesExpanded, selectedCourses, setSelectedCourses }) => {
    let coursesInJsx = [];
    for(let i=0; i<courses.length; i++) {
        coursesInJsx.push(
                <SelectCourse 
                    courseObj={ courses[i] } 
                    setCourses={ setCourses } 
                    setSelectedCoursesIds={setSelectedCoursesIds} 
                    allExpanded={ coursesExpanded } 
                    selectedCourses={ selectedCourses } 
                    setSelectedCourses={ setSelectedCourses } />
            );
    }
    return (
        <section className="courselist_with_selection__section">
            <div className="allCourses">
                { coursesInJsx }
            </div>
        </section>
    );
};

export default CourseListWithSelection;