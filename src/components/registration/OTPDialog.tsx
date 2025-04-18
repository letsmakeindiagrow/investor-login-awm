import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OTPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: "email" | "mobile";
}

// Use VITE_BACKEND_URL from .env for backend API base URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const OTPDialog: React.FC<OTPDialogProps> = ({
  isOpen,
  onClose,
  type,
}) => {
  const [otp, setOtp] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/auth/verify-otp`,
        {
          userId,
          otp,
        }
      );

      if (response.data) {
        console.log("OTP verified successfully");
        onClose();
        console.log(response);
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter OTP sent to your {type}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleVerify}>
          <div>
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              pattern="\d{6}"
              required
              placeholder="Enter 6-digit OTP"
            />
          </div>
          <Button type="submit" className="w-full">
            Verify OTP
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
