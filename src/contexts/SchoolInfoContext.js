import { createContext, useState } from 'react';

const SchoolInfoContext = createContext();

export function SchoolInfoProvider({ children }) {
    const [schoolInfo, setSchoolInfo] = useState(
        {
          schoolName: '',
          mission: '',
          vision: '',
          objectives: '',
          faq: '',
          contactInformation: ''
        }
      );
    
    return (
        <SchoolInfoContext.Provider value={{ schoolInfo, setSchoolInfo }}>
            { children }
        </SchoolInfoContext.Provider>
    );
}

export default SchoolInfoContext;