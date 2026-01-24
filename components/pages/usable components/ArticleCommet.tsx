// This is a SERVER component (no "use client")

import { CommentForm,CommentsList } from "./ClientCompoentComment";


async function getComments(articleId) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/comments/${articleId}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    const data = await response.json();
    return data.data?.comments || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default async function CommentsSection({ articleId, slug }) {
  // Fetch comments on the server
  const comments = await getComments(articleId);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Comments ({comments.length})
        </h3>
        {comments.length > 0 && (
          <button
            onClick={() => document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#E12827] text-white px-4 py-2 rounded-lg hover:bg-[#c82322] transition-colors text-sm font-medium"
          >
            Add Comment
          </button>
        )}
      </div>

      {/* Client component for form */}
      <CommentForm articleId={articleId} />

      {/* Client component for comments list with interactivity */}
      <CommentsList 
        initialComments={comments} 
        articleId={articleId}
        formatDate={formatDate}
      />
    </div>
  );
}