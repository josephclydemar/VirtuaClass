import { createContext, useState } from 'react';

const CurrentCourseClassContext = createContext();

export function CurrentCourseClassProvider({ children }) {
    const [currentCourseClass, setCurrentCourseClass] = useState(null);
    
    return (
        <CurrentCourseClassContext.Provider value={{ currentCourseClass, setCurrentCourseClass }}>
            { children }
        </CurrentCourseClassContext.Provider>
    );
}

export default CurrentCourseClassContext;