import { ReactPortal } from 'react';
import {convertSvgString} from "../services";

export const IconLogo = (props) => {
    return <img {...props} src={`data:image/svg+xml;base64, ${convertSvgString(props.svgString)}`} />;
}