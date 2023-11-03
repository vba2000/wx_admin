import {ButtonGroup, ToggleButton} from "react-bootstrap";
import {useCallback, useState} from "react";


export const OnOffSm = ({ onChange, value, title, ...props }) => {

    const setOn = useCallback(() => onChange(true), [onChange]);
    const setOff = useCallback(() => onChange(false), [onChange]);
    const [mouseIn, setMouseIn] = useState(false);

    const onEnter = useCallback(() => setMouseIn(true), [setMouseIn]);
    const onOut = useCallback(() => setMouseIn(false), [setMouseIn]);

    return <ButtonGroup size="sm" onMouseOut={onOut} onMouseOver={onEnter} className={mouseIn ? 'border border-info mb-2' : 'border border-light mb-2'} style={{ transition: "all 0.5s" }} title={title}>
        <ToggleButton  style={{ minWidth: "50px" }} value={1} checked={value} onClick={setOn} variant={value ? "success" : "outline-success"}>
            On
        </ToggleButton>
        <ToggleButton style={{ minWidth: "50px" }} value={2} checked={!value} onClick={setOff} variant={!value ? 'danger' : 'outline-danger'}>
            Off
        </ToggleButton>
    </ButtonGroup>
}