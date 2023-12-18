import {Container } from "react-bootstrap";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {DataContext} from "../../../context/Data";


const Invoke = ({ ...props }) => {

    const { isLoadingData } = useContext(DataContext);


    return <Container hidden={isLoadingData}>
        Invoke
    </Container>;
};

export default Invoke;