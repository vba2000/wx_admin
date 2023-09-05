import {useMemo} from "react";
import {Image} from "react-bootstrap";

const images = [
    'https://i.gifer.com/PkM7.gif',
    'https://media.tenor.com/iCB4R4H96BwAAAAC/cat-sit.gif',
    'https://i.pinimg.com/originals/25/76/ab/2576ab3a50ccdae861fc5abcfa20a1dc.gif',
    'https://pa1.narvii.com/6924/efd68afe05ca91219be815ae27eaf4565e18d889r1-352-252_hq.gif',
    'https://i.pinimg.com/originals/de/48/45/de484590d9caf5f25f8899e53fa55797.gif',
    'https://steamuserimages-a.akamaihd.net/ugc/961971654932108165/62048CBC081033D23167A3DC02536B97473037C4/'
];

export const ImageLoader = ({ hidden, children, ...props }) => {

    const url = useMemo(() => {
        return hidden ? undefined :  images[(images.length * Math.random()) << 0 ];
    }, [hidden]);

    const className = `${props.className || 'rounded-circle'}`

    return <Image hidden={hidden} {...props} className={className} src={url}/>;

};