'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import ThreeThumbnailViewer from "./ThreeThumbnailViewer";
import { getCommentsForModelVersion, addCommentForModelVersion } from "@/features/files/comments.server";

type Comment = {
  id: string;
  text: string;
  createdAt: Date;
  user: {
    clerkId: string;
  };
};

type ModelCardProps = {
  fileName: string;
  fileUrl: string;
  title: string;
  description: string;
  modelId: string;
  latestVersionId?: string;
  onFetchFile: (fileUrl: string) => Promise<void>;
  selectionMode?: boolean;
  isSelected?: boolean;
  onSelectChange?: (checked: boolean) => void;
  onComment: () => void;
};

export default function ModelCard({
  fileName,
  fileUrl,
  title,
  description,
  modelId,
  latestVersionId,
  onFetchFile,
  selectionMode = false,
  isSelected = false,
  onSelectChange,
  onComment,
}: ModelCardProps) {
  const router = useRouter();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  const handleCardClick = () => {
    if (selectionMode && onSelectChange) {
      onSelectChange(!isSelected);
    }
  };

  const openCommentsModal = () => {
    setIsCommentsOpen(true);
    fetchComments();
  };

  const fetchComments = async () => {
    if (!latestVersionId) return;
    setLoadingComments(true);
    try {
      const fetched = await getCommentsForModelVersion(latestVersionId);
      setComments(fetched);
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    if (!latestVersionId) {
      console.error("No latestVersionId provided."); // Debug log
      alert("Unable to add comment: No version ID available.");
      return;
    }

    console.log("Submitting comment:", newComment);

    try {
      await addCommentForModelVersion(latestVersionId, newComment.trim());
      setNewComment(""); // Clear the input field
      fetchComments(); // Refresh comments after adding
      alert("Comment added successfully!");
    } catch (err) {
      console.error("Error adding comment", err);
    }
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        className={`relative w-full max-w-md shadow-lg cursor-pointer transition-transform transform hover:scale-105 ${
          selectionMode && isSelected ? "border-2 border-blue-500" : ""
        }`}
      >
        <CardHeader>
          <h3 className="text-lg font-semibold">{fileName}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </CardHeader>
        <CardContent>
          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <ThreeThumbnailViewer fileUrl={fileUrl} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/authed/modelview/${modelId}`);
            }}
          >
            Model Details
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              openCommentsModal();
            }}
          >
            Comments
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/authed/modelview/${modelId}`);
            }}
          >
            Edit
          </Button>
        </CardFooter>
      </Card>

      {/* Comments Modal */}
      {isCommentsOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Comments for {fileName}</h2>

            {loadingComments ? (
              <p>Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-gray-500 italic mb-4">No comments yet.</p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto mb-4">
                {comments.map((comment) => (
                  <li key={comment.id} className="border-b pb-2">
                    <p>{comment.text}</p>
                    <p className="text-xs text-gray-500">
                      {comment.user?.clerkId} – {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <textarea
              placeholder="Write a comment..."
              className="w-full border p-2 rounded mb-2"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button onClick={handleAddComment}>Submit</Button>
              <Button variant="secondary" onClick={() => setIsCommentsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
