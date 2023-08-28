import {useContext, useMemo} from "react";
import {UserContext} from "../context/WavesKeeper";
import {Button, Navbar} from "react-bootstrap";
import {DataContext} from "../context/Data";


export const NavigationUser = ({...props}) => {
    const {login, logout, user, isLogin} = useContext(UserContext);
    const {globalPoolsSettings } = useContext(DataContext);
    const { manager = '', admins = [] } = globalPoolsSettings;

    const userName = useMemo(() => {
        if (!user) {
            return 'Guest';
        }

        if (user === manager) {
            return 'Manager';
        }

        if (admins.includes(user)) {
            return 'Admin';
        }

        return user;

    }, [user, manager]);

    return <Navbar.Collapse className="justify-content-end">
        <Navbar.Text className="p-4">
            <small>
                {userName}
            </small>
        </Navbar.Text>
        {isLogin ? <Navbar.Text>
                <Button size="sm" onClick={logout}>Logout</Button>
            </Navbar.Text> :
            <Navbar.Text>
                <Button onClick={login}>Login</Button>
            </Navbar.Text>}
    </Navbar.Collapse>
};