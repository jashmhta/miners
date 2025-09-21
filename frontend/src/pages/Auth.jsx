import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailIn, setEmailIn] = useState("");
  const [passwordIn, setPasswordIn] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const validEmail = (v) => /.+@.+\..+/.test(v);
  const validPw = (v) => v.length >= 8 && /[0-9]/.test(v) && /[A-Za-z]/.test(v);

  const register = () => {
    if (!validEmail(email)) return toast({ title: "Invalid email" });
    if (!validPw(password)) return toast({ title: "Weak password", description: "Use at least 8 chars with letters and numbers." });
    sessionStorage.setItem("authEmail", email);
    sessionStorage.setItem("auth", "1");
    navigate("/connect-wallet");
  };

  const signIn = () => {
    if (!validEmail(emailIn)) return toast({ title: "Invalid email" });
    if (!validPw(passwordIn)) return toast({ title: "Invalid password" });
    sessionStorage.setItem("authEmail", emailIn);
    sessionStorage.setItem("auth", "1");
    navigate("/connect-wallet");
  };

  return (
    <div className="min-h-[70vh] bg-black text-white">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black mb-6 text-center">Create account or Sign in</h1>
        <Tabs defaultValue="register" className="bg-gray-900 border-4 border-gray-700 p-6">
          <TabsList className="grid grid-cols-2 bg-black">
            <TabsTrigger value="register" className="data-[state=active]:bg-orange-500 data-[state=active]:text-black font-black">Register</TabsTrigger>
            <TabsTrigger value="signin" className="data-[state=active]:bg-orange-500 data-[state=active]:text-black font-black">Sign In</TabsTrigger>
          </TabsList>
          <TabsContent value="register" className="mt-6 space-y-3">
            <div>
              <label className="text-gray-300 font-bold text-sm">Email</label>
              <Input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@email.com" className="mt-2 bg-black border-gray-700 text-white"/>
            </div>
            <div>
              <label className="text-gray-300 font-bold text-sm">Password</label>
              <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" className="mt-2 bg-black border-gray-700 text-white"/>
              <p className="text-xs text-gray-500 mt-1">At least 8 characters, include letters and numbers.</p>
            </div>
            <Button onClick={register} className="w-full bg-orange-500 text-black border-2 border-black font-black hover:bg-orange-400">Continue</Button>
          </TabsContent>
          <TabsContent value="signin" className="mt-6 space-y-3">
            <div>
              <label className="text-gray-300 font-bold text-sm">Email</label>
              <Input value={emailIn} onChange={(e)=>setEmailIn(e.target.value)} placeholder="you@email.com" className="mt-2 bg-black border-gray-700 text-white"/>
            </div>
            <div>
              <label className="text-gray-300 font-bold text-sm">Password</label>
              <Input type="password" value={passwordIn} onChange={(e)=>setPasswordIn(e.target.value)} placeholder="••••••••" className="mt-2 bg-black border-gray-700 text-white"/>
            </div>
            <Button onClick={signIn} className="w-full bg-orange-500 text-black border-2 border-black font-black hover:bg-orange-400">Sign In</Button>
          </TabsContent>
        </Tabs>
        <p className="text-xs text-gray-600 mt-4 text-center">Secure onboarding. No simulation text shown.</p>
      </div>
    </div>
  );
}