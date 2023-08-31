import {convertSvgString} from "../services";

export const IconLogo = (props) => {
    return <img alt="icon" {...props} src={`data:image/svg+xml;base64, ${convertSvgString(props.svgString)}`} />
}