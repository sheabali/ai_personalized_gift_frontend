"use client";

import { useState } from "react";
import { useGetUserRemindersQuery, useCreateReminderMutation, useDeleteReminderMutation } from "@/redux/api/reminderApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CalendarHeart, Plus, Trash2, CalendarDays, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RemindersPage() {
  const { data: remindersRes, isLoading } = useGetUserRemindersQuery({});
  const [createReminder, { isLoading: isCreating }] = useCreateReminderMutation();
  const [deleteReminder] = useDeleteReminderMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    recipientName: "",
    relation: "",
    occasionType: "",
    occasionDate: "",
  });

  const reminders = remindersRes?.data || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createReminder(formData).unwrap();
      if (res.success) {
        toast.success("Reminder added successfully!");
        setIsOpen(false);
        setFormData({ recipientName: "", relation: "", occasionType: "", occasionDate: "" });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add reminder");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReminder(id).unwrap();
      toast.success("Reminder deleted");
    } catch (error) {
      toast.error("Failed to delete reminder");
    }
  };

  const getDaysLeft = (dateString: string) => {
    const today = new Date();
    const target = new Date(dateString);
    target.setFullYear(today.getFullYear());
    
    if (target.getTime() < today.getTime()) {
      target.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = Math.abs(target.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <CalendarHeart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Gift Reminders</h1>
            <p className="text-neutral-500">Never miss a special occasion again. We'll remind you 7 days in advance!</p>
          </div>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl h-12 px-6 gap-2 bg-neutral-900 hover:bg-neutral-800 text-white">
              <Plus className="w-4 h-4" /> Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Reminder</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Recipient's Name</label>
                <Input 
                  required
                  placeholder="e.g. John Doe"
                  value={formData.recipientName}
                  onChange={e => setFormData({...formData, recipientName: e.target.value})}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Relationship</label>
                <Select required value={formData.relation} onValueChange={v => setFormData({...formData, relation: v})}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spouse">Spouse</SelectItem>
                    <SelectItem value="Parent">Parent</SelectItem>
                    <SelectItem value="Sibling">Sibling</SelectItem>
                    <SelectItem value="Friend">Friend</SelectItem>
                    <SelectItem value="Child">Child</SelectItem>
                    <SelectItem value="Colleague">Colleague</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Occasion</label>
                <Select required value={formData.occasionType} onValueChange={v => setFormData({...formData, occasionType: v})}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Birthday">Birthday</SelectItem>
                    <SelectItem value="Anniversary">Anniversary</SelectItem>
                    <SelectItem value="Valentine's Day">Valentine's Day</SelectItem>
                    <SelectItem value="Mother's Day">Mother's Day</SelectItem>
                    <SelectItem value="Father's Day">Father's Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Date</label>
                <Input 
                  required
                  type="date"
                  value={formData.occasionDate}
                  onChange={e => setFormData({...formData, occasionDate: e.target.value})}
                  className="rounded-xl h-12 block"
                />
              </div>
              <Button type="submit" disabled={isCreating} className="w-full h-12 rounded-xl mt-4 bg-primary text-white hover:bg-primary/90">
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Reminder"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100">
          <CalendarDays className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neutral-900">No reminders yet</h3>
          <p className="text-neutral-500 mt-2">Add your first reminder to get smart AI gift suggestions!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reminders.map((reminder: any) => {
            const daysLeft = getDaysLeft(reminder.occasionDate);
            return (
              <div key={reminder.id} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[20px] pointer-events-none"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <h3 className="font-bold text-lg text-neutral-900">{reminder.recipientName}</h3>
                    <p className="text-sm text-neutral-500">{reminder.relation}</p>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    {reminder.occasionType}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-neutral-700 mb-6">
                  <CalendarDays className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {new Date(reminder.occasionDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-auto border-t border-neutral-100 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75 ${daysLeft <= 14 ? 'bg-red-400' : 'bg-green-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${daysLeft <= 14 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    </span>
                    <p className={`text-sm font-bold ${daysLeft <= 14 ? 'text-red-500' : 'text-green-600'}`}>
                      In {daysLeft} Days
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg h-8 w-8 transition-colors"
                    onClick={() => handleDelete(reminder.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
