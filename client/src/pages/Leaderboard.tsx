import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Star, TreePine, Shield, Users, TrendingUp } from "lucide-react";

const Leaderboard = () => {
  // Mock leaderboard data
  const topUsers = [
    {
      rank: 1,
      username: "EcoWatcher23",
      points: 2450,
      reports: 78,
      level: "Guardian",
      badge: "🏆",
      color: "from-yellow-400 to-yellow-600",
      verified: true
    },
    {
      rank: 2,
      username: "GreenGuardian",
      points: 2180,
      reports: 65,
      level: "Protector",
      badge: "🥈", 
      color: "from-gray-300 to-gray-500",
      verified: true
    },
    {
      rank: 3,
      username: "OceanProtector",
      points: 1950,
      reports: 52,
      level: "Protector",
      badge: "🥉",
      color: "from-amber-600 to-amber-800",
      verified: true
    },
    {
      rank: 4,
      username: "MangroveHero",
      points: 1680,
      reports: 41,
      level: "Defender",
      badge: "🌟",
      color: "from-mangrove to-mangrove-dark",
      verified: false
    },
    {
      rank: 5,
      username: "NatureWatcher",
      points: 1520,
      reports: 38,
      level: "Defender",
      badge: "🌿",
      color: "from-green-500 to-green-700",
      verified: false
    }
  ];

  const achievements = [
    {
      title: "First Report",
      description: "Submit your first damage report",
      icon: Star,
      color: "text-warning",
      unlocked: true
    },
    {
      title: "Photo Evidence",
      description: "Submit 10 reports with photo evidence",
      icon: Award,
      color: "text-ocean",
      unlocked: true
    },
    {
      title: "Location Scout", 
      description: "Report damage in 5 different locations",
      icon: TreePine,
      color: "text-mangrove",
      unlocked: true
    },
    {
      title: "Community Hero",
      description: "Reach 1000 protection points",
      icon: Shield,
      color: "text-success",
      unlocked: false
    }
  ];

  const getLevelBadge = (level: string) => {
    const levelColors = {
      "Guardian": "bg-gradient-to-r from-yellow-400 to-yellow-600",
      "Protector": "bg-gradient-to-r from-ocean to-ocean-deep", 
      "Defender": "bg-gradient-to-r from-mangrove to-mangrove-dark",
      "Scout": "bg-gradient-to-r from-green-500 to-green-700"
    };
    
    return (
      <Badge className={`${levelColors[level as keyof typeof levelColors] || 'bg-muted'} text-white border-0`}>
        {level}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-card">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-mangrove bg-clip-text text-transparent">
            Community Leaderboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Celebrating our top environmental protectors
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            <Card className="shadow-floating">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-warning" />
                  Top Protectors
                </CardTitle>
                <CardDescription>
                  Rankings based on reports submitted and community impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topUsers.map((user, index) => (
                    <div
                      key={user.username}
                      className={`p-4 rounded-lg border transition-slow hover:shadow-nature ${
                        index < 3 ? 'bg-gradient-card' : 'bg-muted/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className={`bg-gradient-to-br ${user.color} text-white font-bold`}>
                                {user.username.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {index < 3 && (
                              <div className="absolute -top-1 -right-1 text-lg">
                                {user.badge}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{user.username}</h3>
                              {user.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  ✓ Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{user.points} points</span>
                              <span>•</span>
                              <span>{user.reports} reports</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary mb-1">
                            #{user.rank}
                          </div>
                          {getLevelBadge(user.level)}
                        </div>
                      </div>
                      
                      {/* Progress to next level */}
                      {user.level !== "Guardian" && (
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress to next level</span>
                            <span>{Math.min(85, (user.points / 30))}%</span>
                          </div>
                          <Progress value={Math.min(85, (user.points / 30))} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with stats and achievements */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card className="shadow-nature">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Community Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Members</span>
                    <span className="font-semibold">892</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reports This Month</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Areas Protected</span>
                    <span className="font-semibold">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Impact Score</span>
                    <span className="font-semibold text-success">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Progress */}
            <Card className="shadow-nature">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-ocean" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <Avatar className="h-16 w-16 mx-auto mb-3">
                    <AvatarFallback className="bg-gradient-mangrove text-white font-bold text-lg">
                      YU
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold">Your Username</h3>
                  <p className="text-muted-foreground">Rank #47 • Scout Level</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Points</span>
                    <span className="font-medium">340</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Reports</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Next Level Progress</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="shadow-nature">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-coral" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-nature ${
                          achievement.unlocked 
                            ? 'bg-success/10 border border-success/20' 
                            : 'bg-muted/20 border border-muted'
                        }`}
                      >
                        <Icon 
                          className={`h-5 w-5 ${
                            achievement.unlocked ? achievement.color : 'text-muted-foreground'
                          }`} 
                        />
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${
                            achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {achievement.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.unlocked && (
                          <Badge variant="secondary" className="bg-success/10 text-success border-success/20 text-xs">
                            ✓
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;