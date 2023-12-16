import { createContext, useState } from 'react';

const OfferedCoursesContext = createContext();

export function OfferedCoursesProvider({ children }) {
    const [offeredCourses, setOfferedCourses] = useState(null);
    
    return (
        <OfferedCoursesContext.Provider value={{ offeredCourses, setOfferedCourses }}>
            { children }
        </OfferedCoursesContext.Provider>
    );
}

export default OfferedCoursesContext;