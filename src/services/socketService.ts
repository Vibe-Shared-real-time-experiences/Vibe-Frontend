import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import type { WsEvent, WsMessageEvent } from '../types/socket';

const SERVER_TOPIC_PREFIX = import.meta.env.VITE_SERVER_TOPIC_PREFIX || '/topic/server/';
const CHANNEL_TOPIC_PREFIX = import.meta.env.VITE_CHANNEL_TOPIC_PREFIX || '/topic/channel/';

class SocketService {
    private client: Client;
    private connected: boolean = false;

    private currentServerId: string | null = null;
    private currentServerSub: StompSubscription | null = null;
    private currentChannelSubs: StompSubscription[] | null = null;

    constructor() {
        this.client = new Client({
            brokerURL: import.meta.env.VITE_REACT_APP_SOCKET_URL || 'http://localhost:8080/ws',
            reconnectDelay: 5000,
        });

        this.client.onConnect = () => {
            this.connected = true;
            this.connectionListeners.forEach(cb => cb(true));
        };

        this.client.onDisconnect = () => {
            this.connected = false;
            console.log('Disconnected from WebSocket, brokerURL: ', this.client.brokerURL);
        };

        this.client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };
    }

    private connectionListeners: ((connected: boolean) => void)[] = [];

    onConnectionChange(callback: (connected: boolean) => void) {
        this.connectionListeners.push(callback);
    }

    connect(token: string) {
        this.client.connectHeaders = {
            Authorization: `Bearer ${token}`,
        };

        if (!this.client.active) {
            this.client.activate();
        }
    }

    disconnect() {
        if (this.client.active) {
            this.client.deactivate();
        }
    }

    // --- 1. QUẢN LÝ SERVER SUBSCRIPTION ---
    subscribeToServer(serverId: string, callback: (event: WsEvent<any>) => void) {
        if (!this.connected) return;

        console.log(`Subscribing to Server: ${serverId}`);
        const destination = `${SERVER_TOPIC_PREFIX}${serverId}`;

        this.currentServerId = serverId;
        this.currentServerSub = this.client.subscribe(destination, (message: IMessage) => {
            if (message.body) {
                const event = JSON.parse(message.body);
                callback(event);
            }
        });
    }

    unsubscribeCurrentServer() {
        if (this.currentServerSub) {
            this.currentServerSub.unsubscribe();
            this.currentServerSub = null;
        }
    }

    // --- 2. QUẢN LÝ CHANNEL SUBSCRIPTION ---
    subscribeToChannels(channelId: string[], callback: (event: WsMessageEvent) => void) {
        console.log("Subscribing to channels: ", channelId);
        if (!this.connected) return;

        this.currentChannelSubs = channelId.map((id) => {
            const destination = `${CHANNEL_TOPIC_PREFIX}${id}`;
            console.log("destination: ", destination);
            return this.client.subscribe(`${destination}`, (message: IMessage) => {
                if (message.body) {
                    const event = JSON.parse(message.body);
                    callback(event);
                }
            });
        });
    }

    unsubscribeCurrentChannel() {
        if (this.currentChannelSubs) {
            this.currentChannelSubs.forEach((sub) => sub.unsubscribe());
            this.currentChannelSubs = null;
        }
    }

    isConnected() {
        return this.connected;
    }

    getCurrentServerId() {
        return this.currentServerId;
    }
}

// (Singleton)
export const socketService = new SocketService();