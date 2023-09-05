import Routing from "./router";
import {useUserForRoot, UserContext} from "./context/WavesKeeper";
import {DataContext, useDataForRoot} from "./context/Data";
import {Autorize} from "./pages/Autorize";
import {Toasts} from "./components/Toasts";


function App() {
    const userData = useUserForRoot();
    const fetchedData = useDataForRoot();

    return (
        <>
            <UserContext.Provider value={userData}>
                <DataContext.Provider value={fetchedData}>
                    <Toasts>
                        <Autorize>
                            <Routing/>
                        </Autorize>
                    </Toasts>
                </DataContext.Provider>
            </UserContext.Provider>
        </>
    );
}

export default App;
