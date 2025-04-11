import { Injectable, MessageEvent } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class NotificationsSseService {
  private userStreams = new Map<string, Subject<MessageEvent>>();
  sendToClient(userId: string, data: MessageEvent) {
    console.log('User joined stream:', userId);
    const stream = this.userStreams.get(userId);
    if (stream) {
      stream.next(data);
    }
  }
  getStream(userId: string) {
    if (!this.userStreams.has(userId)) {
      const stream = new Subject<MessageEvent>();
      console.log('Creating new stream for user:', userId);

      this.userStreams.set(userId, stream);
      stream.subscribe({
        complete: () => this.userStreams.delete(userId),
      });
    }
    return this.userStreams.get(userId)?.asObservable();
  }
}
