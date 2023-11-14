import {Button, Container, Form, Image, InputGroup, Row} from "react-bootstrap";
import {getIconFromFileEvent} from "../../services/imageUtils";
import {useCallback, useState} from "react";
import {convertSvgString} from "../../services";

export const ImgInput = ({img, setImg, currentImage, ...props}) => {

    const [file, setFile] = useState('');

    const onChange = useCallback(async (event) => {
        try {
            const res = await getIconFromFileEvent(event);
            setImg(res);
            setFile(event.target.value);
        } catch (e) {
            setImg('');
            setFile(null);
        }
    }, [setImg]);


    const deleteImg = useCallback(() => setImg(''), [setImg])

    const clear = useCallback(() => {
        setFile('');
        setImg({
            value: currentImage ? `data:image/svg+xml;base64, ${convertSvgString(currentImage)}` : '',
            name: 'Current',
            size: 0
        })
    }, [setFile, currentImage, setImg]);

    return <Form.Group controlId="Upload_logo" style={{width: '256px'}}>
        <InputGroup className='text-nowrap'>
            <InputGroup.Text as='a'  className={"border-success"} style={{overflow: 'hidden', position: "relative", cursor: 'pointer', padding: 0, margin: 0}}>
                     <small className={"btn bi bi-upload tooltip-arrow"} size={'sm'}/>
                     <input
                        type="file"
                        onChange={onChange}
                        value={file}
                        title={'Select logo'}
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            opacity: 0,
                            zIndex: 3,
                            fontSize: '100px'
                        }}
                    />
            </InputGroup.Text>
            <InputGroup.Text className={'py-0 bg-body-secondary  border-dark-subtle'} style={{width: '50px', cursor: 'pointer'}}>{ img.value ?
                <Image width={32} height={32} style={{width: '32px', height: '32px', borderRadius: '50%'}} src={img.value}
                       onClick={clear}/> : 'N/A'}</InputGroup.Text>
            <InputGroup.Text className={'bg-body-secondary border-dark-subtle'}>{img.size} B</InputGroup.Text>
            <Button variant="outline-danger" onClick={deleteImg}>✘</Button>
        </InputGroup>
    </Form.Group>
}