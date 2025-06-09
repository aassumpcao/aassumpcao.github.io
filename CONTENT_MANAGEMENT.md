# Content Management System

Your website now uses a JSON-based content management system that makes it easy to add and update publications, software projects, and datasets without touching the code.

## 📁 File Structure

```
public/
├── data/
│   ├── publications.json    # Your research publications
│   ├── software.json        # Your software projects  
│   ├── datasets.json        # Your research datasets
│   └── README.md           # Detailed field documentation
├── assets/
│   └── images/
│       ├── background.jpg   # Website background image
│       └── headshot-2022.jpg # Your profile photo
scripts/
└── validate-content.js     # Content validation tool
```

## 🚀 How to Add New Content

### Adding a Publication

1. Open `public/data/publications.json`
2. Add a new object to the array:

```json
{
  "id": 4,
  "title": "Your New Publication Title",
  "authors": "Andre Assumpcao, Co-Author Name",
  "year": "2024",
  "journal": "Journal Name",
  "abstract": "Brief description of your research...",
  "doi": "10.1234/journal.2024.001",
  "link": "https://link-to-paper.com",
  "type": "Journal Article"
}
```

### Adding Software

1. Open `public/data/software.json`
2. Add a new object to the array:

```json
{
  "id": 4,
  "name": "Your New Tool",
  "description": "What your software does...",
  "language": "Python",
  "github": "https://github.com/yourusername/repo",
  "status": "Active",
  "downloads": "1.2K",
  "stars": "67"
}
```

### Adding a Dataset

1. Open `public/data/datasets.json`
2. Add a new object to the array:

```json
{
  "id": 4,
  "name": "Your New Dataset",
  "description": "What data this contains...",
  "size": "1.5 GB",
  "format": "CSV, JSON",
  "observations": "100K",
  "variables": "45",
  "lastUpdated": "2024-06-15",
  "downloadLink": "https://example.com/download",
  "documentation": "https://example.com/docs",
  "type": "Survey Data"
}
```

## ✅ Validation

Before deploying, always validate your content:

```bash
# Validate all JSON files
npm run validate-content

# Build with validation (recommended)
npm run build-with-validation
```

The validator checks for:
- ✅ Valid JSON syntax
- ✅ Required fields present
- ✅ Unique IDs
- ⚠️  Unknown fields (warnings)

## 🎨 Background Image

Your background image is automatically loaded from `public/assets/images/background.jpg`. To change it:

1. Replace the file with your new background image
2. Keep the same filename, or update the path in the code
3. Recommended: High resolution (1920x1080+) for best quality

## 🔄 Deployment Workflow

1. **Edit content** - Update the JSON files
2. **Validate** - Run `npm run validate-content`  
3. **Test locally** - Run `npm run dev` to preview
4. **Build** - Run `npm run build-with-validation`
5. **Deploy** - Upload the `out/` folder to your hosting

## 💡 Tips

- **Unique IDs**: Always use unique `id` numbers for new items
- **Backup**: Keep backups of your JSON files
- **Validation**: Always validate before deploying
- **Testing**: Test locally before going live
- **Images**: Optimize images for web (compress file sizes)

## 🆘 Troubleshooting

**Validation fails?**
- Check JSON syntax (commas, brackets, quotes)
- Ensure all required fields are present
- Verify ID uniqueness

**Content not updating?**
- Clear browser cache
- Check if files are in the correct location
- Verify JSON syntax is valid

**Background not showing?**
- Check file path and name
- Ensure image file exists
- Try different image formats (jpg, png, webp)

Your website will automatically load and display all content from these JSON files when visitors access your site!