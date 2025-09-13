# Learners Digital Website - Media Management Guide

This guide explains how to add, update, and manage media content (videos, photos, and documents) on the Learners Digital website.

## 📁 Directory Structure

```
assets/media/
├── corporates/
│   ├── media-data.json          # Corporate media configuration
│   ├── photos/                  # Corporate photos
│   ├── pdfs/                    # Corporate documents
│   └── videos/                  # Video metadata files
└── universities/
    ├── media-data.json          # University media configuration
    ├── photos/                  # University photos
    ├── pdfs/                    # University documents
    └── videos/                  # Video metadata files
```

## 🎥 Adding Videos

### Step 1: Upload Video to YouTube
1. Upload your video to YouTube
2. Copy the YouTube URL (e.g., `https://youtu.be/VIDEO_ID`)

### Step 2: Update Media Data JSON
Edit the appropriate `media-data.json` file:

**For Corporate Videos:** `assets/media/corporates/media-data.json`
**For University Videos:** `assets/media/universities/media-data.json`

Add a new video object to the `videos` array:

```json
{
    "videos": [
        {
            "id": 3,
            "ytLink": "https://youtu.be/YOUR_VIDEO_ID",
            "title": "Your Video Title",
            "description": "Detailed description of the video content, what it shows, and its purpose."
        }
    ]
}
```

### Step 3: Video Display Order
- Videos are displayed in **descending order by ID** (highest ID first)
- To make a video appear first, give it the highest ID number
- To make a video appear last, give it the lowest ID number

### Step 4: Optional - Create Video Metadata File
You can also create a `.txt` file in the `videos/` folder with the same information:

```
https://youtu.be/YOUR_VIDEO_ID
Your Video Title
Your video description here
```

## 📸 Adding Photos

### Step 1: Prepare Your Images
- **Recommended formats:** JPG, PNG, WebP
- **Recommended size:** 800x600px or similar aspect ratio
- **File naming:** Use descriptive names (e.g., `workshop_session_1.jpg`)

### Step 2: Upload Photos
Place your image files in the appropriate directory:
- **Corporate photos:** `assets/media/corporates/photos/`
- **University photos:** `assets/media/universities/photos/`

### Step 3: Update Media Data JSON
Add photo entries to the `photos` array:

```json
{
    "photos": [
        {
            "id": 3,
            "filename": "your_image.jpg",
            "title": "Photo Title",
            "description": "Brief description of what the photo shows"
        }
    ]
}
```

### Step 4: Photo Display Order
- Photos are displayed in **ascending order by ID** (lowest ID first)
- To make a photo appear first, give it the lowest ID number
- Photos are displayed in a responsive grid layout

## 📄 Adding Documents (PDFs)

### Step 1: Prepare Your PDF
- Ensure the PDF is optimized for web viewing
- Use descriptive filenames (e.g., `partnership_brochure_2024.pdf`)

### Step 2: Upload PDFs
Place your PDF files in the appropriate directory:
- **Corporate documents:** `assets/media/corporates/pdfs/`
- **University documents:** `assets/media/universities/pdfs/`

### Step 3: Update Media Data JSON
Add document entries to the `documents` array:

```json
{
    "documents": [
        {
            "id": 2,
            "filename": "your_document.pdf",
            "title": "Document Title",
            "description": "Brief description of the document content",
            "type": "PDF"
        }
    ]
}
```

### Step 4: Document Display Order
- Documents are displayed in **ascending order by ID** (lowest ID first)
- To make a document appear first, give it the lowest ID number

## 🔄 Updating Existing Media

### To Change Display Order:
1. Edit the `id` field in the JSON file
2. Higher IDs appear first for videos
3. Lower IDs appear first for photos and documents

### To Update Content:
1. Replace the file in the appropriate directory
2. Update the `filename` in the JSON if the name changed
3. Update `title` and `description` as needed

### To Remove Media:
1. Delete the file from the directory
2. Remove the corresponding entry from the JSON file

## 📋 Complete JSON Structure Example

```json
{
    "videos": [
        {
            "id": 2,
            "ytLink": "https://youtu.be/example2",
            "title": "Latest Workshop",
            "description": "Description of the latest workshop session"
        },
        {
            "id": 1,
            "ytLink": "https://youtu.be/example1",
            "title": "Previous Event",
            "description": "Description of a previous event"
        }
    ],
    "photos": [
        {
            "id": 1,
            "filename": "event_photo_1.jpg",
            "title": "Event Photo 1",
            "description": "Description of the first photo"
        },
        {
            "id": 2,
            "filename": "event_photo_2.jpg",
            "title": "Event Photo 2",
            "description": "Description of the second photo"
        }
    ],
    "documents": [
        {
            "id": 1,
            "filename": "brochure_2024.pdf",
            "title": "2024 Partnership Brochure",
            "description": "Comprehensive guide to our services",
            "type": "PDF"
        }
    ]
}
```

## 🎯 Best Practices

### File Naming:
- Use lowercase letters and underscores
- Be descriptive but concise
- Avoid special characters and spaces

### Image Optimization:
- Compress images for web use
- Use appropriate dimensions (800x600px recommended)
- Consider using WebP format for better compression

### Content Guidelines:
- Write clear, descriptive titles
- Provide meaningful descriptions
- Keep descriptions concise but informative
- Use consistent formatting across all media

### Testing:
- Always test your changes in a browser
- Check that all media loads correctly
- Verify the display order is as expected
- Test on both desktop and mobile devices

## 🚨 Important Notes

1. **JSON Syntax:** Always ensure your JSON is valid. Use a JSON validator if unsure.
2. **File Paths:** Use forward slashes (`/`) in file paths, even on Windows.
3. **Case Sensitivity:** File names are case-sensitive.
4. **Backup:** Always backup your media files before making changes.
5. **Browser Cache:** Clear your browser cache after making changes to see updates.

## 🔧 Troubleshooting

### Media Not Loading:
- Check file paths in JSON
- Verify files exist in correct directories
- Check browser console for errors

### Wrong Display Order:
- Verify ID numbers in JSON
- Remember: videos use descending order, photos/documents use ascending order

### JSON Errors:
- Use a JSON validator to check syntax
- Ensure all quotes and brackets are properly closed
- Check for trailing commas (not allowed in JSON)

## 📞 Support

If you encounter issues or need help with media management, please contact the development team or refer to the main project documentation.
