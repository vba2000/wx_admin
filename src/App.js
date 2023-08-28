import Routing from "./router";
import {useUserForRoot, UserContext} from "./context/WavesKeeper";
import {DataContext, useDataForRoot} from "./context/Data";
import {useEffect} from "react";


function App() {
    const userData = useUserForRoot();
    const fetchedData = useDataForRoot();

    useEffect(() => {
        return  fetchedData.fetchData();
    }, [fetchedData.fetchData]);

    return (
        <>
            <UserContext.Provider value={userData}>
                <DataContext.Provider value={fetchedData}>
                    <Routing/>
                </DataContext.Provider>
            </UserContext.Provider>
        </>
    );
}

export default App;
