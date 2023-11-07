import {Button, Form, Image, InputGroup} from "react-bootstrap";
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
            size: 0 })
    }, [setFile, currentImage, setImg]);

    return <Form.Group  controlId="Upload_logo" style={{ width: '256px' }}>
        <InputGroup className='text-nowrap'>
            <Form.Control type="file"
                          onChange={onChange}
                          value={file}
                          size={' '}
                          title={'Select logo'}
                          style={{ content: 'Upload', width: '100px' }}
            />
            <InputGroup.Text style={{width: '50px', cursor: 'pointer'}}>{ img.value ? <Image width={32} style={{width: '32px', borderRadius: '50%'}} src={img.value} onClick={clear}/> : 'N/A' }</InputGroup.Text>
            <InputGroup.Text>{img.size} B</InputGroup.Text>
            <Button variant="outline-danger" onClick={deleteImg}>✘</Button>
        </InputGroup>
    </Form.Group>
}