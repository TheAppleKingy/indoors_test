# app/chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

messages_history = []


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = 'global_chat'
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await self.send(text_data=json.dumps({
            'type': 'history',
            'messages': messages_history[-50:]
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message', '')
        username = data.get('username', 'Anonymous')

        from datetime import datetime
        message_data = {
            'username': username,
            'message': message,
            'timestamp': datetime.now().strftime('%H:%M:%S')
        }

        messages_history.append(message_data)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'username': username,
                'message': message,
                'timestamp': message_data['timestamp']
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'username': event['username'],
            'message': event['message'],
            'timestamp': event['timestamp']
        }))
