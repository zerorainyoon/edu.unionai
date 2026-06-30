import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Search, PlusCircle, User, Calendar, Eye, X, Lock, MessageSquare, CornerDownRight, Trash2 } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import type { ApiPost, ApiPostDetail, ApiCommentTree } from '../services/postService';
import mosaicBg from '../assets/background-l1-mosaic.svg';



// Title cleaner (removes category prefixes for clean display)
const getCleanTitle = (title: string): string => {
  return title.replace(/^\[공지\]\s*/, '').replace(/^\[(취업)?후기\]\s*/, '');
};

export const Board: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [searchParams, setSearchParams] = useSearchParams();
  const postIdParam = searchParams.get('post_id');

  // State lists
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 25;

  // Modals state
  const [selectedPost, setSelectedPost] = useState<ApiPostDetail | null>(null);
  const isWriting = searchParams.get('write') === 'true';

  // Private post password check state
  const [passwordTargetPostId, setPasswordTargetPostId] = useState<number | null>(null);
  const [postPassword, setPostPassword] = useState('');

  // Comment input state
  const [newCommentContent, setNewCommentContent] = useState('');
  const [replyTargetCommentId, setReplyTargetCommentId] = useState<number | null>(null);
  const [newReplyContent, setNewReplyContent] = useState('');

  // New Post Form State
  const [newTitle, setNewTitle] = useState('');
  const [writeAuthor, setWriteAuthor] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [writePassword, setWritePassword] = useState('');

  // Load all posts on mount or search
  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await postService.getPosts(searchQuery, 0, 9999);
      setPosts(data);
    } catch (e: any) {
      console.error(e);
      showToast('게시글 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isWriting && !writeAuthor) {
      setWriteAuthor(user?.full_name || user?.email || '');
    }
  }, [isWriting, user, writeAuthor]);

  useEffect(() => {
    setCurrentPage(1);
    loadPosts();
  }, [searchQuery]);

  // Synchronize URL search params with detail view
  useEffect(() => {
    const syncPostDetail = async () => {
      if (!postIdParam) {
        setSelectedPost(null);
        setPasswordTargetPostId(null);
        return;
      }

      const pId = Number(postIdParam);
      if (isNaN(pId)) {
        setSearchParams({});
        return;
      }

      // If we already loaded this post detail, do nothing
      if (selectedPost && selectedPost.id === pId) {
        return;
      }

      try {
        // Try fetching post details. If it's private, backend will return 403 if unauthorized.
        const detail = await postService.getPostDetail(pId);
        setSelectedPost(detail);
      } catch (e: any) {
        // If 403, it means password is required
        if (e.response?.status === 403) {
          // Open password modal
          setPasswordTargetPostId(pId);
        } else {
          console.error(e);
          showToast('게시글을 불러올 수 없습니다.');
          setSearchParams({});
        }
      }
    };

    syncPostDetail();
  }, [postIdParam, user]);

  // Handle post detail fetching (handles private posts)
  const handlePostClick = (post: ApiPost) => {
    setSearchParams({ post_id: String(post.id) });
  };

  // Submit password for private post
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordTargetPostId) return;

    try {
      const detail = await postService.getPostDetail(passwordTargetPostId, postPassword);
      setSelectedPost(detail);
      setPosts(prev => prev.map(p => p.id === passwordTargetPostId ? { ...p, views: p.views + 1 } : p));
      setPasswordTargetPostId(null);
      setPostPassword('');
    } catch (e: any) {
      console.error(e);
      showToast('비밀번호가 틀렸거나 게시글을 읽을 권한이 없습니다.');
    }
  };

  // Create post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      showToast('제목과 내용을 모두 입력해 주세요.');
      return;
    }
    if (!writeAuthor.trim()) {
      showToast('작성자명을 입력해 주세요.');
      return;
    }
    if (isPrivate && !writePassword.trim()) {
      showToast('비공개 게시글은 비밀번호가 필수입니다.');
      return;
    }

    try {
      await postService.createPost({
        title: newTitle.trim(),
        content: newContent.trim(),
        is_private: isPrivate,
        password: isPrivate ? writePassword : undefined,
        author_name: writeAuthor.trim()
      });
      showToast('게시글이 성공적으로 등록되었습니다.');

      // Reset form
      setNewTitle('');
      setWriteAuthor('');
      setNewContent('');
      setIsPrivate(false);
      setWritePassword('');
      setSearchParams({});

      // Reload posts
      loadPosts();
    } catch (e: any) {
      console.error(e);
      showToast('게시글 등록에 실패했습니다.');
    }
  };

  // Delete post
  const handleDeletePost = async (postId: number) => {
    if (!window.confirm('정말 이 게시글을 삭제하시겠습니까? 관련 댓글도 모두 함께 삭제됩니다.')) {
      return;
    }

    try {
      await postService.deletePost(postId);
      showToast('게시글이 삭제되었습니다.');
      setSelectedPost(null);
      loadPosts();
    } catch (e: any) {
      console.error(e);
      showToast('게시글 삭제 권한이 없거나 실패했습니다.');
    }
  };

  // Add top-level comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.is_admin) {
      showToast('댓글은 관리자만 등록할 수 있습니다.');
      return;
    }
    if (!newCommentContent.trim() || !selectedPost) return;

    try {
      await postService.createComment(selectedPost.id, newCommentContent.trim());
      setNewCommentContent('');
      showToast('댓글이 등록되었습니다.');

      // Refresh details
      const detail = await postService.getPostDetail(selectedPost.id);
      setSelectedPost(detail);
    } catch (e: any) {
      console.error(e);
      showToast('댓글 등록에 실패했습니다.');
    }
  };

  // Add nested reply
  const handleAddReply = async (parentId: number) => {
    if (!user || !user.is_admin) {
      showToast('댓글은 관리자만 등록할 수 있습니다.');
      return;
    }
    if (!newReplyContent.trim() || !selectedPost) return;

    try {
      await postService.createComment(selectedPost.id, newReplyContent.trim(), parentId);
      setNewReplyContent('');
      setReplyTargetCommentId(null);
      showToast('답글이 등록되었습니다.');

      // Refresh details
      const detail = await postService.getPostDetail(selectedPost.id);
      setSelectedPost(detail);
    } catch (e: any) {
      console.error(e);
      showToast('답글 등록에 실패했습니다.');
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('이 댓글을 삭제하시겠습니까?')) return;

    try {
      await postService.deleteComment(commentId);
      showToast('댓글이 삭제되었습니다.');

      // Refresh details
      if (selectedPost) {
        const detail = await postService.getPostDetail(selectedPost.id);
        setSelectedPost(detail);
      }
    } catch (e: any) {
      console.error(e);
      showToast('댓글 삭제 권한이 없거나 실패했습니다.');
    }
  };

  // Filter posts on UI
  const filteredPosts = posts;

  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.max(Math.ceil(filteredPosts.length / postsPerPage), 1);

  // Recursive Comment Node Component
  const CommentNode: React.FC<{ comment: ApiCommentTree; depth?: number }> = ({ comment, depth = 0 }) => {
    const isCommentAuthor = user && user.id === comment.user_id;
    const canDeleteComment = isCommentAuthor || (user && user.is_admin);

    return (
      <div className={`flex flex-col gap-2 mt-4 text-xs select-text ${depth > 0 ? 'ml-6 border-l-2 border-slate-100 pl-4' : ''}`}>
        <div className="bg-slate-50 p-4 border border-slate-100/80 shadow-sm relative group">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              {depth > 0 && <CornerDownRight size={12} className="text-slate-400" />}
              <span className="text-xxs px-2 py-0.5 bg-slate-200 text-slate-600">
                교육생 {comment.user_id}
              </span>
              <span className="text-slate-400 font-medium font-mono text-xxs">
                {new Date(comment.created_at).toLocaleString('ko-KR')}
              </span>
            </div>

            {/* Delete button */}
            {canDeleteComment && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity p-1 cursor-pointer"
                title="댓글 삭제"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>

          <p className="mt-2 text-slate-600 font-medium leading-relaxed whitespace-pre-line">
            {comment.content}
          </p>

          {/* Reply activation (Admin only) */}
          {user && user.is_admin && (
            <div className="mt-2.5 flex justify-end">
              <button
                onClick={() => {
                  setReplyTargetCommentId(replyTargetCommentId === comment.id ? null : comment.id);
                  setNewReplyContent('');
                }}
                className="text-xxs font-black text-brand-secondary hover:text-brand-primary underline cursor-pointer"
              >
                {replyTargetCommentId === comment.id ? '답글 취소' : '답글 달기'}
              </button>
            </div>
          )}
        </div>

        {/* Nested reply input box */}
        {replyTargetCommentId === comment.id && (
          <div className="ml-6 border-l-2 border-brand-accent-light/50 pl-4 mt-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="답글 내용을 입력해 주세요..."
                value={newReplyContent}
                onChange={(e) => setNewReplyContent(e.target.value)}
                className="flex-grow px-3 py-2 border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <button
                onClick={() => handleAddReply(comment.id)}
                className="px-4 py-2 bg-brand-secondary hover:bg-brand-primary text-white font-black active:scale-95 transition-all text-xs cursor-pointer"
              >
                등록
              </button>
            </div>
          </div>
        )}

        {/* Recursive rendering of child comments */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-1">
            {comment.replies.map(reply => (
              <CommentNode key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-6xl mx-auto animate-fade-in">

        {selectedPost ? (
          /* Post Detail In-place View */
          <div className="bg-white border border-slate-200 shadow-sm overflow-hidden select-text animate-scale-in">
            {/* Header banner */}
            <div className="bg-slate-900 text-white p-8 relative select-none">
              {selectedPost.is_private && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-xxs px-2.5 py-1 bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    <Lock size={10} />
                    비공개
                  </span>
                </div>
              )}

              <h2 className="text-xl md:text-2xl font-black leading-snug">{getCleanTitle(selectedPost.title)}</h2>

              {/* Meta details */}
              <div className="flex flex-wrap gap-4 mt-5 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1"><User size={13} /> {selectedPost.author_name || '비회원'}</span>
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {new Date(selectedPost.created_at).toLocaleDateString('ko-KR')}
                </span>
                <span className="flex items-center gap-1"><Eye size={13} /> {selectedPost.views}회 조회</span>
              </div>
            </div>

            {/* Content body */}
            <div className="p-8 md:p-10 space-y-8">
              <p className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-line font-medium border-b border-slate-100 pb-8">
                {selectedPost.content}
              </p>

              {/* Comments Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5 select-none">
                  <MessageSquare size={16} className="text-brand-secondary" />
                  댓글 및 피드백 목록 ({selectedPost.comments.length}개)
                </h3>

                {/* Comment rendering */}
                {selectedPost.comments.length > 0 ? (
                  <div className="divide-y divide-slate-100 pr-1">
                    {selectedPost.comments.map(comment => (
                      <CommentNode key={comment.id} comment={comment} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs font-medium text-slate-400 py-6 text-center select-none">
                    등록된 댓글이 없습니다.
                  </p>
                )}

                {/* Admin new comment form */}
                {user && user.is_admin ? (
                  <form onSubmit={handleAddComment} className="mt-4 flex gap-2 select-none">
                    <input
                      type="text"
                      placeholder="관리자 공식 의견을 입력해 주세요..."
                      value={newCommentContent}
                      onChange={(e) => setNewCommentContent(e.target.value)}
                      className="flex-grow px-3.5 py-2.5 border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      required
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white font-black active:scale-95 transition-all text-xs cursor-pointer"
                    >
                      댓글 등록
                    </button>
                  </form>
                ) : (
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-100 text-center select-none">
                    <p className="text-xxs font-bold text-slate-400">
                      🔒 댓글 및 대댓글은 **관리자(Admin) 권한 계정만** 작성할 수 있습니다.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action footer */}
            <div className="bg-slate-50 px-8 py-5 flex justify-between items-center border-t border-slate-150 select-none">
              <button
                onClick={() => setSearchParams({})}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-350 text-slate-700 font-bold text-xs cursor-pointer active:scale-95 transition-all"
              >
                목록으로
              </button>
              {(user?.is_admin || user?.id === selectedPost.user_id) && (
                <button
                  onClick={() => handleDeletePost(selectedPost.id)}
                  className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs cursor-pointer transition-colors"
                >
                  게시글 삭제
                </button>
              )}
            </div>
          </div>
        ) : (
          /* List View */
          <>
            {/* Page Header Banner */}
            <div
              className="relative overflow-hidden bg-[#183544] text-white py-12 px-8 md:py-16 md:px-16 mb-8 shadow-sm animate-fade-in"
              style={{
                backgroundImage: `url(${mosaicBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="relative z-10 w-full text-left select-text">
                <h1 className="text-3xl md:text-5xl font-light mb-4 tracking-tight flex items-center gap-4 text-white">
                  <FileText className="h-10 md:h-9 w-auto text-white stroke-[2]" />
                  <span className="text-4xl md:text-4xl font-bold">통합 게시판</span>
                </h1>
                <p className="text-base md:text-lg text-blue-100/90 leading-relaxed break-keep font-medium">
                  Intel 교육생들을 위한 커뮤니티입니다. 공지사항 확인 및 유용한 취업 팁, 공부 관련 질문들을 자유롭게 나누어 보세요.
                </p>
              </div>
            </div>


            {/* Conditional Render: Write View vs List View */}
            {isWriting ? (
              /* Inline Write View (instead of list) */
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden select-text animate-scale-in">
                {/* Header banner */}
                <div className="bg-slate-900 text-white p-8 relative select-none">
                  <h2 className="text-xl md:text-2xl font-black flex items-center gap-2">
                    <PlusCircle className="text-brand-accent-light" size={24} />
                    새로운 커뮤니티 글 작성
                  </h2>
                  <p className="text-xs text-slate-400 mt-2 font-semibold">동료 교육생 및 강사진과 자유롭게 피드백을 교환해 보세요.</p>
                </div>

                <form onSubmit={handleCreatePost} className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="writer-input" className="block text-xs font-black text-slate-700">작성자 *</label>
                    <input
                      id="writer-input"
                      type="text"
                      value={writeAuthor}
                      onChange={(e) => setWriteAuthor(e.target.value)}
                      title="작성자"
                      placeholder="작성자명을 기입해주세요."
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm font-bold transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-700">글 제목 *</label>
                    <input
                      type="text"
                      placeholder="글의 주요 요점을 드러내는 제목을 기입해주세요."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm font-bold transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-700">상세 본문 내용 *</label>
                    <textarea
                      rows={8}
                      placeholder="질문 사항이나 정보를 성실하게 기재해주세요. 타인에게 불쾌감을 주는 비방글은 예고 없이 삭제될 수 있습니다."
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm font-medium leading-relaxed transition-all"
                      required
                    />
                  </div>

                  {/* Private post option */}
                  <div className="bg-slate-50 border border-slate-150 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="private-checkbox" className="text-sm font-black text-slate-700 flex items-center gap-2 cursor-pointer select-none">
                        <Lock size={16} className="text-slate-400" />
                        이 게시글을 비공개로 등록
                      </label>
                      <input
                        id="private-checkbox"
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => {
                          setIsPrivate(e.target.checked);
                          if (!e.target.checked) setWritePassword('');
                        }}
                        title="이 게시글을 비공개로 등록"
                        className="w-5 h-5 text-brand-primary focus:ring-brand-primary cursor-pointer transition-all"
                      />
                    </div>

                    {isPrivate && (
                      <div className="space-y-2 animate-slide-down">
                        <label className="block text-xs font-black text-slate-600">비공개 게시글 비밀번호 설정 *</label>
                        <input
                          type="password"
                          placeholder="이 게시글을 읽을 때 사용할 비밀번호 입력"
                          value={writePassword}
                          onChange={(e) => setWritePassword(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm font-semibold"
                          required={isPrivate}
                        />
                      </div>
                    )}
                  </div>

                  {/* Footer Buttons */}
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3 select-none">
                    <button
                      type="button"
                      onClick={() => setSearchParams({})}
                      className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm cursor-pointer transition-colors active:scale-95 transition-all"
                    >
                      작성 취소
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-brand-secondary hover:bg-brand-primary text-white font-black text-sm cursor-pointer shadow-sm hover:shadow active:scale-95 transition-all"
                    >
                      글 등록 완료
                    </button>
                  </div>
                </form>
              </div>
            ) : loading ? (
              /* Loading Spinner */
              <div className="flex flex-col items-center justify-center py-24 select-none">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
                <p className="mt-4 text-xs font-bold text-slate-500">데이터를 로드하는 중입니다...</p>
              </div>
            ) : (
              /* Posts Table List */
              <>
                <div className="bg-white border border-slate-200 shadow-sm overflow-hidden select-text">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                          <th className="px-6 py-4.5 text-left font-bold">제목</th>
                          <th className="px-6 py-4.5 w-32 text-center whitespace-nowrap font-bold">작성자</th>
                          <th className="px-6 py-4.5 w-24 text-center whitespace-nowrap font-bold">조회수</th>
                          <th className="px-6 py-4.5 w-36 text-center whitespace-nowrap font-bold">작성일</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentPosts.length > 0 ? (
                          currentPosts.map((post) => {
                            const cleanTitle = getCleanTitle(post.title);

                            return (
                              <tr
                                key={post.id}
                                onClick={() => handlePostClick(post)}
                                className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-1.5">
                                    {post.is_private && <Lock size={13} className="text-slate-400 stroke-[2.5]" />}
                                    <span className="text-slate-800 text-sm tracking-tight hover:text-brand-secondary transition-colors">
                                      {cleanTitle}
                                    </span>
                                    {post.is_private && (
                                      <span className="text-xxs px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-400 font-bold">
                                        비공개
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center text-xs font-semibold text-slate-600 whitespace-nowrap">
                                  {post.author_name || '비회원'}
                                </td>
                                <td className="px-6 py-4 text-center text-xs font-semibold text-slate-400 whitespace-nowrap">
                                  {post.views}
                                </td>
                                <td className="px-6 py-4 text-center text-xs font-semibold text-slate-500 whitespace-nowrap">
                                  {new Date(post.created_at).toLocaleDateString('ko-KR')}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-6 py-16 text-center text-slate-400 font-medium select-none">
                              등록된 게시글이 없습니다.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination & Write button wrapper */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 select-none">
                  {/* Left Spacer to balance the right Write button for centering pagination on desktop */}
                  <div className="hidden sm:block w-28"></div>

                  {/* Pagination buttons */}
                  <div className="flex items-center gap-1.5 justify-center">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer"
                    >
                      이전
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 text-xs font-bold transition-all border cursor-pointer active:scale-95 ${currentPage === page
                            ? 'bg-brand-primary text-white border-brand-primary shadow-sm shadow-brand-primary/10'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer"
                    >
                      다음
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSearchParams({ write: 'true' });
                      setWriteAuthor(user?.full_name || user?.email || '');
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-secondary hover:bg-brand-primary text-white font-black text-xs tracking-wider shadow-sm hover:shadow active:scale-95 transition-all duration-200 cursor-pointer self-end sm:self-auto"
                  >
                    <PlusCircle size={15} />
                    <span>글작성</span>
                  </button>
                </div>

                {/* Search Bar below pagination */}
                <div className="mt-6 flex justify-center w-full select-text">
                  <div className="relative w-full max-w-md">
                    <input
                      type="text"
                      placeholder="제목, 내용, 작성자 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary font-bold text-xs tracking-wide select-text shadow-sm"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Private Post Password Input Modal */}
        {passwordTargetPostId !== null && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white max-w-sm w-full border border-slate-200 shadow-2xl p-6 relative animate-scale-in">
              <button
                onClick={() => {
                  setPasswordTargetPostId(null);
                  setSearchParams({});
                }}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                title="닫기"
                aria-label="닫기"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center mt-2">
                <div className="bg-amber-100 p-3 rounded-full text-amber-600 mb-3">
                  <Lock size={22} className="stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-slate-800">비공개 게시글 비밀번호 입력</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  작성자가 지정한 비밀번호를 입력해 주세요. 작성자 본인이거나 관리자는 비밀번호 입력 없이 접근할 수 있습니다.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-3.5">
                <input
                  type="password"
                  placeholder="게시글 비밀번호 입력"
                  value={postPassword}
                  onChange={(e) => setPostPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-semibold text-center"
                  required
                  autoFocus
                />

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordTargetPostId(null);
                      setSearchParams({});
                    }}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-black text-xs cursor-pointer transition-colors"
                  >
                    게시글 열기
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}



      </div>
    </div>
  );
};

export default Board;
