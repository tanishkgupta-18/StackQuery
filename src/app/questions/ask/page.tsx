"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { ID } from "appwrite";
import { useAuthStore } from "@/store/Auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const questionSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(150, "Title must not exceed 150 characters"),
  content: z
    .string()
    .min(30, "Question content must be at least 30 characters")
    .max(5000, "Content must not exceed 5000 characters"),
  tags: z
    .array(z.string())
    .min(1, "At least one tag is required")
    .max(5, "Maximum 5 tags allowed"),
});

type QuestionForm = z.infer<typeof questionSchema>;

const AskQuestionPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<QuestionForm>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const watchedContent = watch("content");
  const watchedTitle = watch("title");

  // Handle tag addition
  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (
      trimmedTag &&
      !tags.includes(trimmedTag) &&
      tags.length < 5 &&
      trimmedTag.length >= 2
    ) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  // Handle tag removal
  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue("tags", newTags);
  };

  // Handle Enter key for tags
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Submit form
  const onSubmit = async (data: QuestionForm) => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const questionData = {
        title: data.title.trim(),
        content: data.content.trim(),
        tags: data.tags,
        authorId: user.$id,
      };

      const response = await databases.createDocument(
        db,
        questionCollection,
        ID.unique(),
        questionData
      );

      router.push(`/questions/${response.$id}`);
    } catch (error) {
      console.error("Error creating question:", error);
      setSubmitError("Failed to create question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 pt-36">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              You need to be logged in to ask a question.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-20 pt-36">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ask a Question</h1>
          <p className="text-muted-foreground">
            Get help from the community by asking a detailed question.
          </p>
        </div>

        {submitError && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle>Title</CardTitle>
              <CardDescription>
                Be specific and imagine you're asking a question to another person.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Input
                  {...register("title")}
                  placeholder="e.g., How do I implement authentication in Next.js?"
                  className={errors.title ? "border-red-500" : ""}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {errors.title ? (
                      <span className="text-red-500">{errors.title.message}</span>
                    ) : (
                      "Minimum 10 characters"
                    )}
                  </span>
                  <span>{watchedTitle?.length || 0}/150</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>What are the details of your problem?</CardTitle>
              <CardDescription>
                Introduce the problem and expand on what you put in the title. 
                Include what you've tried and what you expected to happen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Textarea
                  {...register("content")}
                  placeholder="Describe your problem in detail..."
                  rows={12}
                  className={errors.content ? "border-red-500" : ""}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {errors.content ? (
                      <span className="text-red-500">{errors.content.message}</span>
                    ) : (
                      "Minimum 30 characters"
                    )}
                  </span>
                  <span>{watchedContent?.length || 0}/5000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add up to 5 tags to describe what your question is about.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="e.g., javascript, react, nextjs"
                    className="flex-1"
                    disabled={tags.length >= 5}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    disabled={tags.length >= 5 || !tagInput.trim()}
                    variant="outline"
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="pr-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {errors.tags && (
                  <p className="text-sm text-red-500">{errors.tags.message}</p>
                )}

                <div className="text-sm text-muted-foreground">
                  {tags.length}/5 tags • Press Enter or click + to add tags
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting Question...
                </>
              ) : (
                "Post Your Question"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Writing a good question</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• <strong>Search first:</strong> Make sure your question hasn't been asked before</p>
              <p>• <strong>Be specific:</strong> Include relevant details and context</p>
              <p>• <strong>Show your work:</strong> Include code you've tried and error messages</p>
              <p>• <strong>Use proper formatting:</strong> Format code blocks and use clear language</p>
              <p>• <strong>Add relevant tags:</strong> Help others find and answer your question</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AskQuestionPage;