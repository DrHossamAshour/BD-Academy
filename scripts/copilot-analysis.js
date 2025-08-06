#!/usr/bin/env node

/**
 * BigDentist Application - GitHub Copilot Analysis Script
 * 
 * This script performs a comprehensive analysis of the entire BigDentist application
 * to identify issues, optimize performance, and ensure production readiness.
 * 
 * Run with: node scripts/copilot-analysis.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

class BigDentistAnalyzer {
  constructor() {
    this.projectRoot = process.cwd();
    this.analysisResults = {
      startTime: new Date(),
      issues: [],
      warnings: [],
      recommendations: [],
      performance: {},
      security: {},
      codeQuality: {},
      dependencies: {},
      database: {},
      authentication: {},
      api: {},
      components: {},
      pages: {},
      utils: {},
      types: {},
      config: {}
    };
  }

  log(message, color = 'white') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logSection(title) {
    console.log(`\n${colors.cyan}${colors.bright}=== ${title} ===${colors.reset}`);
  }

  logIssue(issue, severity = 'warning') {
    const color = severity === 'error' ? 'red' : 'yellow';
    this.log(`⚠️  ${issue}`, color);
    this.analysisResults.issues.push({ issue, severity, timestamp: new Date() });
  }

  logSuccess(message) {
    this.log(`✅ ${message}`, 'green');
  }

  logInfo(message) {
    this.log(`ℹ️  ${message}`, 'blue');
  }

  async analyzeProjectStructure() {
    this.logSection('PROJECT STRUCTURE ANALYSIS');
    
    const requiredDirs = [
      'app', 'components', 'lib', 'utils', 'types', 'public', 'scripts'
    ];

    for (const dir of requiredDirs) {
      if (fs.existsSync(path.join(this.projectRoot, dir))) {
        this.logSuccess(`Directory exists: ${dir}`);
      } else {
        this.logIssue(`Missing required directory: ${dir}`, 'error');
      }
    }

    // Check for essential files
    const essentialFiles = [
      'package.json', 'next.config.js', 'tailwind.config.js', 
      'tsconfig.json', 'README.md', '.env.example'
    ];

    for (const file of essentialFiles) {
      if (fs.existsSync(path.join(this.projectRoot, file))) {
        this.logSuccess(`Essential file exists: ${file}`);
      } else {
        this.logIssue(`Missing essential file: ${file}`, 'error');
      }
    }
  }

  async analyzeDependencies() {
    this.logSection('DEPENDENCIES ANALYSIS');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // Check for critical dependencies
      const criticalDeps = {
        'next': '14.0.0',
        'react': '^18',
        'react-dom': '^18',
        'mongodb': '^6.18.0',
        'mongoose': '^8.17.0',
        'next-auth': '^4.24.11'
      };

      for (const [dep, expectedVersion] of Object.entries(criticalDeps)) {
        if (packageJson.dependencies[dep]) {
          this.logSuccess(`Critical dependency found: ${dep}@${packageJson.dependencies[dep]}`);
        } else {
          this.logIssue(`Missing critical dependency: ${dep}`, 'error');
        }
      }

      // Check for security vulnerabilities
      try {
        const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
        const audit = JSON.parse(auditResult);
        
        if (audit.metadata.vulnerabilities.total > 0) {
          this.logIssue(`Found ${audit.metadata.vulnerabilities.total} security vulnerabilities`, 'error');
          this.analysisResults.security.vulnerabilities = audit.metadata.vulnerabilities;
        } else {
          this.logSuccess('No security vulnerabilities found');
        }
      } catch (error) {
        this.logInfo('npm audit not available or failed');
      }

    } catch (error) {
      this.logIssue(`Failed to analyze dependencies: ${error.message}`, 'error');
    }
  }

  async analyzeDatabaseConfiguration() {
    this.logSection('DATABASE CONFIGURATION ANALYSIS');
    
    // Check database connection file
    const dbFile = path.join(this.projectRoot, 'lib', 'db.ts');
    if (fs.existsSync(dbFile)) {
      this.logSuccess('Database connection file exists');
      
      const dbContent = fs.readFileSync(dbFile, 'utf8');
      
      // Check for connection pooling
      if (dbContent.includes('maxPoolSize') || dbContent.includes('poolSize')) {
        this.logSuccess('Connection pooling configured');
      } else {
        this.logIssue('Connection pooling not configured - may cause performance issues');
      }

      // Check for error handling
      if (dbContent.includes('try') && dbContent.includes('catch')) {
        this.logSuccess('Database error handling implemented');
      } else {
        this.logIssue('Database error handling may be insufficient');
      }
    } else {
      this.logIssue('Database connection file missing', 'error');
    }

    // Check environment variables
    const envExample = path.join(this.projectRoot, '.env.example');
    if (fs.existsSync(envExample)) {
      const envContent = fs.readFileSync(envExample, 'utf8');
      
      if (envContent.includes('MONGODB_URI')) {
        this.logSuccess('MongoDB URI environment variable configured');
      } else {
        this.logIssue('MongoDB URI environment variable missing', 'error');
      }

      if (envContent.includes('NEXTAUTH_SECRET')) {
        this.logSuccess('NextAuth secret configured');
      } else {
        this.logIssue('NextAuth secret missing', 'error');
      }
    }
  }

  async analyzeAuthentication() {
    this.logSection('AUTHENTICATION ANALYSIS');
    
    const authFile = path.join(this.projectRoot, 'app', 'api', 'auth', '[...nextauth]', 'route.ts');
    if (fs.existsSync(authFile)) {
      this.logSuccess('NextAuth configuration exists');
      
      const authContent = fs.readFileSync(authFile, 'utf8');
      
      // Check for proper providers
      if (authContent.includes('CredentialsProvider')) {
        this.logSuccess('Credentials provider configured');
      } else {
        this.logIssue('Credentials provider not found');
      }

      // Check for session configuration
      if (authContent.includes('session') && authContent.includes('jwt')) {
        this.logSuccess('Session and JWT configuration found');
      } else {
        this.logIssue('Session/JWT configuration may be incomplete');
      }

      // Check for callbacks
      if (authContent.includes('callbacks')) {
        this.logSuccess('Auth callbacks configured');
      } else {
        this.logIssue('Auth callbacks not configured');
      }
    } else {
      this.logIssue('NextAuth configuration missing', 'error');
    }
  }

  async analyzeAPIEndpoints() {
    this.logSection('API ENDPOINTS ANALYSIS');
    
    const apiDir = path.join(this.projectRoot, 'app', 'api');
    if (fs.existsSync(apiDir)) {
      const apiEndpoints = this.scanDirectory(apiDir, '.ts');
      
      for (const endpoint of apiEndpoints) {
        this.logInfo(`Analyzing API endpoint: ${endpoint}`);
        
        try {
          const content = fs.readFileSync(endpoint, 'utf8');
          
          // Check for proper HTTP methods
          if (content.includes('GET') || content.includes('POST') || 
              content.includes('PUT') || content.includes('DELETE')) {
            this.logSuccess(`HTTP methods properly configured in ${path.basename(endpoint)}`);
          } else {
            this.logIssue(`HTTP methods not properly configured in ${path.basename(endpoint)}`);
          }

          // Check for error handling
          if (content.includes('try') && content.includes('catch')) {
            this.logSuccess(`Error handling implemented in ${path.basename(endpoint)}`);
          } else {
            this.logIssue(`Error handling missing in ${path.basename(endpoint)}`);
          }

          // Check for input validation
          if (content.includes('zod') || content.includes('validation')) {
            this.logSuccess(`Input validation implemented in ${path.basename(endpoint)}`);
          } else {
            this.logIssue(`Input validation missing in ${path.basename(endpoint)}`);
          }

        } catch (error) {
          this.logIssue(`Failed to analyze ${endpoint}: ${error.message}`);
        }
      }
    } else {
      this.logIssue('API directory missing', 'error');
    }
  }

  async analyzeComponents() {
    this.logSection('COMPONENTS ANALYSIS');
    
    const componentsDir = path.join(this.projectRoot, 'components');
    if (fs.existsSync(componentsDir)) {
      const components = this.scanDirectory(componentsDir, '.tsx');
      
      for (const component of components) {
        this.logInfo(`Analyzing component: ${path.basename(component)}`);
        
        try {
          const content = fs.readFileSync(component, 'utf8');
          
          // Check for TypeScript types
          if (content.includes('interface') || content.includes('type')) {
            this.logSuccess(`TypeScript types defined in ${path.basename(component)}`);
          } else {
            this.logIssue(`TypeScript types missing in ${path.basename(component)}`);
          }

          // Check for proper imports
          if (content.includes('import') && content.includes('from')) {
            this.logSuccess(`Proper imports in ${path.basename(component)}`);
          } else {
            this.logIssue(`Import issues in ${path.basename(component)}`);
          }

          // Check for accessibility
          if (content.includes('aria-') || content.includes('role=')) {
            this.logSuccess(`Accessibility attributes in ${path.basename(component)}`);
          } else {
            this.logIssue(`Accessibility attributes missing in ${path.basename(component)}`);
          }

        } catch (error) {
          this.logIssue(`Failed to analyze ${component}: ${error.message}`);
        }
      }
    } else {
      this.logIssue('Components directory missing', 'error');
    }
  }

  async analyzePages() {
    this.logSection('PAGES ANALYSIS');
    
    const appDir = path.join(this.projectRoot, 'app');
    if (fs.existsSync(appDir)) {
      const pages = this.scanDirectory(appDir, '.tsx');
      
      for (const page of pages) {
        this.logInfo(`Analyzing page: ${path.basename(page)}`);
        
        try {
          const content = fs.readFileSync(page, 'utf8');
          
          // Check for metadata
          if (content.includes('metadata') || content.includes('generateMetadata')) {
            this.logSuccess(`Metadata configured in ${path.basename(page)}`);
          } else {
            this.logIssue(`Metadata missing in ${path.basename(page)}`);
          }

          // Check for error boundaries
          if (content.includes('error') || content.includes('ErrorBoundary')) {
            this.logSuccess(`Error handling in ${path.basename(page)}`);
          } else {
            this.logIssue(`Error handling missing in ${path.basename(page)}`);
          }

          // Check for loading states
          if (content.includes('loading') || content.includes('Loading')) {
            this.logSuccess(`Loading states in ${path.basename(page)}`);
          } else {
            this.logIssue(`Loading states missing in ${path.basename(page)}`);
          }

        } catch (error) {
          this.logIssue(`Failed to analyze ${page}: ${error.message}`);
        }
      }
    } else {
      this.logIssue('App directory missing', 'error');
    }
  }

  async analyzeConfiguration() {
    this.logSection('CONFIGURATION ANALYSIS');
    
    // Check Next.js config
    const nextConfig = path.join(this.projectRoot, 'next.config.js');
    if (fs.existsSync(nextConfig)) {
      this.logSuccess('Next.js configuration exists');
      
      const content = fs.readFileSync(nextConfig, 'utf8');
      
      // Check for security headers
      if (content.includes('headers') || content.includes('securityHeaders')) {
        this.logSuccess('Security headers configured');
      } else {
        this.logIssue('Security headers not configured');
      }

      // Check for image optimization
      if (content.includes('images') || content.includes('imageOptimization')) {
        this.logSuccess('Image optimization configured');
      } else {
        this.logIssue('Image optimization not configured');
      }
    } else {
      this.logIssue('Next.js configuration missing', 'error');
    }

    // Check TypeScript config
    const tsConfig = path.join(this.projectRoot, 'tsconfig.json');
    if (fs.existsSync(tsConfig)) {
      this.logSuccess('TypeScript configuration exists');
      
      const content = JSON.parse(fs.readFileSync(tsConfig, 'utf8'));
      
      if (content.compilerOptions?.strict) {
        this.logSuccess('TypeScript strict mode enabled');
      } else {
        this.logIssue('TypeScript strict mode not enabled');
      }
    } else {
      this.logIssue('TypeScript configuration missing', 'error');
    }

    // Check Tailwind config
    const tailwindConfig = path.join(this.projectRoot, 'tailwind.config.js');
    if (fs.existsSync(tailwindConfig)) {
      this.logSuccess('Tailwind CSS configuration exists');
    } else {
      this.logIssue('Tailwind CSS configuration missing', 'error');
    }
  }

  async analyzePerformance() {
    this.logSection('PERFORMANCE ANALYSIS');
    
    // Check for lazy loading
    const components = this.scanDirectory(path.join(this.projectRoot, 'components'), '.tsx');
    let lazyLoadedCount = 0;
    
    for (const component of components) {
      const content = fs.readFileSync(component, 'utf8');
      if (content.includes('lazy') || content.includes('dynamic')) {
        lazyLoadedCount++;
      }
    }
    
    if (lazyLoadedCount > 0) {
      this.logSuccess(`${lazyLoadedCount} components use lazy loading`);
    } else {
      this.logIssue('No lazy loading implemented');
    }

    // Check for image optimization
    const pages = this.scanDirectory(path.join(this.projectRoot, 'app'), '.tsx');
    let optimizedImages = 0;
    
    for (const page of pages) {
      const content = fs.readFileSync(page, 'utf8');
      if (content.includes('next/image') || content.includes('Image')) {
        optimizedImages++;
      }
    }
    
    if (optimizedImages > 0) {
      this.logSuccess(`${optimizedImages} pages use optimized images`);
    } else {
      this.logIssue('Image optimization not implemented');
    }
  }

  async analyzeSecurity() {
    this.logSection('SECURITY ANALYSIS');
    
    // Check for environment variables
    const envExample = path.join(this.projectRoot, '.env.example');
    if (fs.existsSync(envExample)) {
      const content = fs.readFileSync(envExample, 'utf8');
      
      if (content.includes('NEXTAUTH_SECRET')) {
        this.logSuccess('NextAuth secret configured');
      } else {
        this.logIssue('NextAuth secret not configured', 'error');
      }

      if (content.includes('NEXTAUTH_URL')) {
        this.logSuccess('NextAuth URL configured');
      } else {
        this.logIssue('NextAuth URL not configured', 'error');
      }
    }

    // Check for CORS configuration
    const apiFiles = this.scanDirectory(path.join(this.projectRoot, 'app', 'api'), '.ts');
    let corsConfigured = false;
    
    for (const file of apiFiles) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('cors') || content.includes('CORS')) {
        corsConfigured = true;
        break;
      }
    }
    
    if (corsConfigured) {
      this.logSuccess('CORS configuration found');
    } else {
      this.logIssue('CORS configuration missing');
    }

    // Check for input sanitization
    let sanitizationFound = false;
    for (const file of apiFiles) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('sanitize') || content.includes('escape') || content.includes('zod')) {
        sanitizationFound = true;
        break;
      }
    }
    
    if (sanitizationFound) {
      this.logSuccess('Input sanitization implemented');
    } else {
      this.logIssue('Input sanitization missing');
    }
  }

  scanDirectory(dir, extension) {
    const files = [];
    
    function scan(currentDir) {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scan(fullPath);
        } else if (item.endsWith(extension)) {
          files.push(fullPath);
        }
      }
    }
    
    if (fs.existsSync(dir)) {
      scan(dir);
    }
    
    return files;
  }

  async generateReport() {
    this.logSection('GENERATING ANALYSIS REPORT');
    
    const report = {
      timestamp: new Date().toISOString(),
      project: 'BigDentist',
      version: '1.0.0',
      analysis: this.analysisResults,
      summary: {
        totalIssues: this.analysisResults.issues.length,
        errors: this.analysisResults.issues.filter(i => i.severity === 'error').length,
        warnings: this.analysisResults.issues.filter(i => i.severity === 'warning').length,
        recommendations: this.analysisResults.recommendations.length
      }
    };

    // Save report to file
    const reportPath = path.join(this.projectRoot, 'analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.logSuccess(`Analysis report saved to: ${reportPath}`);
    
    // Generate markdown summary
    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = path.join(this.projectRoot, 'ANALYSIS_SUMMARY.md');
    fs.writeFileSync(markdownPath, markdownReport);
    
    this.logSuccess(`Markdown summary saved to: ${markdownPath}`);
    
    return report;
  }

  generateMarkdownReport(report) {
    return `# BigDentist Application Analysis Report

**Generated:** ${report.timestamp}  
**Project:** ${report.project}  
**Version:** ${report.version}

## 📊 Summary

- **Total Issues:** ${report.summary.totalIssues}
- **Errors:** ${report.summary.errors}
- **Warnings:** ${report.summary.warnings}
- **Recommendations:** ${report.summary.recommendations}

## 🚨 Critical Issues

${report.analysis.issues
  .filter(issue => issue.severity === 'error')
  .map(issue => `- ❌ ${issue.issue}`)
  .join('\n')}

## ⚠️ Warnings

${report.analysis.issues
  .filter(issue => issue.severity === 'warning')
  .map(issue => `- ⚠️ ${issue.issue}`)
  .join('\n')}

## 🔧 Recommendations

${report.analysis.recommendations.map(rec => `- 💡 ${rec}`).join('\n')}

## 📋 Action Items

### High Priority
1. Fix all critical errors
2. Configure MongoDB Atlas IP whitelist
3. Set up proper environment variables
4. Implement security headers

### Medium Priority
1. Add input validation to all API endpoints
2. Implement proper error handling
3. Add loading states to pages
4. Configure CORS properly

### Low Priority
1. Add accessibility attributes
2. Implement lazy loading
3. Add performance monitoring
4. Create comprehensive tests

## 🎯 Next Steps

1. **Immediate:** Fix MongoDB connection issues
2. **Short-term:** Implement security measures
3. **Medium-term:** Add comprehensive testing
4. **Long-term:** Performance optimization

---
*Report generated by BigDentist Analyzer*
`;
  }

  async runFullAnalysis() {
    this.log(`${colors.bright}${colors.cyan}🚀 Starting BigDentist Application Analysis${colors.reset}\n`);
    
    try {
      await this.analyzeProjectStructure();
      await this.analyzeDependencies();
      await this.analyzeDatabaseConfiguration();
      await this.analyzeAuthentication();
      await this.analyzeAPIEndpoints();
      await this.analyzeComponents();
      await this.analyzePages();
      await this.analyzeConfiguration();
      await this.analyzePerformance();
      await this.analyzeSecurity();
      
      const report = await this.generateReport();
      
      this.logSection('ANALYSIS COMPLETE');
      this.log(`✅ Analysis completed successfully!`, 'green');
      this.log(`📊 Found ${report.summary.totalIssues} issues`, 'yellow');
      this.log(`📄 Reports generated: analysis-report.json and ANALYSIS_SUMMARY.md`, 'blue');
      
      if (report.summary.errors > 0) {
        this.log(`🚨 ${report.summary.errors} critical issues need immediate attention`, 'red');
      }
      
      return report;
      
    } catch (error) {
      this.log(`❌ Analysis failed: ${error.message}`, 'red');
      throw error;
    }
  }
}

// Run the analysis
async function main() {
  const analyzer = new BigDentistAnalyzer();
  
  try {
    await analyzer.runFullAnalysis();
  } catch (error) {
    console.error('Analysis failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = BigDentistAnalyzer; 