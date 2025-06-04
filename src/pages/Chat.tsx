
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Search,
  Plus,
  Clock,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Emily Johnson",
      type: "Patient",
      lastMessage: "Thank you for the follow-up appointment",
      time: "10:30 AM",
      unread: 0,
      status: "online"
    },
    {
      id: 2,
      name: "Dr. James Wilson",
      type: "Doctor",
      lastMessage: "Can you review the X-ray results?",
      time: "9:45 AM",
      unread: 2,
      status: "online"
    },
    {
      id: 3,
      name: "Michael Chen",
      type: "Patient",
      lastMessage: "When is my next appointment?",
      time: "Yesterday",
      unread: 1,
      status: "offline"
    },
    {
      id: 4,
      name: "Nurse Sarah Martinez",
      type: "Staff",
      lastMessage: "Patient in Room 3 needs assistance",
      time: "Yesterday",
      unread: 0,
      status: "busy"
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Emily Johnson",
      content: "Hello Dr. Chen, I wanted to follow up on my blood pressure medication.",
      time: "10:15 AM",
      isOwn: false
    },
    {
      id: 2,
      sender: "You",
      content: "Hello Emily! How have you been feeling since we adjusted your medication last week?",
      time: "10:18 AM",
      isOwn: true
    },
    {
      id: 3,
      sender: "Emily Johnson",
      content: "Much better! The dizziness has completely gone away and my readings have been more stable.",
      time: "10:22 AM",
      isOwn: false
    },
    {
      id: 4,
      sender: "You",
      content: "That's excellent news! Please continue with the current dosage and let's schedule a follow-up in 4 weeks.",
      time: "10:25 AM",
      isOwn: true
    },
    {
      id: 5,
      sender: "Emily Johnson",
      content: "Thank you for the follow-up appointment",
      time: "10:30 AM",
      isOwn: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-orange-500';
      default: return 'bg-slate-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Patient': return 'bg-blue-100 text-blue-700';
      case 'Doctor': return 'bg-green-100 text-green-700';
      case 'Staff': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <Layout>
      <div className="flex-1 flex h-[calc(100vh-2rem)] m-4">
        <div className="flex w-full bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Conversations List */}
          <div className="w-80 border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Messages</h2>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedChat(conversation.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChat === conversation.id 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback className="bg-slate-100 text-slate-700">
                            {conversation.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversation.status)}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-slate-900 truncate">{conversation.name}</p>
                          <span className="text-xs text-slate-500">{conversation.time}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-slate-600 truncate">{conversation.lastMessage}</p>
                          {conversation.unread > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className={`text-xs mt-1 ${getTypeColor(conversation.type)}`}>
                          {conversation.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(selectedConversation.status)}`}></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{selectedConversation.name}</h3>
                        <p className="text-sm text-slate-600 capitalize">{selectedConversation.status} • {selectedConversation.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOwn 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-end space-x-1 mt-1 ${
                            message.isOwn ? 'text-blue-100' : 'text-slate-500'
                          }`}>
                            <span className="text-xs">{message.time}</span>
                            {message.isOwn && <CheckCircle className="h-3 w-3" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-200 bg-white">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="healthcare-gradient text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                  <MessageSquare className="h-16 w-16 text-slate-400 mx-auto" />
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">Select a conversation</h3>
                    <p className="text-slate-600">Choose a conversation from the sidebar to start messaging</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
