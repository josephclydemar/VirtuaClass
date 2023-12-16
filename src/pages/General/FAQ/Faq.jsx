import Accordion from "../../../components/Accordion";
import NavBar from '../../../components/NavBar';
import { useState, useEffect, useContext } from "react";
import SchoolInfoContext from '../../../contexts/SchoolInfoContext';

const DEVELOPMENT_HOST = process.env.REACT_APP_DEVELOPMENT_HOST || '';

const Faq = () => {
    const { schoolInfo } = useContext(SchoolInfoContext);
    const [faqs, setFaqs] = useState(null);
    const [htmlFaqs, setHtmlFaqs] = useState(null);

    useEffect(() => {
        fetch(`${DEVELOPMENT_HOST}/api/faqs`).then(result => {
            return result.json();
        }).then(value => {
            setFaqs(value);
        });
    }, []);

    useEffect(() => {
        if (faqs !== null) {
            setHtmlFaqs(faqs.map(item => {
                return (
                    <Accordion title={ item.question } body={ `Answer: ${item.answer}` } />
                );
            }));
        } 
    }, [faqs]);

    return (
        <>
            <NavBar  schoolInfo={schoolInfo}/>
            <section className="faq__section">
                <div className="faq__heading">
                    <h1>Questions? Look here.</h1>
                    <p>Cant find an answer? just lorem ipsum dolor</p>
                </div>
                <div>
                    { faqs !== null ? htmlFaqs : '' }
                </div>
            </section>
        </>
    );
};

export default Faq;