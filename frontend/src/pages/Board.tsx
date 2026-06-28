import React, { useState } from 'react';
import { FileText, Search, PlusCircle, User, Calendar, Eye, Tag, X } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

interface Post {
  id: string;
  category: 'notice' | 'free' | 'review';
  title: string;
  content: string;
  author: string;
  date: string;
  views: number;
  tags: string[];
}

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    category: 'notice',
    title: '[공지] WORK.AI 대한상공회의소 신기술 핵심 실무 인재 교육생 가이드',
    content: '안녕하세요. 대한상공회의소 WORK.AI 교육운영팀입니다. 본 과정은 기업 맞춤형 실무 프로젝트 중심의 훈련으로, 국민내일배움카드 발급 이후 원활한 출석 관리와 훈련 장려금 수급을 위해 반드시 첨부된 가이드 문서를 다운로드 받아 숙지해 주시기 바랍니다. 교육에 참여해 주신 모든 분들의 취업 성공을 진심으로 기원합니다.',
    author: '운영자',
    date: '2026-06-25',
    views: 142,
    tags: ['공지사항', '가이드라인', '내일배움카드']
  },
  {
    id: 'post-2',
    category: 'review',
    title: '[취업후기] 비전공자에서 1금융권 백엔드 개발자 취업 성공 인터뷰',
    content: '화학과 출신으로 코딩의 "코" 자도 모른 채 대한상공회의소 WORK.AI 훈련에 합류했습니다. 초반 1~2달은 자바와 스프링 부트 개념을 따라가기 벅찼지만 강사님의 세심한 밀착 피드백과 함께 파이널 팀 프로젝트에서 금융 거래 실무 API 서버를 직접 구축해본 경험이 면접에서 큰 빛을 발했습니다. 비전공자분들 모두 포기하지 마세요!',
    author: '이*민',
    date: '2026-06-24',
    views: 310,
    tags: ['합격수기', '금융권', '자바백엔드']
  },
  {
    id: 'post-3',
    category: 'free',
    title: '스프링 시큐리티 JWT 인증 세션 공부 질문이요!',
    content: '로컬 환경에서는 JWT를 활용한 로그인 인증이 잘 동작하는데, 실제 AWS EC2 리눅스 서버에 빌드해서 배포하니까 쿠키 토큰 세팅이나 CORS 관련 헤더 설정에서 자꾸 403 Forbidden 에러가 터지고 있습니다. CORS 설정에서 허용할 오리진을 와일드카드 대신 구체적으로 적어주어야 하는 걸까요? 선배님들의 조언 부탁드립니다.',
    author: '김*현',
    date: '2026-06-27',
    views: 85,
    tags: ['스프링시큐리티', 'JWT', 'AWS배포']
  },
  {
    id: 'post-4',
    category: 'review',
    title: '[취업후기] K-Digital 과정 수료 후 네이버 라인 서비스 개발팀 최종 합격',
    content: '대기업 코딩 테스트 준비 요령부터 실전 웹 아키텍처 실무 과제까지 워크아이 교육 과정에서 실시간 피드백을 주며 코칭해 준 점이 가장 든든했습니다. 특히 대한상공회의소 협약 네트워크를 통해 다양한 실무 전문가를 직접 멘토로 매칭받아 실질적인 모의 코드 리뷰를 진행해 본 것이 합격에 결정적 요인이 되었습니다.',
    author: '최*우',
    date: '2026-06-26',
    views: 420,
    tags: ['네카라쿠배', '라인합격', '실무포트폴리오']
  }
];

export const Board: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'notice' | 'free' | 'review'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  // Modals state
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // New Post Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'free' | 'review'>('free');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newTagsString, setNewTagsString] = useState('');

  const handlePostClick = (post: Post) => {
    // Increase view count in memory
    setPosts(prev =>
      prev.map(p => p.id === post.id ? { ...p, views: p.views + 1 } : p)
    );
    setSelectedPost({ ...post, views: post.views + 1 });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !newAuthor.trim()) {
      showToast('모든 필수 항목을 입력해주세요.');
      return;
    }

    const tags = newTagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newPost: Post = {
      id: `post-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: newAuthor.trim(),
      date: new Date().toISOString().split('T')[0],
      views: 0,
      tags: tags.length > 0 ? tags : ['일반']
    };

    setPosts(prev => [newPost, ...prev]);
    showToast('새 글이 성공적으로 등록되었습니다.');

    // Reset Form & Close Modal
    setNewTitle('');
    setNewCategory('free');
    setNewContent('');
    setNewAuthor('');
    setNewTagsString('');
    setIsWriteModalOpen(false);
  };

  const categories = [
    { key: 'all', label: '전체글' },
    { key: 'notice', label: '공지사항' },
    { key: 'review', label: '취업 후기' },
    { key: 'free', label: '자유게시판' }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-6xl mx-auto">

        {/* Banner Section */}
        <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 mb-8 animate-fade-in relative">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 mix-blend-overlay"></div>
          <div className="relative z-10 px-8 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left select-text max-w-xl">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5">
                <FileText className="text-brand-accent-light stroke-[2.5]" size={30} />
                통합 게시판
              </h1>
              <p className="text-slate-400 text-xs md:text-sm mt-2 font-medium leading-relaxed">
                대한상공회의소 교육생들을 위한 커뮤니티입니다. 공지사항 확인 및 유용한 취업 팁, 공부 관련 질문들을 자유롭게 나누어 보세요.
              </p>
            </div>
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="flex items-center gap-1.5 px-5 py-3.5 rounded-2xl bg-brand-secondary hover:bg-brand-primary text-white font-black text-sm tracking-wider shadow-md hover:shadow active:scale-95 transition-all duration-200 cursor-pointer self-stretch md:self-auto justify-center"
            >
              <PlusCircle size={18} />
              새 글 작성하기
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 select-text">
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide border cursor-pointer active:scale-95 transition-all duration-200 ${selectedCategory === cat.key
                    ? 'bg-brand-primary text-white border-brand-primary shadow-sm shadow-brand-primary/10'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="제목, 내용, 작성자 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary font-bold text-xs tracking-wide select-text"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          </div>
        </div>

        {/* Posts Table List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden select-text animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4.5 w-24 text-center">구분</th>
                  <th className="px-6 py-4.5">제목</th>
                  <th className="px-6 py-4.5 w-28 text-center">작성자</th>
                  <th className="px-6 py-4.5 w-32 text-center">작성일</th>
                  <th className="px-6 py-4.5 w-24 text-center">조회수</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <tr
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 text-center select-none">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-xxs font-black tracking-wide ${post.category === 'notice'
                              ? 'bg-rose-50 text-rose-700 border border-rose-100'
                              : post.category === 'review'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                        >
                          {post.category === 'notice' ? '공지' : post.category === 'review' ? '후기' : '자유'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-extrabold text-slate-800 text-sm tracking-tight hover:text-brand-secondary transition-colors">
                            {post.title}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {post.tags.map((tag, idx) => (
                              <span key={idx} className="inline-flex items-center gap-0.5 text-xxs font-medium text-slate-400">
                                <Tag size={10} />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-xs font-bold text-slate-600">
                        {post.author}
                      </td>
                      <td className="px-6 py-4 text-center text-xs font-semibold text-slate-500">
                        {post.date}
                      </td>
                      <td className="px-6 py-4 text-center text-xs font-semibold text-slate-400">
                        {post.views}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-slate-400 font-medium select-none">
                      등록된 게시글이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-in select-text">
              {/* Header */}
              <div className="bg-slate-900 text-white p-6 relative">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 transition-colors cursor-pointer select-none"
                >
                  <X size={20} />
                </button>
                <span className={`inline-block px-2.5 py-1 rounded-lg text-xxs font-black tracking-wide bg-brand-primary/30 text-brand-accent-light uppercase mb-2 select-none`}>
                  {selectedPost.category === 'notice' ? '공지사항' : selectedPost.category === 'review' ? '취업 후기' : '자유게시글'}
                </span>
                <h2 className="text-lg md:text-xl font-black leading-snug pr-8">{selectedPost.title}</h2>

                {/* Meta details */}
                <div className="flex flex-wrap gap-4 mt-4 text-xs font-bold text-slate-400 select-none">
                  <span className="flex items-center gap-1"><User size={13} /> {selectedPost.author}</span>
                  <span className="flex items-center gap-1"><Calendar size={13} /> {selectedPost.date}</span>
                  <span className="flex items-center gap-1"><Eye size={13} /> {selectedPost.views}회 조회</span>
                </div>
              </div>

              {/* Content body */}
              <div className="p-6 md:p-8 space-y-6">
                <p className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-line font-medium">
                  {selectedPost.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 select-none">
                  {selectedPost.tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold border border-slate-150">
                      <Tag size={12} className="text-slate-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Close Button footer */}
              <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-150 select-none">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-350 text-slate-700 rounded-xl font-bold text-xs cursor-pointer active:scale-95 transition-all"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Post Form Modal */}
        {isWriteModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-in select-text">
              {/* Header */}
              <div className="bg-slate-900 text-white p-6 relative">
                <button
                  onClick={() => setIsWriteModalOpen(false)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 transition-colors cursor-pointer select-none"
                >
                  <X size={20} />
                </button>
                <h2 className="text-lg font-black flex items-center gap-2">
                  <PlusCircle className="text-brand-accent-light" size={22} />
                  새로운 커뮤니티 글 작성
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-semibold">동료 교육생 및 강사진과 자유롭게 피드백을 교환해 보세요.</p>
              </div>

              <form onSubmit={handleCreatePost} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700">작성 카테고리 *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-bold cursor-pointer"
                    >
                      <option value="free">자유게시판</option>
                      <option value="review">취업 후기</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700">작성자 닉네임 *</label>
                    <input
                      type="text"
                      placeholder="예: 홍길동"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700">글 제목 *</label>
                  <input
                    type="text"
                    placeholder="글의 주요 요점을 드러내는 제목을 기입해주세요."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-bold"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700">상세 본문 내용 *</label>
                  <textarea
                    rows={6}
                    placeholder="질문 사항이나 정보를 성실하게 기재해주세요. 타인에게 불쾌감을 주는 비방글은 예고 없이 삭제될 수 있습니다."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-medium leading-relaxed"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700">검색 태그 (선택)</label>
                  <input
                    type="text"
                    placeholder="쉼표(,)로 단어들을 구분하여 입력해 주세요 (예: 스프링, 에러, AWS)"
                    value={newTagsString}
                    onChange={(e) => setNewTagsString(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs font-bold"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5 select-none">
                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs cursor-pointer transition-colors"
                  >
                    작성 취소
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-brand-secondary hover:bg-brand-primary text-white rounded-xl font-black text-xs cursor-pointer shadow-sm hover:shadow active:scale-95 transition-all"
                  >
                    글 등록 완료
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
