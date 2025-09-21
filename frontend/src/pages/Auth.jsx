import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [emailIn, setEmailIn] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const valid = (v) => /.+@.+\..+/.test(v);

  const register = () => {
    if (!valid(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email." });
      return;
    }
    sessionStorage.setItem("authEmail", email);
    toast({ title: "Registration complete (mock)", description: "Proceed to connect wallet." });
    navigate("/connect-wallet");
  };

  const signIn = () => {
    if (!valid(emailIn)) {
      toast({ title: "Invalid email", description: "Please enter a valid email." });
      return;
    }
    sessionStorage.setItem("authEmail", emailIn);
    toast({ title: "Signed in (mock)", description: "Proceed to connect wallet." });
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
          <TabsContent value="register" className="mt-6">
            <label className="text-gray-300 font-bold text-sm">Email</label>
            <Input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@email.com" className="mt-2 bg-black border-gray-700 text-white"/>
            <Button onClick={register} className="mt-4 bg-orange-500 text-black border-2 border-black font-black hover:bg-orange-400">Continue</Button>
          </TabsContent>
          <TabsContent value="signin" className="mt-6">
            <label className="text-gray-300 font-bold text-sm">Email</label>
            <Input value={emailIn} onChange={(e)=>setEmailIn(e.target.value)} placeholder="you@email.com" className="mt-2 bg-black border-gray-700 text-white"/>
            <Button onClick={signIn} className="mt-4 bg-orange-500 text-black border-2 border-black font-black hover:bg-orange-400">Sign In</Button>
          </TabsContent>
        </Tabs>
        <p className="text-xs text-gray-500 mt-4 text-center">Note: This is a staged demo. No real authentication yet.</p>
      </div>
    </div>
  );
}