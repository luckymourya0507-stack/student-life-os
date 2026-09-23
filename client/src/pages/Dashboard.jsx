import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckSquare, FileText, GraduationCap, Calculator, Code, Network, FileCode2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import Loading from '../components/Loading';

const Dashboard = () => {
  const [stats, setStats] = useState({
    subjects: 0,
    tasks: 0,
    notes: 0,
    exams: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, tasksRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/tasks?status=Pending&sort=dueDateAsc')
      ]);

      setStats(statsRes.data);
      setUpcomingTasks(tasksRes.data.slice(0, 3)); // show top 3 upcoming tasks
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleTaskStatus = async (task) => {
    try {
      const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      await api.put(`/tasks/${task._id}`, { status: newStatus });
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  if (loading) {
    return <Loading type="cards" count={4} />;
  }

  return (
    <div className="space-y-8 pb-10">
      {/* 4 Stat Cards Row - Exactly like reference image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Subjects"
          value={stats.subjects}
          icon={BookOpen}
          colorTheme="blue"
          onClick={() => navigate('/subjects')}
        />
        <StatCard
          title="Tasks"
          value={stats.tasks}
          icon={CheckSquare}
          colorTheme="green"
          onClick={() => navigate('/tasks')}
        />
        <StatCard
          title="Notes"
          value={stats.notes}
          icon={FileText}
          colorTheme="purple"
          onClick={() => navigate('/notes')}
        />
        <StatCard
          title="Exams"
          value={stats.exams}
          icon={GraduationCap}
          colorTheme="red"
          onClick={() => navigate('/exams')}
        />
      </div>

      {/* Motivational Banner - Styled like reference image */}
      <div className="banner-gradient rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-sm border border-indigo-100/50 dark:border-indigo-900/40">
        <div className="z-10 max-w-xl text-left space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
            “Discipline today leads to success tomorrow.”
          </h2>
          <p className="text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-400 flex items-center space-x-2">
            <span>Keep Learning, Keep Growing</span>
            <span>🚀</span>
          </p>
        </div>

        {/* Decorative Graphic Element */}
        <div className="mt-6 md:mt-0 relative w-full md:w-64 h-36 flex items-center justify-center">
          <div className="w-48 h-32 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/60 dark:border-slate-700/60 transform rotate-2 hover:rotate-0 transition-all duration-300 flex flex-col justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="space-y-1.5">
              <div className="w-3/4 h-2 bg-slate-300 dark:bg-slate-600 rounded" />
              <div className="w-1/2 h-2 bg-indigo-400 rounded" />
              <div className="w-5/6 h-2 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
            <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold self-end">
              STUDENT OS v1.0
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Upcoming Tasks & Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Tasks Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Upcoming Tasks
            </h3>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="card-soft p-8 text-center text-slate-400">
              <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No pending tasks right now!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleStatus={handleToggleTaskStatus}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Tools Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Quick Tools
            </h3>
            <button
              onClick={() => navigate('/tools')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
            >
              <span>Open Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/tools?tab=calculator')}
              className="card-soft p-6 flex items-center space-x-4 hover:border-indigo-500/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 group transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Calculator
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Quick math</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/tools?tab=pdf')}
              className="card-soft p-6 flex items-center space-x-4 hover:border-indigo-500/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 group transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <FileCode2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  PDF Notes
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Study files</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/tools?tab=flowchart')}
              className="card-soft p-6 flex items-center space-x-4 hover:border-indigo-500/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 group transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Network className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Flowcharts
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Mind maps</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/tools?tab=editor')}
              className="card-soft p-6 flex items-center space-x-4 hover:border-indigo-500/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 group transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Code Editor
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Live sandbox</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
