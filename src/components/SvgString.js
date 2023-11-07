import {convertSvgString} from "../services";

export const IconLogo = ({ svgString, ...props}) => {
    if (!svgString) {
        return <small>N/A</small>
    }
    return <img alt="icon" {...props} src={`data:image/svg+xml;base64, ${convertSvgString(svgString)}`} />
}