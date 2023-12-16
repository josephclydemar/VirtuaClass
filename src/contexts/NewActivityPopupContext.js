import { createContext, useState } from 'react';

const NewActivityPopupContext = createContext();

export function NewActivityPopupProvider({ children }) {
    const [isNewActivityPopupAppearedOnce, setIsNewActivityPopupAppearedOnce] = useState(false);
    
    return (
        <NewActivityPopupContext.Provider value={{ isNewActivityPopupAppearedOnce, setIsNewActivityPopupAppearedOnce }}>
            { children }
        </NewActivityPopupContext.Provider>
    );
}

export default NewActivityPopupContext;