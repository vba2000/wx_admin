import {createContext, useCallback, useEffect, useState} from "react";
import {Toast, ToastContainer} from "react-bootstrap";

export const ToastContext = createContext({});


export const Toasts = ({children, ...props}) => {

    const [tmr, setTmr] = useState(0);
    const [msgs, addMessages] = useState([]);

    const addNewMessage = useCallback(({text, header, variant = 'secondary', timeout = 10000}) => {
        const timeEnd = Date.now() + timeout;
        const msg = {
            id: `${text}_${timeEnd}_${variant}_${header}`,
            timeout,
            timeEnd,
            text,
            variant,
            header
        };
        addMessages([...msgs, msg]);
    }, [addMessages, msgs]);

    useEffect(() => {
        const time = Date.now();
        const newMsgs = msgs.filter(({timeEnd}) => time < timeEnd);

        if (newMsgs.length !== msgs.length) {
            addMessages(newMsgs);
        }
        const timer = setTimeout(() => setTmr(tmr + 1), 1000);
        return () => clearTimeout(timer);
    }, [msgs, addMessages, tmr, setTmr]);

    return <ToastContext.Provider value={{addNewMessage}}>
        <ToastContainer
            className="p-3"
            position={'top-end'}
            style={{zIndex: 100}}
        >
            {msgs.map(({header, text, variant, id, timeout}) => {
                return (<Toast key={id} autohide={true} animation={true} delay={timeout} bg={variant} show={true} className={'opacity-75'}>
                    { header ? <Toast.Header closeButton={false} bg={variant}>
                        <strong className="me-auto">{header}</strong>
                    </Toast.Header> : null }
                    <Toast.Body>{text}</Toast.Body>
                </Toast>)
            })
            }
        </ToastContainer>
        {children}
    </ToastContext.Provider>

}











