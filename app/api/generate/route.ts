import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/app/lib/prisma';
import { getTemplateById } from '@/app/lib/templates';
import { getCurrentUser } from '@/app/lib/auth';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to generate content' },
        { status: 401 }
      );
    }

    // Check if user has already used their attempt
    if (user.attemptUsed) {
      return NextResponse.json(
        { error: 'You have already used your free generation attempt. Thank you for testing our platform!' },
        { status: 403 }
      );
    }

    const { templateId, inputs, customPrompt } = await request.json();

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add your API key to the .env file.' },
        { status: 500 }
      );
    }

    let finalPrompt = '';
    let templateName = 'Custom';
    let contentType = 'blog';

    if (templateId) {
      const template = getTemplateById(templateId);
      if (!template) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }

      
      finalPrompt = template.prompt;
      template.placeholders.forEach((placeholder) => {
        const value = inputs[placeholder] || '';
        finalPrompt = finalPrompt.replace(`{${placeholder}}`, value);
      });

      templateName = template.name;
      contentType = template.contentType;
    } else if (customPrompt) {
      finalPrompt = customPrompt;
    } else {
      return NextResponse.json(
        { error: 'No template or custom prompt provided' },
        { status: 400 }
      );
    }

    // Generate content using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional content writer. Create high-quality, engaging content based on the user\'s requirements.'
        },
        {
          role: 'user',
          content: finalPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const generatedContent = completion.choices[0]?.message?.content || '';

    if (!generatedContent) {
      return NextResponse.json(
        { error: 'Failed to generate content' },
        { status: 500 }
      );
    }

    // Extract title from content (first line or generate a generic one)
    const lines = generatedContent.split('\n').filter(line => line.trim());
    const title = lines[0]?.replace(/^#+\s*/, '').substring(0, 100) || 'Generated Content';

    // Save to database and mark attempt as used
    const savedContent = await prisma.generatedContent.create({
      data: {
        title,
        content: generatedContent,
        contentType,
        template: templateName,
        prompt: finalPrompt,
        userId: user.id,
      },
    });

    // Mark user's attempt as used
    await prisma.user.update({
      where: { id: user.id },
      data: { attemptUsed: true },
    });

    return NextResponse.json({
      id: savedContent.id,
      title: savedContent.title,
      content: savedContent.content,
      contentType: savedContent.contentType,
      template: savedContent.template,
      createdAt: savedContent.createdAt,
      attemptUsed: true,
    });

  } catch (error: unknown) {
    console.error('Error generating content:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to generate content: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
