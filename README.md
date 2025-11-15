# AI Content Generator

A powerful SaaS platform that leverages the OpenAI API to generate high-quality marketing content, blog posts, and social media captions. Built with modern web technologies for a seamless user experience.


## Usage

### Generating Content

1. Select a content type filter (Blog, Marketing, or Social Media)
2. Choose a template from the list
3. Fill in the required input fields
4. Click "Generate Content"
5. View, copy, or download your generated content

### Managing History

1. Click "View History" in the header
2. Browse your previously generated content
3. Filter by content type
4. Export content in your preferred format
5. Delete content you no longer need


## Database Schema

The application uses a simple SQLite database with the following schema:

```prisma
model GeneratedContent {
  id          String   @id @default(cuid())
  title       String
  content     String
  contentType String   // 'blog', 'marketing', 'social-media'
  template    String   // Template name used
  prompt      String   // User's input prompt
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```


## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add your `OPENAI_API_KEY` environment variable in Vercel settings
4. Deploy!

**Note**: For production, consider using a more robust database like PostgreSQL instead of SQLite.

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS
- Google Cloud

Make sure to:
1. Set the `OPENAI_API_KEY` environment variable
2. Configure the database for production use
3. Run `npx prisma migrate deploy` during deployment

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


