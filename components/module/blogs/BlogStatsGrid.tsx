import { FileText, Globe, Edit2 } from "lucide-react";
import { BlogPost } from "./blog.types";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  colorClass: string;
  bgClass: string;
  glowClass: string;
}

function StatCard({ icon, label, value, colorClass, bgClass, glowClass }: StatCardProps) {
  return (
    <div className="relative overflow-hidden bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-xs flex items-center gap-5">
      <div className={`absolute top-0 right-0 w-32 h-32 ${glowClass} rounded-full blur-2xl -mr-5 -mt-5`} />
      <div className={`p-4 ${bgClass} ${colorClass} rounded-2xl`}>{icon}</div>
      <div>
        <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">{label}</p>
        <h3 className="text-3xl font-extrabold text-neutral-900 mt-1">{value}</h3>
      </div>
    </div>
  );
}

interface BlogStatsGridProps {
  posts: BlogPost[];
  total: number;
  isLoading: boolean;
}

export function BlogStatsGrid({ posts, total, isLoading }: BlogStatsGridProps) {
  const published = posts.filter((p) => p.isPublished).length;
  const drafts = posts.filter((p) => !p.isPublished).length;
  const display = (n: number | string) => (isLoading ? "..." : n);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={<FileText className="w-6 h-6" />}
        label="Total Articles"
        value={display(total)}
        colorClass="text-rose-500"
        bgClass="bg-rose-50"
        glowClass="bg-rose-500/5"
      />
      <StatCard
        icon={<Globe className="w-6 h-6" />}
        label="Published"
        value={display(published)}
        colorClass="text-emerald-500"
        bgClass="bg-emerald-50"
        glowClass="bg-emerald-500/5"
      />
      <StatCard
        icon={<Edit2 className="w-6 h-6" />}
        label="Drafts"
        value={display(drafts)}
        colorClass="text-amber-500"
        bgClass="bg-amber-50"
        glowClass="bg-amber-500/5"
      />
    </div>
  );
}
