// import React, { useState, useEffect, createContext, useContext } from 'react';
// import { User, LogOut, Plus, Eye, Edit2, Trash2, CheckCircle, BarChart3, Users, MessageSquare, Calendar, TrendingUp, AlertCircle, Star, Target } from 'lucide-react';

// // Auth Context
// const AuthContext = createContext();

// const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // API Service
// const API_BASE = 'http://localhost:8000';

// const api = {
//   async request(endpoint, options = {}) {
//     const token = localStorage.getItem('token');
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         ...(token && { Authorization: `Bearer ${token}` }),
//       },
//       ...options,
//     };

//     const response = await fetch(`${API_BASE}${endpoint}`, config);
    
//     if (!response.ok) {
//       const error = await response.json().catch(() => ({ detail: 'Request failed' }));
//       throw new Error(error.detail || 'Request failed');
//     }

//     return response.json();
//   },

//   auth: {
//     login: (credentials) => api.request('/auth/login', {
//       method: 'POST',
//       body: JSON.stringify(credentials),
//     }),
//     register: (userData) => api.request('/auth/register', {
//       method: 'POST',
//       body: JSON.stringify(userData),
//     }),
//     me: () => api.request('/auth/me'),
//   },

//   feedback: {
//     list: () => api.request('/feedback/'),
//     create: (data) => api.request('/feedback/', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     }),
//     update: (id, data) => api.request(`/feedback/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     }),
//     delete: (id) => api.request(`/feedback/${id}`, { method: 'DELETE' }),
//     acknowledge: (id) => api.request(`/feedback/${id}/acknowledge`, { method: 'POST' }),
//     stats: () => api.request('/feedback/dashboard/stats'),
//   },

//   users: {
//     team: () => api.request('/users/team'),
//   },
// };

// // Auth Provider
// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       api.auth.me()
//         .then(setUser)
//         .catch(() => localStorage.removeItem('token'))
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = async (credentials) => {
//     const response = await api.auth.login(credentials);
//     localStorage.setItem('token', response.access_token);
//     const userData = await api.auth.me();
//     setUser(userData);
//     return userData;
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   const value = {
//     user,
//     login,
//     logout,
//     loading,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // Components
// const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
//   const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
//   const variants = {
//     primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
//     secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
//     outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-blue-500',
//     danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
//     success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
//   };
//   const sizes = {
//     sm: 'px-3 py-1.5 text-sm',
//     md: 'px-4 py-2 text-sm',
//     lg: 'px-6 py-3 text-base',
//   };

//   return (
//     <button
//       className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// const Card = ({ children, className = '' }) => (
//   <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
//     {children}
//   </div>
// );

// const Input = ({ label, error, className = '', ...props }) => (
//   <div className="space-y-1">
//     {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
//     <input
//       className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
//         error ? 'border-red-300' : ''
//       } ${className}`}
//       {...props}
//     />
//     {error && <p className="text-sm text-red-600">{error}</p>}
//   </div>
// );

// const Select = ({ label, options, error, className = '', ...props }) => (
//   <div className="space-y-1">
//     {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
//     <select
//       className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
//         error ? 'border-red-300' : ''
//       } ${className}`}
//       {...props}
//     >
//       {options.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//     {error && <p className="text-sm text-red-600">{error}</p>}
//   </div>
// );

// const Textarea = ({ label, error, className = '', ...props }) => (
//   <div className="space-y-1">
//     {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
//     <textarea
//       className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
//         error ? 'border-red-300' : ''
//       } ${className}`}
//       rows={4}
//       {...props}
//     />
//     {error && <p className="text-sm text-red-600">{error}</p>}
//   </div>
// );

// const Modal = ({ isOpen, onClose, title, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b">
//           <h3 className="text-lg font-semibold">{title}</h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             ×
//           </button>
//         </div>
//         <div className="p-6">{children}</div>
//       </div>
//     </div>
//   );
// };

// // Login Component
// const Login = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     name: '',
//     role: 'employee',
//     manager_id: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       if (isLogin) {
//         await login({ email: formData.email, password: formData.password });
//       } else {
//         await api.auth.register(formData);
//         setIsLogin(true);
//         setError('Registration successful! Please login.');
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md p-8">
//         <div className="text-center mb-8">
//           <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
//             <MessageSquare className="h-6 w-6 text-white" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">Feedback Hub</h1>
//           <p className="text-gray-600 mt-2">
//             {isLogin ? 'Welcome back' : 'Create your account'}
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {!isLogin && (
//             <>
//               <Input
//                 label="Full Name"
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 required
//               />
//               <Select
//                 label="Role"
//                 value={formData.role}
//                 onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//                 options={[
//                   { value: 'employee', label: 'Employee' },
//                   { value: 'manager', label: 'Manager' },
//                 ]}
//               />
//               {formData.role === 'employee' && (
//                 <Input
//                   label="Manager ID (Optional)"
//                   type="text"
//                   value={formData.manager_id}
//                   onChange={(e) => setFormData({ ...formData, manager_id: e.target.value })}
//                   placeholder="Enter your manager's ID"
//                 />
//               )}
//             </>
//           )}

//           <Input
//             label="Email"
//             type="email"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             required
//           />

//           <Input
//             label="Password"
//             type="password"
//             value={formData.password}
//             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//             required
//           />

//           {error && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-md">
//               <p className="text-sm text-red-600">{error}</p>
//             </div>
//           )}

//           <Button
//             type="submit"
//             className="w-full"
//             disabled={loading}
//           >
//             {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
//           </Button>
//         </form>

//         <div className="mt-6 text-center">
//           <button
//             type="button"
//             onClick={() => setIsLogin(!isLogin)}
//             className="text-blue-600 hover:text-blue-500 text-sm"
//           >
//             {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
//           </button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// // Dashboard Stats Card
// const StatsCard = ({ title, value, icon: Icon, color = 'blue' }) => {
//   const colorClasses = {
//     blue: 'bg-blue-50 text-blue-600',
//     green: 'bg-green-50 text-green-600',
//     yellow: 'bg-yellow-50 text-yellow-600',
//     red: 'bg-red-50 text-red-600',
//   };

//   return (
//     <Card className="p-6">
//       <div className="flex items-center">
//         <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
//           <Icon className="h-6 w-6" />
//         </div>
//         <div className="ml-4">
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-2xl font-semibold text-gray-900">{value}</p>
//         </div>
//       </div>
//     </Card>
//   );
// };

// // Feedback Form Modal
// const FeedbackFormModal = ({ isOpen, onClose, feedback, teamMembers, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     employee_id: '',
//     strengths: '',
//     areas_to_improve: '',
//     sentiment: 'neutral',
//     tags: [],
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (feedback) {
//       setFormData({
//         employee_id: feedback.employee_id,
//         strengths: feedback.strengths,
//         areas_to_improve: feedback.areas_to_improve,
//         sentiment: feedback.sentiment,
//         tags: feedback.tags || [],
//       });
//     } else {
//       setFormData({
//         employee_id: '',
//         strengths: '',
//         areas_to_improve: '',
//         sentiment: 'neutral',
//         tags: [],
//       });
//     }
//   }, [feedback]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       if (feedback) {
//         await api.feedback.update(feedback.id, formData);
//       } else {
//         await api.feedback.create(formData);
//       }
//       onSuccess();
//       onClose();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title={feedback ? 'Edit Feedback' : 'Create Feedback'}
//     >
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {!feedback && (
//           <Select
//             label="Team Member"
//             value={formData.employee_id}
//             onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
//             options={[
//               { value: '', label: 'Select team member' },
//               ...teamMembers.map(member => ({
//                 value: member.id,
//                 label: member.name
//               }))
//             ]}
//             required
//           />
//         )}

//         <Textarea
//           label="Strengths"
//           value={formData.strengths}
//           onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
//           placeholder="What are they doing well?"
//           required
//         />

//         <Textarea
//           label="Areas to Improve"
//           value={formData.areas_to_improve}
//           onChange={(e) => setFormData({ ...formData, areas_to_improve: e.target.value })}
//           placeholder="What could be improved?"
//           required
//         />

//         <Select
//           label="Overall Sentiment"
//           value={formData.sentiment}
//           onChange={(e) => setFormData({ ...formData, sentiment: e.target.value })}
//           options={[
//             { value: 'positive', label: 'Positive' },
//             { value: 'neutral', label: 'Neutral' },
//             { value: 'negative', label: 'Negative' },
//           ]}
//         />

//         {error && (
//           <div className="p-3 bg-red-50 border border-red-200 rounded-md">
//             <p className="text-sm text-red-600">{error}</p>
//           </div>
//         )}

//         <div className="flex gap-3 pt-4">
//           <Button type="submit" disabled={loading} className="flex-1">
//             {loading ? 'Saving...' : feedback ? 'Update' : 'Create'}
//           </Button>
//           <Button type="button" variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// // Feedback Card
// const FeedbackCard = ({ feedback, currentUser, onEdit, onDelete, onAcknowledge }) => {
//   const getSentimentColor = (sentiment) => {
//     switch (sentiment) {
//       case 'positive': return 'text-green-600 bg-green-50';
//       case 'negative': return 'text-red-600 bg-red-50';
//       default: return 'text-yellow-600 bg-yellow-50';
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   return (
//     <Card className="p-6">
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-center gap-3">
//           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(feedback.sentiment)}`}>
//             {feedback.sentiment}
//           </span>
//           <span className="text-sm text-gray-500">
//             {formatDate(feedback.created_at)}
//           </span>
//         </div>
        
//         {currentUser.role === 'manager' && (
//           <div className="flex gap-2">
//             <button
//               onClick={() => onEdit(feedback)}
//               className="p-1 text-gray-400 hover:text-blue-600"
//             >
//               <Edit2 className="h-4 w-4" />
//             </button>
//             <button
//               onClick={() => onDelete(feedback.id)}
//               className="p-1 text-gray-400 hover:text-red-600"
//             >
//               <Trash2 className="h-4 w-4" />
//             </button>
//           </div>
//         )}
//       </div>

//       <div className="space-y-4">
//         <div>
//           <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
//             <Star className="h-4 w-4 text-green-600" />
//             Strengths
//           </h4>
//           <p className="text-gray-700">{feedback.strengths}</p>
//         </div>

//         <div>
//           <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
//             <Target className="h-4 w-4 text-blue-600" />
//             Areas to Improve
//           </h4>
//           <p className="text-gray-700">{feedback.areas_to_improve}</p>
//         </div>

//         {feedback.tags && feedback.tags.length > 0 && (
//           <div className="flex flex-wrap gap-2">
//             {feedback.tags.map((tag, index) => (
//               <span
//                 key={index}
//                 className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//         )}

//         {currentUser.role === 'employee' && !feedback.is_acknowledged && (
//           <div className="pt-4 border-t">
//             <Button
//               onClick={() => onAcknowledge(feedback.id)}
//               variant="success"
//               size="sm"
//               className="flex items-center gap-2"
//             >
//               <CheckCircle className="h-4 w-4" />
//               Acknowledge
//             </Button>
//           </div>
//         )}

//         {feedback.is_acknowledged && (
//           <div className="pt-4 border-t">
//             <div className="flex items-center gap-2 text-green-600">
//               <CheckCircle className="h-4 w-4" />
//               <span className="text-sm">
//                 Acknowledged on {formatDate(feedback.acknowledged_at)}
//               </span>
//             </div>
//           </div>
//         )}
//       </div>
//     </Card>
//   );
// };

// // Manager Dashboard
// const ManagerDashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [feedback, setFeedback] = useState([]);
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [editingFeedback, setEditingFeedback] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const [statsData, teamData, feedbackData] = await Promise.all([
//         api.feedback.stats(),
//         api.users.team(),
//         api.feedback.list(),
//       ]);
//       setStats(statsData);
//       setTeamMembers(teamData);
//       setFeedback(feedbackData);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const handleCreateFeedback = () => {
//     setEditingFeedback(null);
//     setShowFeedbackModal(true);
//   };

//   const handleEditFeedback = (feedback) => {
//     setEditingFeedback(feedback);
//     setShowFeedbackModal(true);
//   };

//   const handleDeleteFeedback = async (feedbackId) => {
//     if (window.confirm('Are you sure you want to delete this feedback?')) {
//       try {
//         await api.feedback.delete(feedbackId);
//         loadData();
//       } catch (error) {
//         console.error('Error deleting feedback:', error);
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-2 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {stats && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatsCard
//             title="Total Feedback"
//             value={stats.total_feedback}
//             icon={MessageSquare}
//             color="blue"
//           />
//           <StatsCard
//             title="Team Size"
//             value={stats.team_size}
//             icon={Users}
//             color="blue"
//           />
//           <StatsCard
//             title="Positive Feedback"
//             value={stats.positive_feedback}
//             icon={TrendingUp}
//             color="green"
//           />
//           <StatsCard
//             title="Needs Attention"
//             value={stats.negative_feedback}
//             icon={AlertCircle}
//             color="red"
//           />
//         </div>
//       )}

//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-semibold text-gray-900">Team Feedback</h2>
//         <Button onClick={handleCreateFeedback} className="flex items-center gap-2">
//           <Plus className="h-4 w-4" />
//           Create Feedback
//         </Button>
//       </div>

//       {feedback.length === 0 ? (
//         <Card className="p-8 text-center">
//           <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
//           <p className="text-gray-600 mb-4">Start providing feedback to your team members.</p>
//           <Button onClick={handleCreateFeedback}>Create First Feedback</Button>
//         </Card>
//       ) : (
//         <div className="grid gap-6">
//           {feedback.map((item) => (
//             <FeedbackCard
//               key={item.id}
//               feedback={item}
//               currentUser={user}
//               onEdit={handleEditFeedback}
//               onDelete={handleDeleteFeedback}
//             />
//           ))}
//         </div>
//       )}

//       <FeedbackFormModal
//         isOpen={showFeedbackModal}
//         onClose={() => setShowFeedbackModal(false)}
//         feedback={editingFeedback}
//         teamMembers={teamMembers}
//         onSuccess={loadData}
//       />
//     </div>
//   );
// };

// // Employee Dashboard
// const EmployeeDashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [feedback, setFeedback] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const [statsData, feedbackData] = await Promise.all([
//         api.feedback.stats(),
//         api.feedback.list(),
//       ]);
//       setStats(statsData);
//       setFeedback(feedbackData);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const handleAcknowledge = async (feedbackId) => {
//     try {
//       await api.feedback.acknowledge(feedbackId);
//       loadData();
//     } catch (error) {
//       console.error('Error acknowledging feedback:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-2 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {stats && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <StatsCard
//             title="Total Feedback"
//             value={stats.total_feedback}
//             icon={MessageSquare}
//             color="blue"
//           />
//           <StatsCard
//             title="Positive Feedback"
//             value={stats.positive_feedback}
//             icon={TrendingUp}
//             color="green"
//           />
//           <StatsCard
//             title="Areas to Improve"
//             value={stats.negative_feedback}
//             icon={Target}
//             color="yellow"
//           />
//         </div>
//       )}

//       <div>
//         <h2 className="text-xl font-semibold text-gray-900 mb-6">My Feedback History</h2>
        
//         {feedback.length === 0 ? (
//           <Card className="p-8 text-center">
//             <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback received yet</h3>
//             <p className="text-gray-600">Your manager will provide feedback here when available.</p>
//           </Card>
//         ) : (
//           <div className="grid gap-6">
//             {feedback.map((item) => (
//               <FeedbackCard
//                 key={item.id}
//                 feedback={item}
//                 currentUser={user}
//                 onAcknowledge={handleAcknowledge}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Header Component
// const Header = () => {
//   const { user, logout } = useAuth();

//   return (
//     <header className="bg-white shadow-sm border-b">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <div className="flex items-center">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//                 <MessageSquare className="h-5 w-5 text-white" />
//               </div>
//               <h1 className="text-xl font-bold text-gray-900">Feedback Hub</h1>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <User className="h-4 w-4 text-gray-500" />
//               <span className="text-sm text-gray-700">{user?.name}</span>
//               <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
//                 {user?.role}
//               </span>
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={logout}
//               className="flex items-center gap-2"
//             >
//               <LogOut className="h-4 w-4" />
//               Logout
//             </Button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// // Main App Component
// const App = () => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-2 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Login />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {user.role === 'manager' ? <ManagerDashboard /> : <EmployeeDashboard />}
//       </main>
//     </div>
//   );
// };

// // Root Component with Auth Provider
// const Root = () => {
//   return (
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   );
// };

// export default Root;


import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Header from './components/header/Header';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.role === 'manager' ? <ManagerDashboard /> : <EmployeeDashboard />}
      </main>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;