import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Briefcase, Target, AlertTriangle, Loader2, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { firecrawlApi } from "@/lib/api/firecrawl";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface JobResult {
  title: string;
  url: string;
  description: string;
  match_score?: number;
  missing_skills?: string[];
  match_reason?: string;
}

const JobMatch = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<string[]>([]);
  const [targetRole, setTargetRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<JobResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [ranking, setRanking] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Load user's skills from latest resume
  useEffect(() => {
    if (!user) { setLoadingProfile(false); return; }
    const load = async () => {
      const { data } = await supabase.from("resumes").select("resume_data, target_role")
        .eq("user_id", user.id).order("updated_at", { ascending: false }).limit(1).single();
      if (data) {
        const rd = data.resume_data as any;
        const s = rd?.profile?.skills?.split(",").map((x: string) => x.trim()).filter(Boolean) ?? [];
        setSkills(s);
        setTargetRole(data.target_role || "");
        setSearchQuery(`${data.target_role || "software developer"} jobs hiring now`);
      }
      setLoadingProfile(false);
    };
    load();
  }, [user]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setJobs([]);

    try {
      const result = await firecrawlApi.search(searchQuery, { limit: 8 });
      if (result.success && result.data?.data) {
        const rawJobs: JobResult[] = result.data.data.map((r: any) => ({
          title: r.title || "Untitled",
          url: r.url || "#",
          description: r.description || r.markdown?.slice(0, 300) || "No description",
        }));
        setJobs(rawJobs);

        // Now rank with AI
        if (skills.length > 0 && rawJobs.length > 0) {
          setRanking(true);
          try {
            const { data, error } = await supabase.functions.invoke("ai-job-match", {
              body: { skills, targetRole, jobs: rawJobs.map(j => ({ title: j.title, description: j.description })) },
            });
            if (!error && data?.matches) {
              const ranked = rawJobs.map((job, idx) => {
                const match = data.matches.find((m: any) => m.index === idx);
                return { ...job, match_score: match?.match_score, missing_skills: match?.missing_skills, match_reason: match?.match_reason };
              }).sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
              setJobs(ranked);
            }
          } catch {
            // Ranking failed, still show unranked results
          }
          setRanking(false);
        }
      } else {
        toast({ title: "Search failed", description: result.error || "No results found.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to search for jobs.", variant: "destructive" });
    }
    setSearching(false);
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-4xl">
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground font-body text-xs">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Button>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-2">
            Job <span className="text-gradient-gold">Match Finder</span>
          </h1>
          <p className="font-body text-sm text-muted-foreground mb-8">
            Find jobs that match your skills. AI ranks results by compatibility.
          </p>
        </motion.div>

        {/* Skills Preview */}
        {skills.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="glass-gold rounded-xl p-4 mb-6">
            <p className="font-body text-xs font-bold text-primary uppercase tracking-wider mb-2">Your Skills (from resume)</p>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s} className="bg-primary/10 text-primary font-body text-xs px-3 py-1 rounded-full border border-primary/20">{s}</span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex gap-3 mb-8">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for jobs..."
            className="bg-secondary border-border font-body"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={searching} className="bg-gradient-gold text-primary-foreground font-body font-semibold shadow-gold shrink-0">
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
            {searching ? "Searching..." : "Find Jobs"}
          </Button>
        </motion.div>

        {/* Ranking indicator */}
        {ranking && (
          <div className="glass-gold rounded-xl p-4 mb-6 flex items-center gap-3">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
            <p className="font-body text-xs text-primary font-medium">AI is ranking jobs by skill match...</p>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="glass-gold rounded-xl p-6 lift-hover"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="w-4 h-4 text-primary shrink-0" />
                    <h3 className="font-body text-sm font-bold text-foreground truncate">{job.title}</h3>
                  </div>
                  <p className="font-body text-xs text-muted-foreground line-clamp-2 mb-2">{job.description}</p>
                  {job.match_reason && (
                    <p className="font-body text-[10px] text-primary font-medium">{job.match_reason}</p>
                  )}
                  {job.missing_skills && job.missing_skills.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <AlertTriangle className="w-3 h-3 text-yellow-400 shrink-0" />
                      <div className="flex flex-wrap gap-1">
                        {job.missing_skills.slice(0, 4).map(s => (
                          <span key={s} className="font-body text-[10px] bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {job.match_score !== undefined && (
                    <div className="text-center">
                      <span className={`font-display text-2xl font-bold ${job.match_score >= 80 ? "text-primary" : job.match_score >= 60 ? "text-yellow-400" : "text-muted-foreground"}`}>
                        {job.match_score}%
                      </span>
                      <p className="font-body text-[9px] text-muted-foreground">match</p>
                    </div>
                  )}
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="border-primary/30 text-primary text-xs h-8">
                      <ExternalLink className="w-3 h-3 mr-1" /> Apply
                    </Button>
                  </a>
                </div>
              </div>
              {job.match_score !== undefined && (
                <Progress value={job.match_score} className="h-1 mt-3 [&>div]:bg-gradient-gold" />
              )}
            </motion.div>
          ))}
        </div>

        {jobs.length === 0 && !searching && (
          <div className="text-center py-16">
            <Target className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-body text-sm text-muted-foreground">Search for jobs to see AI-ranked matches based on your skills.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default JobMatch;
