
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { users } from '@/lib/dummyData';
import { toast } from '@/components/ui/use-toast';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (userId: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo login logic - in real app, this would validate against a backend
    if (username.toLowerCase() === 'admin' && password === 'admin') {
      onLogin('2'); // Admin user ID
      toast({
        title: "Logged in",
        description: "Welcome, Admin User",
      });
    } else if (username.toLowerCase() === 'user' && password === 'user') {
      onLogin('1'); // Regular user ID
      toast({
        title: "Logged in",
        description: "Welcome, Regular User",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Try 'admin/admin' or 'user/user'",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md z-[100]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Use these demo accounts:
            <br/>- Regular user: username "user", password "user"
            <br/>- Admin: username "admin", password "admin"
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button type="submit">Login</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
