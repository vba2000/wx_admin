import {useContext, useMemo} from "react";
import {UserContext} from "../context/WavesKeeper";
import {Button, Navbar, Spinner} from "react-bootstrap";
import {DataContext} from "../context/Data";


export const NavigationUser = ({...props}) => {
    const {login, logout, user, isLogin} = useContext(UserContext);
    const {globalPoolsSettings, isLoadingData } = useContext(DataContext);
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

    }, [user, manager, admins]);

    if (isLoadingData && isLogin) {
        return <Navbar.Text className="p-4"><Spinner size={"sm"}/></Navbar.Text>;
    }

    return <Navbar.Collapse className="justify-content-end mx-3">
        <Navbar.Text className="p-4" title={user}>
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