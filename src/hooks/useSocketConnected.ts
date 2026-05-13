import { useEffect, useState } from 'react';
import { socketService } from '../services/socketService';

export function useSocketConnected() {
    const [connected, setConnected] = useState(socketService.isConnected());

    useEffect(() => {
        socketService.onConnectionChange((isConnected) => {
            setConnected(isConnected);
        });
    }, []);

    return connected;
}
