#!/usr/bin/env node

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

console.log(`${colors.blue}🔗 Testing all links in JSON data files...${colors.reset}\n`);

/**
 * Test if a URL is accessible
 * @param {string} url - The URL to test
 * @returns {Promise<{url: string, status: number, error?: string}>}
 */
function testUrl(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'HEAD',
      timeout: 10000,
      headers: {
        'User-Agent': 'Link-Checker/1.0'
      }
    };

    const req = client.request(options, (res) => {
      resolve({
        url: url,
        status: res.statusCode
      });
    });

    req.on('error', (err) => {
      resolve({
        url: url,
        status: 0,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url: url,
        status: 0,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

/**
 * Extract all URLs from JSON data
 * @param {Object} data - JSON data object
 * @param {string} source - Source file name for logging
 * @returns {Array<{url: string, source: string, field: string}>}
 */
function extractUrls(data, source) {
  const urls = [];
  
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      Object.keys(item).forEach(key => {
        const value = item[key];
        if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
          urls.push({
            url: value,
            source: source,
            field: `${key} (item ${index + 1})`
          });
        }
      });
    });
  }
  
  return urls;
}

/**
 * Main function to test all links
 */
async function testAllLinks() {
  const dataDir = path.join(__dirname, '../public/data');
  const files = ['publications.json', 'software.json', 'datasets.json'];
  
  let allUrls = [];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  // Extract URLs from all JSON files
  for (const file of files) {
    const filePath = path.join(dataDir, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`${colors.yellow}⚠️  File not found: ${file}${colors.reset}`);
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      const urls = extractUrls(data, file);
      allUrls = allUrls.concat(urls);
    } catch (error) {
      console.log(`${colors.red}❌ Error reading ${file}: ${error.message}${colors.reset}`);
      failedTests++;
    }
  }

  if (allUrls.length === 0) {
    console.log(`${colors.yellow}⚠️  No URLs found to test${colors.reset}`);
    return;
  }

  console.log(`Found ${allUrls.length} URLs to test:\n`);

  // Test all URLs
  for (const urlInfo of allUrls) {
    totalTests++;
    console.log(`Testing: ${urlInfo.url}`);
    console.log(`Source: ${urlInfo.source} - ${urlInfo.field}`);
    
    try {
      const result = await testUrl(urlInfo.url);
      
      if (result.status >= 200 && result.status < 400) {
        console.log(`${colors.green}✅ PASS (${result.status})${colors.reset}\n`);
        passedTests++;
      } else if (result.status >= 400) {
        console.log(`${colors.red}❌ FAIL (${result.status})${colors.reset}\n`);
        failedTests++;
      } else {
        console.log(`${colors.red}❌ FAIL (${result.error || 'Unknown error'})${colors.reset}\n`);
        failedTests++;
      }
    } catch (error) {
      console.log(`${colors.red}❌ FAIL (${error.message})${colors.reset}\n`);
      failedTests++;
    }
  }

  // Summary
  console.log('='.repeat(50));
  console.log(`${colors.blue}📊 Link Test Summary${colors.reset}`);
  console.log(`Total URLs tested: ${totalTests}`);
  console.log(`${colors.green}✅ Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failedTests}${colors.reset}`);

  if (failedTests > 0) {
    console.log(`\n${colors.red}🚨 Some links are broken! Please fix them before deploying.${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}🎉 All links are working correctly!${colors.reset}`);
  }
}

// Run the tests
testAllLinks().catch(error => {
  console.error(`${colors.red}❌ Script error: ${error.message}${colors.reset}`);
  process.exit(1);
});