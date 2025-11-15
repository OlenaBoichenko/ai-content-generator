export type ContentType = 'blog' | 'marketing' | 'social-media';

export interface Template {
  id: string;
  name: string;
  description: string;
  contentType: ContentType;
  icon: string;
  prompt: string;
  placeholders: string[];
}

export const templates: Template[] = [
  // Blog Post Templates
  {
    id: 'blog-how-to',
    name: 'How-To Guide',
    description: 'Step-by-step tutorial on a specific topic',
    contentType: 'blog',
    icon: '📝',
    prompt: 'Write a comprehensive how-to guide about {topic}. Include an engaging introduction, clear step-by-step instructions, helpful tips, and a conclusion. Make it informative and easy to follow.',
    placeholders: ['topic']
  },
  {
    id: 'blog-listicle',
    name: 'Listicle',
    description: 'Numbered list article with detailed points',
    contentType: 'blog',
    icon: '📋',
    prompt: 'Write an engaging listicle titled "{title}". Create {number} well-detailed points with explanations for each. Include an introduction and conclusion.',
    placeholders: ['title', 'number']
  },
  {
    id: 'blog-opinion',
    name: 'Opinion Piece',
    description: 'Share your perspective on a topic',
    contentType: 'blog',
    icon: '💭',
    prompt: 'Write an opinion piece about {topic}. Present a clear viewpoint with supporting arguments, examples, and a persuasive conclusion.',
    placeholders: ['topic']
  },
  {
    id: 'blog-news',
    name: 'News Article',
    description: 'Informative news-style article',
    contentType: 'blog',
    icon: '📰',
    prompt: 'Write a news-style article about {topic}. Include key facts, quotes, context, and maintain an objective tone throughout.',
    placeholders: ['topic']
  },

  // Marketing Content Templates
  {
    id: 'marketing-email',
    name: 'Email Campaign',
    description: 'Promotional email for your audience',
    contentType: 'marketing',
    icon: '✉️',
    prompt: 'Write a compelling marketing email for {product/service} targeting {audience}. Include an attention-grabbing subject line, engaging body copy, clear benefits, and a strong call-to-action.',
    placeholders: ['product/service', 'audience']
  },
  {
    id: 'marketing-landing',
    name: 'Landing Page Copy',
    description: 'Conversion-focused landing page content',
    contentType: 'marketing',
    icon: '🎯',
    prompt: 'Create landing page copy for {product/service}. Include a compelling headline, subheadline, key benefits, features, social proof section, and multiple CTAs. Focus on conversion optimization.',
    placeholders: ['product/service']
  },
  {
    id: 'marketing-product',
    name: 'Product Description',
    description: 'Engaging product description for e-commerce',
    contentType: 'marketing',
    icon: '🛍️',
    prompt: 'Write a compelling product description for {product}. Highlight key features, benefits, specifications, and include persuasive language that encourages purchase.',
    placeholders: ['product']
  },
  {
    id: 'marketing-ad',
    name: 'Ad Copy',
    description: 'Short ad copy for various platforms',
    contentType: 'marketing',
    icon: '📢',
    prompt: 'Create short, punchy ad copy for {product/service} targeting {audience}. Write 3 variations with different angles, each under 100 words, with compelling headlines and clear CTAs.',
    placeholders: ['product/service', 'audience']
  },

  // Social Media Templates
  {
    id: 'social-announcement',
    name: 'Product Launch',
    description: 'Announcement post for new products/features',
    contentType: 'social-media',
    icon: '🚀',
    prompt: 'Create an exciting product launch announcement for {product}. Write 3 variations suitable for different platforms (Twitter, LinkedIn, Instagram). Include relevant hashtags and emojis.',
    placeholders: ['product']
  },
  {
    id: 'social-engagement',
    name: 'Engagement Post',
    description: 'Interactive content to boost engagement',
    contentType: 'social-media',
    icon: '💬',
    prompt: 'Create engaging social media posts about {topic} that encourage audience interaction. Include questions, polls ideas, or conversation starters. Write for {platform}.',
    placeholders: ['topic', 'platform']
  },
  {
    id: 'social-educational',
    name: 'Educational Content',
    description: 'Quick tips and informative posts',
    contentType: 'social-media',
    icon: '💡',
    prompt: 'Create educational social media content about {topic}. Write bite-sized tips, facts, or insights in an engaging format. Suitable for carousel posts or thread format.',
    placeholders: ['topic']
  },
  {
    id: 'social-story',
    name: 'Story/Behind-the-Scenes',
    description: 'Authentic storytelling content',
    contentType: 'social-media',
    icon: '🎬',
    prompt: 'Write authentic behind-the-scenes or story content about {topic}. Make it personal, relatable, and engaging. Include suggestions for visual elements.',
    placeholders: ['topic']
  },
  {
    id: 'social-caption',
    name: 'Instagram Caption',
    description: 'Compelling Instagram captions',
    contentType: 'social-media',
    icon: '📸',
    prompt: 'Write 3 different Instagram captions for a post about {topic}. Include one short and punchy, one storytelling-style, and one with a question. Add relevant hashtags for each.',
    placeholders: ['topic']
  },
  {
    id: 'social-thread',
    name: 'Twitter/X Thread',
    description: 'Multi-tweet thread on a topic',
    contentType: 'social-media',
    icon: '🧵',
    prompt: 'Create a Twitter/X thread about {topic}. Write 5-7 tweets that flow together, starting with a hook and ending with a call-to-action. Keep each tweet under 280 characters.',
    placeholders: ['topic']
  }
];

export const getTemplatesByType = (type: ContentType): Template[] => {
  return templates.filter(t => t.contentType === type);
};

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(t => t.id === id);
};
