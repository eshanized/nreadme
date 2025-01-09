import React, { useState } from 'react';
import { Terminal, Github, Copy, Check, RefreshCw, Code2, AlertCircle, Search, Briefcase, GraduationCap, Heart, Settings, Layout, ExternalLink, Twitter, Linkedin, Mail, Globe, MapPin, Building2, BookOpen, Coffee, Sparkles, Palette, Trophy, Activity, Clock, Calendar, Users, GitFork, Star, User } from 'lucide-react';
import { themes } from './themes';
import { generateReadme } from './utils/generateReadme';
import { Octokit } from 'octokit';

const octokit = new Octokit();

const tabs = [
  { id: 'basic', label: 'Basic Info', icon: Layout },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'professional', label: 'Professional', icon: Briefcase },
  { id: 'interests', label: 'Interests', icon: Heart },
  { id: 'appearance', label: 'Appearance', icon: Settings },
];

function App() {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    bio: '',
    location: '',
    company: '',
    website: '',
    email: '',
    twitter: '',
    linkedin: '',
    skills: '',
    education: '',
    interests: '',
    theme: 'github-dark',
    showStats: true,
    showLanguages: true,
    showStreak: false,
    showActivityGraph: false,
    showWakaTime: false,
    showTrophies: false,
    showContributionCalendar: false,
    showSocial: true,
    showSkills: true,
    showEducation: true,
    languages: [] as string[],
    githubJoinDate: '',
    totalContributions: '',
    totalRepositories: '',
    followers: '',
    following: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await octokit.rest.search.users({
        q: query,
        per_page: 5
      });
      setSearchResults(response.data.items);
    } catch (err) {
      setError('Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const fetchGitHubInfo = async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const [userResponse, reposResponse] = await Promise.all([
        octokit.rest.users.getByUsername({ username }),
        octokit.rest.repos.listForUser({ username, per_page: 100 })
      ]);

      const user = userResponse.data;
      setFormData(prev => ({
        ...prev,
        username: user.login,
        fullName: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        company: user.company || '',
        website: user.blog || '',
        email: user.email || '',
        twitter: user.twitter_username || '',
        githubJoinDate: new Date(user.created_at).toLocaleDateString(),
        followers: user.followers.toString(),
        following: user.following.toString(),
        totalRepositories: user.public_repos.toString()
      }));

      setSearchResults([]);
      setSearchQuery('');
    } catch (err) {
      setError('Failed to fetch user information');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReadme(formData));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <nav className="border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/50 sticky top-0 z-50 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Terminal className="w-6 h-6 text-green-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">GitHub README Generator</h1>
          </div>
          <div className="flex items-center space-x-6">
            <a href="https://github.com/eshanized?tab=repositories" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors">
              <Github className="w-4 h-4" />
              <span>View Projects</span>
            </a>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700/50">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-green-400" />
                Find GitHub User
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full bg-gray-700/50 rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-green-400 focus:outline-none border border-gray-600/50"
                    placeholder="Search GitHub users..."
                  />
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  {searching && (
                    <RefreshCw className="absolute right-3 top-2.5 w-5 h-5 animate-spin text-gray-400" />
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="flex-1 bg-gray-700/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none border border-gray-600/50"
                    placeholder="Enter GitHub username directly..."
                  />
                  <button
                    onClick={() => formData.username && fetchGitHubInfo(formData.username)}
                    disabled={loading || !formData.username}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 rounded-lg flex items-center gap-2 transition-all shadow-lg"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
                    Fetch
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-700/90 backdrop-blur-sm rounded-lg shadow-xl border border-gray-600/50 max-h-60 overflow-auto">
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => fetchGitHubInfo(user.login)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-600/50 flex items-center space-x-3 transition-colors"
                      >
                        <img src={user.avatar_url} alt={user.login} className="w-8 h-8 rounded-full ring-2 ring-gray-700" />
                        <span className="font-medium">{user.login}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700/50">
              <div className="flex border-b border-gray-700/50">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-green-500/10 to-blue-500/10 text-green-400'
                        : 'hover:bg-gray-700/30'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-6">
                {activeTab === 'basic' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        <User className="w-4 h-4 text-green-400" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full bg-gray-700/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none border border-gray-600/50"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-green-400" />
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-gray-700/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none border border-gray-600/50"
                        placeholder="A passionate developer..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-400" />
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-gray-700/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none border border-gray-600/50"
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-green-400" />
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full bg-gray-700/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none border border-gray-600/50"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-green-400" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-700/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none border border-gray-600/50"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'education' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-green-400" />
                        Education History
                      </label>
                      <textarea
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-gray-700/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none border border-gray-600/50"
                        placeholder="🎓 BSc in Computer Science - University Name (2018-2022)&#10;📚 Relevant Coursework: Data Structures, Algorithms, Web Development"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="showEducation"
                        checked={formData.showEducation}
                        onChange={handleChange}
                        className="rounded bg-gray-700 border-gray-600 text-green-400 focus:ring-green-400"
                      />
                      <label className="text-sm">Show education section in README</label>
                    </div>
                  </div>
                )}

                {activeTab === 'professional' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-green-400" />
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full bg-gray-700/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none border border-gray-600/50"
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-green-400" />
                        Skills
                      </label>
                      <textarea
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-gray-700/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none border border-gray-600/50"
                        placeholder="React, Node.js, TypeScript, Python..."
                      />
                      <p className="text-sm text-gray-400 mt-1">Separate skills with commas</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        <Linkedin className="w-4 h-4 text-green-400" />
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="w-full bg-gray-700/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none border border-gray-600/50"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        <Twitter className="w-4 h-4 text-green-400" />
                        Twitter
                      </label>
                      <input
                        type="text"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleChange}
                        className="w-full bg-gray-700/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none border border-gray-600/50"
                        placeholder="username (without @)"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="showSkills"
                        checked={formData.showSkills}
                        onChange={handleChange}
                        className="rounded bg-gray-700 border-gray-600 text-green-400 focus:ring-green-400"
                      />
                      <label className="text-sm">Show skills section in README</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="showSocial"
                        checked={formData.showSocial}
                        onChange={handleChange}
                        className="rounded bg-gray-700 border-gray-600 text-green-400 focus:ring-green-400"
                      />
                      <label className="text-sm">Show social links in README</label>
                    </div>
                  </div>
                )}

                {activeTab === 'interests' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-green-400" />
                        Interests & Hobbies
                      </label>
                      <textarea
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-gray-700/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none border border-gray-600/50"
                        placeholder="Open Source, Machine Learning, Game Development..."
                      />
                      <p className="text-sm text-gray-400 mt-1">Add your interests and hobbies, one per line</p>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        <Palette className="w-4 h-4 text-green-400" />
                        Theme
                      </label>
                      <select
                        name="theme"
                        value={formData.theme}
                        onChange={handleChange}
                        className="w-full bg-gray-700/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none border border-gray-600/50"
                      >
                        {themes.map(theme => (
                          <option key={theme.id} value={theme.id}>
                            {theme.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="showStats"
                          checked={formData.showStats}
                          onChange={handleChange}
                          className="rounded bg-gray-700 border-gray-600 text-green-400 focus:ring-green-400"
                        />
                        <label className="text-sm flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Show GitHub stats
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="showLanguages"
                          checked={formData.showLanguages}
                          onChange={handleChange}
                          className="rounded bg-gray-700 border-gray-600 text-green-400 focus:ring-green-400"
                        />
                        <label className="text-sm flex items-center gap-2">
                          <Code2 className="w-4 h-4" />
                          Show most used languages
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="showStreak"
                          checked={formData.showStreak}
                          onChange={handleChange}
                          className="rounded bg-gray-700 border-gray-600 text-green-400 focus:ring-green-400"
                        />
                        <label className="text-sm flex items-center gap-2">
                          <GitFork className="w-4 h-4" />
                          Show GitHub streak stats
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="showActivityGraph"
                          checked={formData.showActivityGraph}
                          onChange={handleChange}
                          className="rounded bg-gray-700 border-gray-600 text-green-400 focus:ring-green-400"
                        />
                        <label className="text-sm flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Show activity graph
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="showWakaTime"
                          checked={formData.showWakaTime}
                          onChange={handleChange}
                          className="rounded bg-gray-700 border-gray-600 text-green-400 focus:ring-green-400"
                        />
                        <label className="text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Show WakaTime stats
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="showTrophies"
                          checked={formData.showTrophies}
                          onChange={handleChange}
                          className="rounded bg-gray-700 border-gray-600 text-green-400 focus:ring-green-400"
                        />
                        <label className="text-sm flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          Show GitHub trophies
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="showContributionCalendar"
                          checked={formData.showContributionCalendar}
                          onChange={handleChange}
                          className="rounded bg-gray-700 border-gray-600 text-green-400 focus:ring-green-400"
                        />
                        <label className="text-sm flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Show contribution calendar
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700/50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-green-400" />
                  Preview
                </h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all shadow-lg"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm overflow-auto max-h-[600px] border border-gray-700/50">
                <pre className="whitespace-pre-wrap">{generateReadme(formData)}</pre>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800/50 backdrop-blur-sm bg-gray-900/50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-green-400" />
              <span className="text-gray-400">GitHub README Generator</span>
              <span className="text-gray-500">by</span>
              <a href="https://github.com/eshanized" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors">eshanized</a>
            </div>
            <div className="flex items-center gap-6">
              <a href="https://github.com/eshanized" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2">
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a href="https://twitter.com/eshanized" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2">
                <Twitter className="w-4 h-4" />
                <span>Twitter</span>
              </a>
              <a href="https://linkedin.com/in/eshanized" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a href="https://eshanized.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Website</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;