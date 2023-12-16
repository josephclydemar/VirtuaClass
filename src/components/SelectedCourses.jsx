const createCourse = ( key, course, setCourses, setSelectedCoursesIds, selectedCourses, setSelectedCourses ) => {
    return (
        <tr className="tableRow" key={ key } >
            <td>{ course.name }</td>
            <td>{ course.description }</td>
            <td>
                <button onClick={() => {
                    setSelectedCourses([...selectedCourses.filter(item => item.id !== course.id)]);
                    setSelectedCoursesIds(prev => [...prev.filter(item => item !== course.id )]);
                    setCourses(prev => [...prev, course]);
                }}>Remove</button>
            </td>
        </tr>
    );
};

const SelectedCourses = ({ setCourses, setSelectedCoursesIds, selectedCourses, setSelectedCourses }) => {
    let selectedCoursesInJsx = [];
    for(let i=0; i<selectedCourses.length; i++) {
        selectedCoursesInJsx.push(createCourse(i+1, selectedCourses[i], setCourses, setSelectedCoursesIds, selectedCourses, setSelectedCourses ));
    }
    return (
        <section className="ubox">
                <div className="ubox_head">
                    <h1>Selected Courses</h1>
                </div>
                <div className="ubox_body">
                    <table>
                        <tr>
                            <th style={{
                                    width: "300px"
                                }}>Course Name</th>
                            <th style={{
                                    width: "500px"
                                }}>Description</th>
                            <th>Remove Button</th>
                        </tr>
                        { selectedCoursesInJsx }
                    </table>
                </div>
        </section>
    );
};

export default SelectedCourses;