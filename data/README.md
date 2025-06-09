# Content Management

This directory contains JSON files that control the content displayed on your website. Simply edit these files and redeploy to update your website content.

## Files

### `publications.json`
Controls the Publications section. Each publication should have:
- `id`: Unique identifier (number)
- `title`: Publication title
- `authors`: Author names (string)
- `year`: Publication year
- `journal`: Journal/venue name
- `abstract`: Brief description
- `doi`: DOI identifier (optional)
- `link`: Link to full paper (optional)
- `type`: Type of publication (e.g., "Journal Article", "Book Chapter")

### `software.json`
Controls the Software section. Each software project should have:
- `id`: Unique identifier (number)
- `name`: Project name
- `description`: Project description
- `language`: Programming language(s)
- `github`: GitHub repository URL
- `status`: "Active" or "Maintenance"
- `downloads`: Download count (optional)
- `stars`: GitHub stars (optional)
- `features`: Array of key features (optional)

### `datasets.json`
Controls the Data section. Each dataset should have:
- `id`: Unique identifier (number)
- `name`: Dataset name
- `description`: Dataset description
- `size`: File size
- `format`: Available formats (e.g., "CSV, JSON")
- `observations`: Number of observations
- `variables`: Number of variables (optional)
- `lastUpdated`: Last update date
- `downloadLink`: Download URL
- `documentation`: Documentation URL
- `type`: Dataset type/category

## How to Update

1. Edit the relevant JSON file
2. Add new items or modify existing ones
3. Ensure each item has a unique `id`
4. Save the file
5. Redeploy your website

The changes will automatically appear on your website after deployment.

## Example: Adding a New Publication

```json
{
  "id": 4,
  "title": "Your New Paper Title",
  "authors": "Andre Assumpcao, Co-Author Name",
  "year": "2024",
  "journal": "Journal Name",
  "abstract": "Brief description of your paper...",
  "doi": "10.1234/journal.2024.001",
  "link": "https://link-to-paper.com",
  "type": "Journal Article"
}
```

Simply add this object to the array in `publications.json`.