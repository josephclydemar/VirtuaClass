/* eslint-disable react/prop-types */
import { useState } from "react"; 
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const Accordion = ({ title, body }) => {
    
    const [isOpen, setIsOpen] = useState(false);
    
    const AccordionOnClick = () => setIsOpen(!isOpen);
    
    return (
        <>
            <div className="Accordion">
                <button onClick={AccordionOnClick} className="Accordion__header">
                    {(isOpen) ? (
                        <AiOutlineMinus size={24} />
                    ) : (
                        <AiOutlinePlus size={24} />
                    )}
                    <div>
                        <h1 className="Accordion__header__title">{title}</h1>
                    </div>
                </button>
                <div className={`${isOpen ? "active" : ""} Accordion__body`}>
                    <p className="Accordion__body__text">{body}</p>
                </div>
            </div>

        </>
    );
};

export default Accordion;