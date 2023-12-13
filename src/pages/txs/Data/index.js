import {Container } from "react-bootstrap";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {DataContext} from "../../../context/Data";


const Data = ({ ...props }) => {

    const { isLoadingData } = useContext(DataContext);


    return <Container hidden={isLoadingData}>
        DATA
    </Container>;
};

export default Data;