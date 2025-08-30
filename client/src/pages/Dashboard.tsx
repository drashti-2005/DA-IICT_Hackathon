import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, MapPin, Eye, Clock, CheckCircle, AlertTriangle, XCircle, User, Calendar, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { dashboardAPI } from "../services/api";
import { useToast } from "@/components/ui/use-toast";
import { Report, UserStats, DashboardResponse } from "../types/dashboard";

const Dashboard = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardResponse>({
    user: {
      points: 0,
      level: 'Scout',
      badges: []
    },
    stats: {
      totalReports: 0,
      resolvedIssues: 0,
      impactScore: 0,
      joinDate: new Date().toISOString()
    },
    nextLevel: null
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard data using our API service
      const [dashboardResponse, reportsResponse] = await Promise.all([
        dashboardAPI.getDashboardStats(),
        dashboardAPI.getUserReports({ limit: 10 })
      ]);

      setDashboardData(dashboardResponse);
      setReports(reportsResponse.reports);

      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-card flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }


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

  const handleStatusUpdate = async (reportId: string, newStatus: string) => {
    try {
      await dashboardAPI.updateReportStatus(reportId, newStatus);
      
      toast({
        title: "Status Updated",
        description: "Report status has been successfully updated.",
      });
      
      // Refresh the reports list
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating report status:', error);
      toast({
        title: "Error",
        description: "Failed to update report status. Please try again.",
        variant: "destructive"
      });
    }
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
                        Member since {new Date(dashboardData.stats.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        Impact Score: {dashboardData.stats.impactScore}% • Level: {dashboardData.user.level}
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
            { label: "Your Reports", value: dashboardData.stats.totalReports.toString(), icon: BarChart3, color: "text-primary" },
            { label: "Pending Review", value: reports.filter(r => r.status === "pending").length.toString(), icon: Clock, color: "text-warning" },
            { label: "Under Investigation", value: reports.filter(r => r.status === "investigating").length.toString(), icon: Eye, color: "text-ocean" },
            { label: "Resolved Issues", value: dashboardData.stats.resolvedIssues.toString(), icon: CheckCircle, color: "text-success" }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-nature">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">
                      {stat.label === "Your Reports" ? dashboardData.stats.totalReports :
                       stat.label === "Resolved Issues" ? dashboardData.stats.resolvedIssues :
                       stat.label === "Under Investigation" ? 
                         reports.filter(r => r.status === "investigating").length :
                       reports.filter(r => r.status === "pending").length}
                    </p>
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
          <TabsTrigger value="reports">Reports List ({reports.length})</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>          <TabsContent value="reports" className="mt-6">
            <div className="grid gap-6">
              {reports.map((report) => (
                <Card key={report._id} className="shadow-nature hover:shadow-floating transition-slow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg mb-2">Mangrove Damage Report #{report._id.slice(-6)}</CardTitle>
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
                          {report.location.address}
                        </div>
                        <div>
                          Reported by: <span className="font-medium">{report.userId.fullname}</span>
                        </div>
                        <div>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {report.status === "pending" && (
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(report._id, "investigating")}
                            className="bg-gradient-ocean"
                          >
                            Start Investigation
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusUpdate(report._id, "resolved")}
                          >
                            Mark as Resolved
                          </Button>
                        </div>
                      )}
                      
                      {report.status === "investigating" && (
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(report._id, "resolved")}
                            className="bg-gradient-mangrove"
                          >
                            Mark as Resolved
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusUpdate(report._id, "pending")}
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