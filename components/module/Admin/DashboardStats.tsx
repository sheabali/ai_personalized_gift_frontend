"use client";

import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStatsProps {
  stats: any;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: "+5.2%",
      isPositive: true,
      icon: ShoppingBag,
      color: "bg-green-500",
    },
    {
      title: "Active Users",
      value: stats.totalUsers.toLocaleString(),
      change: "+8.1%",
      isPositive: true,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "AI Designs",
      value: stats.totalDesigns.toLocaleString(),
      change: "+14.3%",
      isPositive: true,
      icon: Sparkles,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white p-6 rounded-[2.5rem] border border-neutral-100 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${card.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
              card.isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}>
              {card.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {card.change}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-neutral-400">{card.title}</p>
            <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight">{card.value}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
