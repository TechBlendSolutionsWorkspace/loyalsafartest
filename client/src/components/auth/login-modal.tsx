import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Key, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const { toast } = useToast();

  const requestOTPMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      return data;
    },
    onSuccess: () => {
      toast({
        title: "OTP Sent",
        description: "Check your email for the verification code",
      });
      setStep('otp');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Invalid OTP');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: "Login Successful",
        description: "Welcome to MTS Digital Services!",
      });
      onClose();
      onSuccess?.();
      // Reset form
      setStep('email');
      setEmail('');
      setOTP('');
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    requestOTPMutation.mutate(email.trim());
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit code from your email",
        variant: "destructive",
      });
      return;
    }
    verifyOTPMutation.mutate({ email, otp: otp.trim() });
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOTP('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Sign In to MTS Digital Services
          </DialogTitle>
          <DialogDescription>
            {step === 'email' 
              ? 'Enter your email to receive a verification code'
              : 'Enter the 6-digit code sent to your email'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={requestOTPMutation.isPending}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={requestOTPMutation.isPending}
              >
                {requestOTPMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center">
                <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Verification code sent to <strong>{email}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  disabled={verifyOTPMutation.isPending}
                  className="text-center text-lg font-mono tracking-widest"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleBackToEmail}
                  disabled={verifyOTPMutation.isPending}
                  className="flex-1"
                >
                  Change Email
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={verifyOTPMutation.isPending || otp.length !== 6}
                >
                  {verifyOTPMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center">
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm"
                  onClick={() => requestOTPMutation.mutate(email)}
                  disabled={requestOTPMutation.isPending}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Resend Code
                </Button>
              </div>
            </form>
          )}

          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>🔒 Secure login with email verification</p>
            <p>No passwords required - just your email!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}