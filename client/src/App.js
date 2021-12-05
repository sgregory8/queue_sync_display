import React from 'react';
import { useSelector } from 'react-redux';

const App = () => {
    const connectionStatus = useSelector(state => state.connectionStatus);

    return (
        <div>
            <h2>App</h2>
            <p>
                <strong>connected: </strong> {connectionStatus.connected.toString()}
            </p>
        </div>
    );
};

export default App;
