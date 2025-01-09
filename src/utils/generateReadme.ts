import { type } from "os";

interface FormData {
  username: string;
  fullName: string;
  bio: string;
  location: string;
  company: string;
  website: string;
  email: string;
  twitter: string;
  linkedin: string;
  skills: string;
  education: string;
  interests: string;
  theme: string;
  showStats: boolean;
  showLanguages: boolean;
  showStreak: boolean;
  showActivityGraph: boolean;
  showWakaTime: boolean;
  showTrophies: boolean;
  showContributionCalendar: boolean;
  showSocial: boolean;
  showSkills: boolean;
  showEducation: boolean;
  languages: string[];
  githubJoinDate: string;
  totalContributions: string;
  totalRepositories: string;
  followers: string;
  following: string;
}

function generateNeofetch(data: FormData): string {
  const username = data.username || 'username';
  const fullName = data.fullName || 'Full Name';
  const location = data.location || 'Location';
  const company = data.company || 'Company';
  
  const pythonArt = `
          .?77777777777777$.            
          777..777777777777$+           
         .77    7777777777$$$           
         .777 .7777777777$$$$           
         .7777777777777$$$$$$           
         ..........:77$$$$$$$           
  .77777777777777777$$$$$$$$$.=======.  
 777777777777777777$$$$$$$$$$.========  
7777777777777777$$$$$$$$$$$$$.========= 
77777777777777$$$$$$$$$$$$$$$.========= 
777777777777$$$$$$$$$$$$$$$$ :========+.
77777777777$$$$$$$$$$$$$$+..=========++~
777777777$$..~=====================+++++
77777777$~.~~~~=~=================+++++.
777777$$$.~~~===================+++++++.
77777$$$$.~~==================++++++++: 
 7$$$$$$$.==================++++++++++. 
 .,$$$$$$.================++++++++++~.  
         .=========~.........           
         .=============++++++           
         .===========+++..+++           
         .==========+++.  .++           
          ,=======++++++,,++,           
          ..=====+++++++++=.            
                ..~+=...     
    `;

  const rightPart = [
    `${fullName}`,
    `----------------`,
    `🐍 Language: Python`,
    `⏱️ Runtime: ${new Date().getFullYear() - 2020}y`,
    `🔧 Version: 3.${new Date().getFullYear() - 2015}.0`,
    `----------------`,
    `👤 User: ${username}`,
    `📍 Location: ${location}`,
    `🏢 Company: ${company}`,
    `📅 GitHub: ${data.githubJoinDate || 'N/A'}`,
    `📊 Contributions: ${data.totalContributions || 'N/A'}`,
    `📚 Repositories: ${data.totalRepositories || 'N/A'}`,
    `👥 Followers: ${data.followers || 'N/A'}`,
    `👣 Following: ${data.following || 'N/A'}`,
    data.bio && `📝 Bio: ${data.bio}`,
    data.email && `📧 Email: ${data.email}`,
    data.website && `🌐 Website: ${data.website}`,
    data.twitter && `🐦 Twitter: @${data.twitter}`,
    data.linkedin && `💼 LinkedIn: ${data.linkedin}`,
    data.interests && `🌟 Interests: ${data.interests}`
  ].filter(Boolean);

  const lines = pythonArt.split('\n');
  const maxLeftWidth = Math.max(...lines.map(line => line.length));
  
  return lines.map((line, i) => {
    const padding = ' '.repeat(maxLeftWidth - line.length + 4);
    return `${line}${padding}${rightPart[i] || ''}`;
  }).join('\n');
}

export function generateReadme(data: FormData): string {
  const sections: string[] = [];

  // Top Wave Banner
  sections.push(`<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=${encodeURIComponent(`Hi 👋, I'm ${data.fullName || data.username}`)}&fontSize=50&animation=fadeIn&fontAlignY=30&desc=${encodeURIComponent('A passionate developer from ' + (data.location || 'Earth'))}&descAlignY=50" width="100%" />

  <img src="https://raw.githubusercontent.com/platane/snk/output/github-contribution-grid-snake.svg" alt="Snake animation" />
</div>`);

  // Terminal Style Info
  sections.push('\n```bash\n' + generateNeofetch(data) + '\n```\n');

  // About Me Section
  const aboutPoints: string[] = [];
  if (data.company) aboutPoints.push(`🏢 I'm currently working at **${data.company}**`);
  if (data.location) aboutPoints.push(`📍 Based in **${data.location}**`);
  if (data.website) aboutPoints.push(`🌐 Visit my portfolio at [${data.website}](${data.website})`);
  if (data.email) aboutPoints.push(`📫 Contact me at **${data.email}**`);
  
  if (aboutPoints.length > 0) {
    sections.push('\n### About Me\n');
    sections.push(aboutPoints.join('\n\n'));
  }

  // Skills Section
  if (data.showSkills && data.skills) {
    sections.push('\n### 💻 Tech Stack\n');
    const skills = data.skills.split(',').map(skill => skill.trim());
    sections.push(skills.map(skill => `![${skill}](https://img.shields.io/badge/${skill}-333333?style=flat&logo=${skill.toLowerCase()})`).join(' '));
  }

  // Education Section
  if (data.showEducation && data.education) {
    sections.push('\n### 🎓 Education\n');
    sections.push(data.education);
  }

  // Interests Section
  if (data.interests) {
    sections.push('\n### 🌟 Interests\n');
    sections.push(data.interests);
  }

  // Social Links
  if (data.showSocial) {
    const socials: string[] = [];
    if (data.github) socials.push(`[<img src="https://img.shields.io/badge/GitHub-%2312100E.svg?&style=for-the-badge&logo=Github&logoColor=white" />](https://github.com/${data.username})`);
    if (data.twitter) socials.push(`[<img src="https://img.shields.io/badge/twitter-%231DA1F2.svg?&style=for-the-badge&logo=twitter&logoColor=white" />](https://twitter.com/${data.twitter})`);
    if (data.linkedin) socials.push(`[<img src="https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" />](${data.linkedin})`);
    
    if (socials.length > 0) {
      sections.push('\n### 🌐 Connect with me\n');
      sections.push(socials.join(' '));
    }
  }

  // GitHub Stats Section
  if (data.showStats) {
    sections.push('\n### 📊 GitHub Stats\n');
    sections.push('<div align="center">\n');
    
    sections.push(`<img src="https://github-readme-stats.vercel.app/api?username=${data.username}&show_icons=true&theme=${data.theme}" alt="GitHub Stats" />\n`);
    
    if (data.showStreak) {
      sections.push(`<img src="https://github-readme-streak-stats.herokuapp.com/?user=${data.username}&theme=${data.theme}" alt="GitHub Streak" />\n`);
    }
    
    if (data.showLanguages) {
      sections.push(`<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${data.username}&layout=compact&theme=${data.theme}" alt="Top Languages" />\n`);
    }
    
    if (data.showActivityGraph) {
      sections.push(`<img src="https://github-readme-activity-graph.vercel.app/graph?username=${data.username}&theme=${data.theme === 'github-dark' ? 'github-dark' : 'react-dark'}" alt="Activity Graph" />\n`);
    }
    
    if (data.showWakaTime) {
      sections.push(`<img src="https://github-readme-stats.vercel.app/api/wakatime?username=${data.username}&theme=${data.theme}" alt="WakaTime Stats" />\n`);
    }
    
    if (data.showTrophies) {
      sections.push(`<img src="https://github-profile-trophy.vercel.app/?username=${data.username}&theme=${data.theme === 'github-dark' ? 'darkhub' : 'onedark'}&column=4&margin-w=15&margin-h=15" alt="Trophies" />\n`);
    }

    sections.push('</div>\n');

    if (data.showWakaTime) {
      sections.push('> Note: To track coding time statistics, connect your GitHub account with [WakaTime](https://wakatime.com).');
    }
  }

  // Profile Views Counter
  sections.push(`\n<img src="https://komarev.com/ghpvc/?username=${data.username}&label=Profile%20Views&color=0e75b6&style=flat" alt="Profile Views" />`);

  // Bottom Wave Banner
  sections.push(`\n<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=150&section=footer" width="100%" />`);

  return sections.join('\n');
}