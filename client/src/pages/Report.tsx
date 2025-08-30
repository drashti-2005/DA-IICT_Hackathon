import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Camera, MapPin, Upload, CheckCircle } from "lucide-react";
import { reportAPI } from "@/services/api";

const Report = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    severity: "medium", // Changed from "moderate" to "medium" to match backend enum
    damageType: "other", // Added damageType field required by backend
    photo: null as File | null
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({
            title: "Location captured!",
            description: "Your current location has been recorded.",
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Could not get your location. Please try again.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Location not supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      toast({
        title: "Description required",
        description: "Please provide a description of the damage.",
        variant: "destructive",
      });
      return;
    }

    if (!location) {
      toast({
        title: "Location required",
        description: "Please capture your location first.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare data for API call
      const reportData = {
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat] as [number, number], // [longitude, latitude]
          address: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` // Simple address format
        },
        damageType: formData.damageType,
        description: formData.description.trim(),
        severity: formData.severity,
        images: formData.photo ? [`photo_${Date.now()}.jpg`] : ["placeholder_image.jpg"] // For now, using placeholder
      };

      // Make API call to create report
      const response = await reportAPI.createReport(reportData);
      
      setIsSubmitting(false);
      setSubmitted(true);
      
      toast({
        title: "Report submitted successfully!",
        description: "Thank you for helping protect our mangroves.",
      });
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
      
    } catch (error: any) {
      setIsSubmitting(false);
      console.error("Error submitting report:", error);
      
      toast({
        title: "Error submitting report",
        description: error.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-card">
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto shadow-floating text-center">
            <CardContent className="pt-12 pb-8">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-success mb-4">Report Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Your report has been successfully submitted. Authorities will review it and take appropriate action.
              </p>
              <div className="space-y-2 text-left bg-muted/50 rounded-lg p-4 mb-6">
                <div><strong>Report ID:</strong> #MNG-{Date.now().toString().slice(-6)}</div>
                <div><strong>Status:</strong> <span className="text-warning">Pending Review</span></div>
                <div><strong>Location:</strong> {location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}</div>
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => { setSubmitted(false); setFormData({ description: "", severity: "medium", damageType: "other", photo: null }); setLocation(null); }}>
                  Submit Another Report
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-card">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-floating">
            <CardHeader className="text-center">
              <AlertCircle className="h-12 w-12 text-coral mx-auto mb-4" />
              <CardTitle className="text-3xl font-bold bg-gradient-mangrove bg-clip-text text-transparent">
                Report Mangrove Damage
              </CardTitle>
              <CardDescription className="text-base">
                Help us protect mangrove ecosystems by reporting damage you've observed
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-base font-medium">
                    Location *
                  </Label>
                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={getCurrentLocation}
                      className="flex-1"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {location ? "Location Captured" : "Capture Current Location"}
                    </Button>
                  </div>
                  {location && (
                    <p className="text-sm text-success">
                      📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  )}
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="photo" className="text-base font-medium">
                    Photo Evidence
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-nature">
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <label htmlFor="photo" className="cursor-pointer">
                      <div className="flex flex-col items-center space-y-2">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {formData.photo ? formData.photo.name : "Click to upload photo"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          JPG, PNG up to 10MB
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Damage Type */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Damage Type *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "deforestation", label: "Deforestation" },
                      { value: "pollution", label: "Pollution" },
                      { value: "natural_disaster", label: "Natural Disaster" },
                      { value: "encroachment", label: "Encroachment" },
                      { value: "other", label: "Other" }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, damageType: option.value }))}
                        className={`p-3 border-2 rounded-lg text-center transition-nature ${
                          formData.damageType === option.value 
                            ? "border-primary text-primary bg-primary/5" 
                            : "border-border text-muted-foreground hover:border-primary"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Severity Level */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Damage Severity</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "low", label: "Low", color: "border-success text-success" },
                      { value: "medium", label: "Medium", color: "border-warning text-warning" },
                      { value: "high", label: "High", color: "border-destructive text-destructive" }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, severity: option.value }))}
                        className={`p-3 border-2 rounded-lg text-center transition-nature ${
                          formData.severity === option.value 
                            ? `${option.color} bg-current/5` 
                            : "border-border text-muted-foreground hover:border-primary"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the damage you've observed (e.g., dead trees, water pollution, construction impact, etc.)"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[120px] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-mangrove hover:shadow-floating transition-slow text-lg py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Submit Report
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Report;