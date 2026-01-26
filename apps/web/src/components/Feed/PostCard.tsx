import { Link } from 'react-router-dom';
import { formatRelativeTime } from '@hashtribe/shared/utils';
import { Heart, MessageSquare, Share2, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { Post } from '@/stores/postStore';
import { useAuthStore } from '@/stores/authStore';

interface PostCardProps {
    post: Post;
    onLike: (id: string) => void;
    onDelete: (id: string) => void;
    showTribe?: boolean;
}

export function PostCard({ post, onLike, onDelete, showTribe = false }: PostCardProps) {
    const { user } = useAuthStore();
    const isOwner = user?.id === post.user_id;

    return (
        <div className="flex gap-4 p-5 border-b border-charcoal-800 hover:bg-charcoal-900/30 hover:shadow-md hover:border-charcoal-700 transition-all duration-200 last:border-b-0">
            {/* Avatar */}
            <Link to={`/profile/${post.user.username}`} className="flex-shrink-0">
                <img
                    src={post.user.avatar_url || `https://ui-avatars.com/api/?name=${post.user.username}&background=random`}
                    alt={post.user.username}
                    className="w-10 h-10 rounded-full bg-charcoal-700 object-cover"
                />
            </Link>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-1">
                            <Link to={`/profile/${post.user.username}`} className="font-semibold text-white hover:underline text-sm">
                                {post.user.display_name || post.user.username}
                            </Link>
                            <span className="text-xs text-grey-600">@{post.user.username}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            {showTribe && post.tribe && (
                                <>
                                    <Link to={`/tribes/${post.tribe.slug}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-500/10 text-primary-400 text-xs font-medium hover:bg-primary-500/20 hover:text-primary-300 transition-colors">
                                        {post.tribe.name}
                                    </Link>
                                    <span className="text-grey-600">·</span>
                                </>
                            )}
                            <span className="text-xs text-grey-700 hover:text-grey-600 cursor-pointer">
                                {formatRelativeTime(post.created_at)}
                            </span>
                        </div>
                    </div>
                    {isOwner && (
                        <button className="p-2 rounded-full text-grey-500 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200" onClick={() => onDelete(post.id)}>
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Body */}
                <p className="mt-1 text-grey-200 whitespace-pre-wrap break-words text-[15px] leading-normal">
                    {post.content}
                </p>2 text-grey-200 whitespace-pre-wrap break-words text-base leading-relaxed

                {/* Attachments (Placeholder logic) */}
                {post.image_urls && post.image_urls.length > 0 && (
                    <div className="mt-3 rounded-2xl overflow-hidden border border-charcoal-700/60 hover:border-charcoal-600 transition-colors duration-200">
                        {/* Simple grid for multiple images would go here */}
                        <img src={post.image_urls[0]} alt="Post attachment" className="w-full h-auto max-h-96 object-cover" />
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 mt-4 max-w-md">
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-grey-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-200">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs font-medium">{post.replies_count || ''}</span>
                    </button>

                    <button
                        onClick={() => onLike(post.id)}
                        className={clsx(
                            "flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-200",
                            post.liked_by_user ? "text-red-500 bg-red-500/20" : "text-grey-500 hover:text-red-500 hover:bg-red-500/10"
                        )}
                    >
                        <Heart className={clsx("w-4 h-4", post.liked_by_user && "fill-current")} />
                        <span className="text-xs font-medium">{post.likes_count || ''}</span>
                    </button>

                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-grey-500 hover:text-green-400 hover:bg-green-400/10 transition-all duration-200">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
