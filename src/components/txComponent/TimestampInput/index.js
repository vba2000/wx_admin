import {useCallback, useMemo, useState} from "react";
import {InputGroup, Form, Button} from "react-bootstrap";


const isValidTimestamp = (value) => {
  value = Number(value);
  return !Number.isNaN(value) && Number.isFinite(value) && value > 0 && Number.isInteger(value) && value > 0;
};

export const TimestampInput = ({ value, onChange, ...props }) => {

    const [timestamp, setTimestamp] = useState(value);
    const [showDate, setShowDate] = useState(false);

    const onSetTimestamp = useCallback((event) => {
        const timestamp = event.target.value;
        setTimestamp(timestamp);
        if (Number(timestamp) !== value) {
            onChange(Number(timestamp));
        }
    }, [value, onChange]);

    const setNow = useCallback(() => {
        const time = Date.now();
        setTimestamp(time);
        onChange(time);
    }, [onChange]);

    const isValid = useMemo(() => {
        return isValidTimestamp(timestamp);
    }, [timestamp]);

    const validMsg = useMemo(() => {
        if (!isValid) {
            return 'Wrong timestamp';
        }
        if (!showDate) {
            return 'Valid';
        }

        return new Date(timestamp).toISOString();

    }, [timestamp, showDate, isValid]);

    const onEnter = useCallback(() => setShowDate(true), []);
    const onLeave = useCallback(() => setShowDate(false), []);


    return <InputGroup {...props}>
        <InputGroup.Text as={Button} id="basic-addon1" variant="secondary" style={{ width: '160px' }} onClick={setNow}>Timestamp</InputGroup.Text>
        <Form.Control
            placeholder="Timestamp"
            aria-label="Timestamp"
            aria-describedby="basic-addon1"
            value={timestamp}
            onChange={onSetTimestamp}
        />
        <InputGroup.Text onMouseEnter={onEnter}  onMouseLeave={onLeave} className={isValid ? 'bg-success' : 'bg-danger'}>{  validMsg }</InputGroup.Text>
    </InputGroup>
};