import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Plus, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Reminder } from "@shared/schema";

export default function Reminders() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reminders = [], isLoading } = useQuery({
    queryKey: ['/api/reminders'],
  });

  const createMutation = useMutation({
    mutationFn: async (reminderData: { title: string; description?: string; dueDate: string }) => {
      const response = await apiRequest('POST', '/api/reminders', {
        ...reminderData,
        dueDate: new Date(reminderData.dueDate).toISOString()
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
      setIsDialogOpen(false);
      setTitle("");
      setDescription("");
      setDueDate("");
      toast({ title: "Reminder created successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Failed to create reminder",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const response = await apiRequest('PUT', `/api/reminders/${id}`, { completed });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update reminder",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/reminders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
      toast({ title: "Reminder deleted successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete reminder",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });

  const handleCreate = () => {
    if (!title.trim() || !dueDate) return;
    createMutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate
    });
  };

  const handleToggleComplete = (reminder: Reminder) => {
    updateMutation.mutate({
      id: reminder.id,
      completed: !reminder.completed
    });
  };

  const isOverdue = (dueDate: Date) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const isToday = (dueDate: Date) => {
    return new Date(dueDate).toDateString() === new Date().toDateString();
  };

  const pendingReminders = (reminders as Reminder[]).filter(r => !r.completed);
  const completedReminders = (reminders as Reminder[]).filter(r => r.completed);

  return (
    <div>
      <header className="bg-white border-b border-slate-200 px-6 py-4 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
              <Bell className="text-warning" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Reminders</h2>
              <p className="text-slate-600">Stay on top of your study schedule</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                Add Reminder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Reminder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What do you need to remember?"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add additional details..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleCreate}
                  disabled={!title.trim() || !dueDate || createMutation.isPending}
                  className="w-full"
                >
                  {createMutation.isPending ? "Creating..." : "Create Reminder"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-6 lg:p-8 space-y-8">
        {/* Pending Reminders */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Pending ({pendingReminders.length})
          </h3>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-4 h-4 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : pendingReminders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No pending reminders</h3>
                <p className="text-slate-500 mb-4">Create your first reminder to stay organized</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Add Your First Reminder
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingReminders.map((reminder) => (
                <Card key={reminder.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={false}
                        onCheckedChange={() => handleToggleComplete(reminder)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900 mb-1">{reminder.title}</h4>
                            {reminder.description && (
                              <p className="text-slate-600 text-sm mb-2">{reminder.description}</p>
                            )}
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <Calendar size={14} className="text-slate-400" />
                                <span className="text-slate-500">
                                  {new Date(reminder.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock size={14} className="text-slate-400" />
                                <span className="text-slate-500">
                                  {new Date(reminder.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isOverdue(reminder.dueDate) && (
                              <Badge variant="destructive" className="flex items-center space-x-1">
                                <AlertCircle size={12} />
                                <span>Overdue</span>
                              </Badge>
                            )}
                            {isToday(reminder.dueDate) && !isOverdue(reminder.dueDate) && (
                              <Badge variant="secondary" className="flex items-center space-x-1">
                                <Clock size={12} />
                                <span>Today</span>
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMutation.mutate(reminder.id)}
                              disabled={deleteMutation.isPending}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Completed Reminders */}
        {completedReminders.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Completed ({completedReminders.length})
            </h3>
            <div className="space-y-4">
              {completedReminders.map((reminder) => (
                <Card key={reminder.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={true}
                        onCheckedChange={() => handleToggleComplete(reminder)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-600 line-through mb-1">{reminder.title}</h4>
                            {reminder.description && (
                              <p className="text-slate-500 text-sm mb-2 line-through">{reminder.description}</p>
                            )}
                            <div className="flex items-center space-x-1 text-sm">
                              <CheckCircle size={14} className="text-green-500" />
                              <span className="text-slate-500">
                                Completed on {new Date(reminder.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate(reminder.id)}
                            disabled={deleteMutation.isPending}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
