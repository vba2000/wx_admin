import {convertSvgString} from "../services";

export const IconLogo = ({ svgString, ...props}) => {
    return <img alt="icon" {...props} src={`data:image/svg+xml;base64, ${convertSvgString(svgString)}`} />
}