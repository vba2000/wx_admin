import {ButtonGroup, ToggleButton} from "react-bootstrap";
import {useCallback} from "react";


export const OnOffSm = ({ onChange, value, ...props }) => {

    const setOn = useCallback(() => onChange(true), [onChange]);
    const setOff = useCallback(() => onChange(false), [onChange]);

    return <ButtonGroup size="sm">
        <ToggleButton  style={{ minWidth: "50px" }} value={1} checked={value} onClick={setOn} variant={value ? "success" : "outline-success"}>
            On
        </ToggleButton>
        <ToggleButton style={{ minWidth: "50px" }} value={2} checked={!value} onClick={setOff} variant={!value ? 'danger' : 'outline-danger'}>
            Off
        </ToggleButton>
    </ButtonGroup>
}