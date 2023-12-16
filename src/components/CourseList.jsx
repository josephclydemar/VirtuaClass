import Course from "./Course";

const CourseList = ({ courses, coursesExpanded, setCoursesExpanded }) => {
    let coursesInJsx = [];
    for(let i=0; i<courses.length; i++) {
        coursesInJsx.push(<Course 
            key={ i+1 } 
            courseObj={ courses[i] } 
            allExpanded={ coursesExpanded } />);
    }
    return (
        <section className="courselist__section">
            <div className="courselist__top">
                <div>
                    <label htmlFor="expandAllCourse">Expand All</label>
                    <input 
                    id="expandAllCourse" 
                    type="checkbox" 
                    checked={ !coursesExpanded }
                    onChange={ () => setCoursesExpanded( !coursesExpanded ) }/>
                </div>
            </div>
            <div className="allCourses">
                { coursesInJsx }
            </div>
        </section>
    );
};

export default CourseList;