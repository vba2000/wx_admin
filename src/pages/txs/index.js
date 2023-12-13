import {Container, Nav} from "react-bootstrap";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {DataContext} from "../../context/Data";
import {Link} from "react-router-dom";


const Txs = ({ ...props }) => {

    const { isLoadingData } = useContext(DataContext);


    return <Container hidden={isLoadingData}>
        <Nav.Link>
            <Link to={'data'}>
                Data Tx
            </Link>
        </Nav.Link>
        <Nav.Link>
            <Link to={'transfer'}>
                Transfer Tx
            </Link>
        </Nav.Link>
        <Nav.Link>
            <Link to={'burn'}>
                Burn Tx
            </Link>
        </Nav.Link>
        <Nav.Link>
            <Link to={'invoke'}>
                Invoke Tx
            </Link>
        </Nav.Link>
    </Container>;
};

export default Txs;