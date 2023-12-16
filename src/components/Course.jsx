
import AccordionForCourse from "./AccordionForCourse";

const Course = ({ key, courseObj, allExpanded, checkBox='' }) => {
    return (
        <AccordionForCourse key={ key } 
        title={ [courseObj.name, <hr/>, checkBox] } 
        body={ 
          [
            <div className="courseDescription">
              { courseObj.description }
            </div>,
            <div className="coursePrice">
              { `₱${ courseObj.fee }` }
            </div>,
            <AccordionForCourse key={ key }
            title={ `Instructor: ${courseObj.instructor}` } 
            body={ 
              [
                <div className="instructorContact">
                  Email.: { courseObj.email }
                </div>
              ]
             }
            allExpanded={ allExpanded }/>
          ]
        } 
        allExpanded={ allExpanded }/>
    );
}

export default Course;