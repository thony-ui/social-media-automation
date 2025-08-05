import { IGenerateContentRequest } from "../modules/posts/domain/posts.interface";

export const generateSocialMediaPrompt = (
  data: IGenerateContentRequest
): string => {
  return `Generate ${data.numberOfPosts} social media posts for "${data.brandName}" selling "${data.productDescription}" targeting "${data.targetAudience}".

Requirements:
- Use formal, professional tone
- Create engaging captions (max 2200 characters)
- Include relevant hashtags (max 280 characters)
- Generate descriptive image prompts
- Return ONLY valid JSON array, no additional text

Required JSON format:
[
  {
    "caption": "string",
    "hashtags": "string",
    "platform": "instagram",
    "imagePrompt": "string"
  }
]

Return only the JSON array with ${data.numberOfPosts} posts. No explanations, no markdown, no additional text.`;
};
