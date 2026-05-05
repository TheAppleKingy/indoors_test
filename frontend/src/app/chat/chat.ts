import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private ws!: WebSocket;
  messages: { username: string; message: string; timestamp: string }[] = [];
  newMessage = '';
  username = '';
  connected = false;
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.username = localStorage.getItem('username') || 'Anonymous';
    this.connectWebSocket();
  }

  connectWebSocket(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.connected = false;
      return;
    }
    
    this.ws = new WebSocket('ws://localhost:8000/ws/chat/');
    
    this.ws.onopen = () => {
      this.connected = true;
      this.cdr.detectChanges();
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'history') {
        this.messages = data.messages;
      } else if (data.type === 'message') {
        this.messages.push({
          username: data.username,
          message: data.message,
          timestamp: data.timestamp
        });
      }
      this.cdr.detectChanges();
    };
    
    this.ws.onerror = (error) => {
      this.connected = false;
      this.cdr.detectChanges();
    };
    
    this.ws.onclose = () => {
      this.connected = false;
      this.cdr.detectChanges();
    };
  }

  sendMessage(): void {
    if (!this.connected || !this.newMessage.trim()) return;
    
    this.ws.send(JSON.stringify({
      username: this.username,
      message: this.newMessage
    }));
    
    this.newMessage = '';
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.ws) {
      this.ws.close();
    }
  }
}