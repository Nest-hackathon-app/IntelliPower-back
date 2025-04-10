import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsSocketManagerService {

  //Set of sockets to allow multiple connetions from the same user
  private clients = new Map<string, Set<Socket>>();

  addClient(userId: string, client: Socket) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId)?.add(client);
  }

  removeClient(userId: string, client: Socket) {
    if (!this.clients.has(userId)) return;

    const userSockets = this.clients.get(userId);
    userSockets?.delete(client);

    // Remove user from the map if no more active sockets
    if (userSockets?.size === 0) {
      this.clients.delete(userId);
    }
  }

  getClients(userId: string): Set<Socket> | undefined {
    return this.clients.get(userId);
  }

  getAllClients(): Map<string, Set<Socket>> {
    return this.clients;
  }

  broadcastToUser(userId: string, event: string, payload: any) {
    this.clients.get(userId)?.forEach((socket) => {
      socket.emit(event, payload);
    });
  }
}
