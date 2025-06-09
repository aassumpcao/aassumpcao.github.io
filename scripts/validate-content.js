#!/usr/bin/env node

/**
 * Content Validation Script
 * 
 * This script validates the JSON content files to ensure they have the correct structure
 * and required fields before deployment.
 * 
 * Usage: node scripts/validate-content.js
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'public', 'data');

// Validation schemas
const schemas = {
  publications: {
    required: ['id', 'title', 'authors', 'year', 'journal', 'abstract'],
    optional: ['doi', 'link', 'type']
  },
  software: {
    required: ['id', 'name', 'description', 'language', 'github'],
    optional: ['status', 'downloads', 'stars', 'features']
  },
  datasets: {
    required: ['id', 'name', 'description', 'size', 'observations'],
    optional: ['format', 'variables', 'lastUpdated', 'downloadLink', 'documentation', 'type']
  }
};

function validateFile(filename, schema) {
  const filePath = path.join(dataDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filename}`);
    return false;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    if (!Array.isArray(data)) {
      console.error(`❌ ${filename}: Root element must be an array`);
      return false;
    }

    let isValid = true;
    const ids = new Set();

    data.forEach((item, index) => {
      // Check for duplicate IDs
      if (ids.has(item.id)) {
        console.error(`❌ ${filename}: Duplicate ID ${item.id} found at index ${index}`);
        isValid = false;
      }
      ids.add(item.id);

      // Check required fields
      schema.required.forEach(field => {
        if (!(field in item) || item[field] === null || item[field] === undefined || item[field] === '') {
          console.error(`❌ ${filename}: Missing required field '${field}' at index ${index}`);
          isValid = false;
        }
      });

      // Check for unknown fields
      Object.keys(item).forEach(field => {
        if (!schema.required.includes(field) && !schema.optional.includes(field)) {
          console.warn(`⚠️  ${filename}: Unknown field '${field}' at index ${index}`);
        }
      });
    });

    if (isValid) {
      console.log(`✅ ${filename}: Valid (${data.length} items)`);
    }

    return isValid;
  } catch (error) {
    console.error(`❌ ${filename}: JSON parse error - ${error.message}`);
    return false;
  }
}

function main() {
  console.log('🔍 Validating content files...\n');

  let allValid = true;

  Object.entries(schemas).forEach(([name, schema]) => {
    const filename = `${name}.json`;
    const isValid = validateFile(filename, schema);
    allValid = allValid && isValid;
  });

  console.log('\n' + '='.repeat(50));
  
  if (allValid) {
    console.log('🎉 All content files are valid!');
    process.exit(0);
  } else {
    console.log('💥 Some content files have errors. Please fix them before deploying.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateFile, schemas };