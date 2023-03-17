import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel } from 'amqplib';
import { EventEmitter } from 'events';
import promiseWithTimeout from '../helpers/timeout';

export default class Producer {
  private timeout: number;
  constructor(
    private channel: Channel,
    private eventEmitter: EventEmitter,
    private replyQueue: string,
    private config: ConfigService,
  ) {
    this.timeout = this.config.getOrThrow<number>('server.timeout');
  }

  async publishMessage(
    data,
    queueName,
    correlationId,
    headers = {},
    waitForResponse = true,
    needToAssertQueue = false,
  ) {
    //Make sure the consumer's queue exists before sending
    if (needToAssertQueue) await this.channel.assertQueue(queueName);

    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
      correlationId: correlationId,
      replyTo: this.replyQueue,
      headers,
      expiration: this.config.get('rabbitMQ.messageExpiration'),
    });

    //Receive the response from the event emitted on the same correlation id
    if (waitForResponse) {
      const response = () => {
        return new Promise((resolve, reject) => {
          this.eventEmitter.once(correlationId, async (msg) => {
            try {
              const reply = JSON.parse(msg.content.toString());
              if (!reply.error) {
                resolve(reply);
              } else throw reply;
            } catch (err) {
              const e = err as Record<string, string> & { statusCode: number };
              reject(new HttpException(e, e.statusCode || 500));
            }
          });
        });
      };
      return promiseWithTimeout(this.timeout, response);
    }
  }
}