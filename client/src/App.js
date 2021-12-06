import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const App = () => {
    const [messages, setMessages] = useState([]);
    const hrdata = {
        labels: messages.map(message => {
            const date = new Date(message.systemA.timestamp);
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        }),
        datasets: [
            {
                label: 'Heart Rate',
                borderColor: 'rgba(255,0,0,1)',
                data: messages.map(message => message.systemA.data.hr),
            },
        ],
    };
    const brdata = {
        labels: messages.map(message => {
            const date = new Date(message.systemA.timestamp);
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        }),
        datasets: [
            {
                label: 'Breathing Rate',
                borderColor: 'rgba(0,0,255,1)',
                data: messages.map(message => message.systemA.data.br),
            },
        ],
    };
    const Bmessages = messages.filter(message => message.systemB);
    const movementData = {
        labels: Bmessages.map(message => {
            const date = new Date(message.systemA.timestamp);
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        }),
        datasets: [
            {
                label: 'Movement',
                borderColor: 'rgba(0,255,0,1)',
                spanGaps: true,
                data: Bmessages.map(message => message.systemB.data.movement),
            },
        ],
    };
    useEffect(() => {
        let ws = new WebSocket('ws://localhost:3010');
        ws.onmessage = e => {
            try {
                const message = JSON.parse(e.data);
                setMessages(oldMessages => {
                    if (oldMessages.length >= 20) {
                        oldMessages.shift();
                    }
                    return [...oldMessages, message];
                });
            } catch {}
        };
        return () => {
            ws.close();
        };
    }, []);

    return (
        <div>
            <h2>Oakley Ward : Room 1</h2>
            <div style={{ height: '200px', width: '1000px' }}>
                <div style={{ width: '50%', float: 'left' }}>
                    <Line data={hrdata} options={{ responsive: true }} />
                    <Line data={movementData} options={{ responsive: true }} />
                </div>
                <div style={{ width: '50%', float: 'right' }}>
                    <Line data={brdata} options={{ responsive: true }} />
                </div>
            </div>
            <div style={{ height: '300px', width: '300px' }}></div>
            <span>
                Last 5 Messages
                <ol>
                    {messages.slice(-5).map(element => (
                        <li>{JSON.stringify(element)}</li>
                    ))}
                </ol>
            </span>
        </div>
    );
};

export default App;
