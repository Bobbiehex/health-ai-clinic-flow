
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [userType, setUserType] = useState("doctor");
  const navigate = useNavigate();

  const handleLogin = () => {
    onLogin();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-12 h-12 healthcare-gradient rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">CM</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">ClinicManager</h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                AI-Powered Healthcare
              </Badge>
            </div>
          </div>
          <p className="text-slate-600">Intelligent clinic management for better patient care</p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={userType} onValueChange={setUserType} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="doctor" className="text-xs">Doctor</TabsTrigger>
                <TabsTrigger value="nurse" className="text-xs">Nurse</TabsTrigger>
                <TabsTrigger value="admin" className="text-xs">Admin</TabsTrigger>
                <TabsTrigger value="patient" className="text-xs">Patient</TabsTrigger>
              </TabsList>
              
              <div className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password"
                    className="h-11"
                  />
                </div>
                
                <Button 
                  className="w-full h-11 healthcare-gradient text-white hover:opacity-90 transition-opacity"
                  onClick={handleLogin}
                >
                  Sign In as {userType.charAt(0).toUpperCase() + userType.slice(1)}
                </Button>
                
                <div className="text-center space-y-2">
                  <Button variant="link" className="text-sm text-slate-600">
                    Forgot your password?
                  </Button>
                  <p className="text-xs text-slate-500">
                    Need access? Contact your system administrator
                  </p>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <div className="w-8 h-8 bg-blue-100 rounded-lg mx-auto flex items-center justify-center">
              <span className="text-blue-600 text-sm">🤖</span>
            </div>
            <p className="text-xs text-slate-600">AI-Powered Insights</p>
          </div>
          <div className="space-y-1">
            <div className="w-8 h-8 bg-green-100 rounded-lg mx-auto flex items-center justify-center">
              <span className="text-green-600 text-sm">📊</span>
            </div>
            <p className="text-xs text-slate-600">Smart Analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
