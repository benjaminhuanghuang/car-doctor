import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Send, Bot } from 'lucide-react';
import { Input } from './ui/input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carInfo?: {
    brand: string;
    model: string;
    year: number;
    maintenanceCount: number;
  };
}

export const ChatPanel = ({ open, onOpenChange, carInfo }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: carInfo
        ? `Hello! I'm your car maintenance assistant. I can help you with questions about your ${carInfo.year} ${carInfo.brand} ${carInfo.model}. Feel free to ask me about maintenance schedules, common issues, or best practices!`
        : "Hello! I'm your car maintenance assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(userMessage.content, carInfo),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-128 bg-background border rounded-lg shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary/5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Car Assistant</h3>
            <p className="text-xs text-muted-foreground">AI-powered help</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about maintenance, repairs..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Simple response generator (replace with actual AI API)
function generateResponse(userInput: string, carInfo?: ChatPanelProps['carInfo']): string {
  const input = userInput.toLowerCase();

  if (input.includes('oil change') || input.includes('oil')) {
    return `For your ${carInfo ? `${carInfo.year} ${carInfo.brand} ${carInfo.model}` : 'car'}, oil changes are typically recommended every 5,000-7,500 miles or every 6 months, whichever comes first. However, always check your owner's manual for specific recommendations. Using the right oil grade is also important for optimal engine performance.`;
  }

  if (input.includes('tire') || input.includes('rotation')) {
    return "Tire rotation is recommended every 5,000-7,500 miles. This helps ensure even tire wear and extends the life of your tires. During rotation, it's also a good time to check tire pressure and tread depth.";
  }

  if (input.includes('brake')) {
    return 'Brake pads typically last 30,000-70,000 miles depending on driving habits. Signs you need new brakes include squealing noises, longer stopping distances, or a pulsing brake pedal. Have them inspected at least once a year.';
  }

  if (input.includes('maintenance schedule') || input.includes('schedule')) {
    return `Here's a general maintenance schedule:\n\n• 5,000 miles: Oil change, tire rotation\n• 15,000 miles: Air filter inspection\n• 30,000 miles: Brake inspection, coolant check\n• 60,000 miles: Major service (multiple fluids, belts)\n\nYour owner's manual has the exact schedule for your vehicle.`;
  }

  if (input.includes('cost') || input.includes('price') || input.includes('expensive')) {
    return 'Maintenance costs vary by service and location. Regular maintenance is always cheaper than major repairs! Oil changes typically cost $40-100, tire rotations $20-50, and brake service $150-300 per axle. Track your expenses to budget effectively.';
  }

  if (input.includes('thank') || input.includes('thanks')) {
    return "You're welcome! Feel free to ask if you have more questions about your car maintenance!";
  }

  return `I can help you with maintenance schedules, common issues, and best practices for your ${carInfo ? `${carInfo.brand} ${carInfo.model}` : 'vehicle'}. Try asking about oil changes, tire rotation, brake service, or general maintenance schedules!`;
}
