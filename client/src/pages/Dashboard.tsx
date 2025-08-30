import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, MapPin, Eye, Clock, CheckCircle, AlertTriangle, XCircle, User, Calendar, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [selectedReport, setSelectedReport] = useState<number | null>(null);
  const { user } = useAuth();

  // Mock data for reports
  const reports = [
    {
      id: 1,
      title: "Mangrove Clearing for Development",
      description: "Large area of mangroves cut down for new resort construction",
      severity: "severe",
      status: "pending",
      location: { lat: 25.7617, lng: -80.1918, name: "Biscayne Bay, FL" },
      submittedBy: user?.fullname || "EcoWatcher23",
      timestamp: "2024-01-20T10:30:00Z",
      photo: true
    },
    {
      id: 2,
      title: "Oil Spill Contamination",
      description: "Small oil leak affecting mangrove roots in the northern section",
      severity: "moderate",
      status: "investigating",
      location: { lat: 25.7517, lng: -80.1818, name: "Key Biscayne, FL" },
      submittedBy: "GreenGuardian",
      timestamp: "2024-01-19T14:15:00Z",
      photo: true
    },
    {
      id: 3,
      title: "Trash Accumulation",
      description: "Plastic debris and garbage accumulating around mangrove roots",
      severity: "minor",
      status: "resolved",
      location: { lat: 25.7417, lng: -80.1718, name: "Stiltsville, FL" },
      submittedBy: user?.fullname || "OceanProtector",
      timestamp: "2024-01-18T09:45:00Z",
      photo: false
    }
  ];

  // User stats
  const userStats = {
    totalReports: reports.filter(r => r.submittedBy === user?.fullname).length || 3,
    resolvedIssues: reports.filter(r => r.submittedBy === user?.fullname && r.status === 'resolved').length || 1,
    impactScore: 94,
    joinDate: "January 2024"
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "investigating":
        return <Badge variant="secondary" className="bg-ocean/10 text-ocean border-ocean/20"><Eye className="w-3 h-3 mr-1" />Investigating</Badge>;
      case "resolved":
        return <Badge variant="secondary" className="bg-success/10 text-success border-success/20"><CheckCircle className="w-3 h-3 mr-1" />Resolved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "severe":
        return <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20"><XCircle className="w-3 h-3 mr-1" />Severe</Badge>;
      case "moderate":
        return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20"><AlertTriangle className="w-3 h-3 mr-1" />Moderate</Badge>;
      case "minor":
        return <Badge variant="secondary" className="bg-success/10 text-success border-success/20"><CheckCircle className="w-3 h-3 mr-1" />Minor</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  const handleStatusUpdate = (reportId: number, newStatus: string) => {
    // Mock status update - in real app would call API
    console.log(`Updating report ${reportId} to status: ${newStatus}`);
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-card">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-mangrove bg-clip-text text-transparent">
            Welcome back, {user?.fullname || 'Protector'}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Your environmental protection dashboard
          </p>
        </div>

        {/* User Profile Section */}
        <div className="mb-8">
          <Card className="shadow-nature bg-gradient-mangrove text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user?.fullname || 'Environmental Protector'}</h2>
                    <p className="text-white/80">{user?.email}</p>
                    <div className="flex items-center mt-2 space-x-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Member since {userStats.joinDate}
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        Impact Score: {userStats.impactScore}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Your Reports", value: userStats.totalReports.toString(), icon: BarChart3, color: "text-primary" },
            { label: "Pending Review", value: "2", icon: Clock, color: "text-warning" },
            { label: "Under Investigation", value: "1", icon: Eye, color: "text-ocean" },
            { label: "Resolved Issues", value: userStats.resolvedIssues.toString(), icon: CheckCircle, color: "text-success" }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-nature">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports">Reports List</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="mt-6">
            <div className="grid gap-6">
              {reports.map((report) => (
                <Card key={report.id} className="shadow-nature hover:shadow-floating transition-slow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg mb-2">{report.title}</CardTitle>
                        <CardDescription className="text-base">
                          {report.description}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {getSeverityBadge(report.severity)}
                        {getStatusBadge(report.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {report.location.name}
                        </div>
                        <div>
                          Reported by: <span className="font-medium">{report.submittedBy}</span>
                        </div>
                        <div>
                          {new Date(report.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {report.status === "pending" && (
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(report.id, "investigating")}
                            className="bg-gradient-ocean"
                          >
                            Start Investigation
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusUpdate(report.id, "resolved")}
                          >
                            Mark as Resolved
                          </Button>
                        </div>
                      )}
                      
                      {report.status === "investigating" && (
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(report.id, "resolved")}
                            className="bg-gradient-mangrove"
                          >
                            Mark as Resolved
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusUpdate(report.id, "pending")}
                          >
                            Back to Pending
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <Card className="shadow-floating">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Report Locations
                </CardTitle>
                <CardDescription>
                  Interactive map showing all reported damage locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-ocean-light/30 to-mangrove-light/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Interactive map would be integrated here<br />
                      (Mapbox, Google Maps, or Leaflet)
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Showing {reports.length} report locations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;