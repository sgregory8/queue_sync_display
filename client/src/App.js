import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const App = () => {
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        let ws = new WebSocket('ws://localhost:3010');
        ws.onmessage = e => {
            try {
                const message = JSON.parse(e.data);
                setMessages(oldMessages => [...oldMessages, message]);
            } catch {}
        };
        return () => {
            ws.close();
        };
    }, []);
    const connectionStatus = useSelector(state => state.connectionStatus);

    return (
        <div>
            <h2>App</h2>
            <div>
                Messages
                <ol>
                    {messages.map(element => (
                        <li>{JSON.stringify(element)}</li>
                    ))}
                </ol>
            </div>
            <p>
                <strong>connected: </strong> {connectionStatus.connected.toString()}
            </p>
        </div>
    );
};

export default App;
