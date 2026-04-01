import { Outlet } from "react-router-dom"
import { NavCat } from "../shared/navCat"
import { PostCard } from '../shared/postCard'
import { CatCard } from '../shared/catCard'
import { SearchBar } from '../shared/searchBar'
import { useLike } from './hooks/useLike'
import { useSearch } from './webSearch';
import { UserAvatar } from "../shared/userAvatar"
import { PostDetailModal } from './PostDetailModal';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from "react"
import { postService, catService } from '../../service'
import type { PostItem, GalleryCat } from '../../service'
import { request } from "../../utils/myFetch"
import style from "./webHome.module.css"
import pageStyle from "./webHomePage.module.css"

function Home() {
  const [activePage, setActivePage] = useState('life');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsNextCursor, setPostsNextCursor] = useState('');
  const [postsHasMore, setPostsHasMore] = useState(true);
  const { id: detailId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [galleryCats, setGalleryCats] = useState<GalleryCat[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryNextCursor, setGalleryNextCursor] = useState('');
  const [galleryHasMore, setGalleryHasMore] = useState(true);

  const postsLoaderRef = useRef<HTMLDivElement>(null);
  const galleryLoaderRef = useRef<HTMLDivElement>(null);

  const adoptCats = galleryCats.filter(cat => cat.state === 1);

  const showDetailModal = location.pathname.includes('/home/detail/');
  // 搜索 Hook
  const {
    searchKeyword,
    setSearchKeyword,
    searchResults,
    setSearchResults,
    isSearching,
    setIsSearching,
    showSuggestions,
    suggestions,
    hasSearched,
    setHasSearched,
    searchInputRef,
    handleSearchInput,
    performSearch,
    clearSearch,
    selectSuggestion,
  } = useSearch({
    activePage: activePage as 'life' | 'guide' | 'adopt',
    currentPosts: posts,
    currentGallery: galleryCats,
    currentAdopt: adoptCats,
  });
  //使用后端搜索
  const handleSearch = async (keyword: string) => {
    if (!keyword.trim()) {
      clearSearch();
      return;
    }
    setIsSearching(true);
    setHasSearched(true);
    if (activePage === 'life') {
      // 生活页
      await searchPosts(keyword);
    } else {
      // 图鉴和领养页
      performSearch(keyword);
    }

    setIsSearching(false);
  };
  // 点赞 Hook
  const { handleLike } = useLike(setPosts, setSearchResults);

  // 登录状态检查回调
  const handleLoginCheck = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
  };
  // 加载动态
  const loadPosts = async (cursor?: string) => {
    if (postsLoading || !postsHasMore) return;
    setPostsLoading(true);
    try {
      const res = await postService.getPosts(cursor);

      if (res.code === 200 && res.data) {
        if (cursor) {
          setPosts(prev => [...prev, ...res.data.posts]);
        } else {
          setPosts(res.data.posts);
        }
        setPostsNextCursor(res.data.next_cursor?.toString() || '');
        setPostsHasMore(res.data.has_more);
      }
    } catch (error) {
      console.error('加载动态失败:', error);
    } finally {
      setPostsLoading(false);
    }
  };
  //动态后端搜索
  const searchPosts = async (keyword: string) => {
    setPostsLoading(true);
    try {
      // 调用接口，传入 keyword
      const res = await postService.getPosts(undefined, keyword);
      if (res.code === 200 && res.data) {
        setSearchResults(res.data.posts);
        setPostsNextCursor(res.data.next_cursor?.toString() || '');
        setPostsHasMore(res.data.has_more);
      }
    } catch (error) {
      console.error('搜索动态失败:', error);
    } finally {
      setPostsLoading(false);
    }
  };
  // 加载图鉴
  const loadGallery = async (cursor?: string) => {
    if (galleryLoading || !galleryHasMore) return;
    setGalleryLoading(true);
    try {
      const res = await catService.getGallery(cursor);

      if (res.code === 200 && res.data) {
        if (cursor) {
          setGalleryCats(prev => [...prev, ...res.data.cats]);
        } else {
          setGalleryCats(res.data.cats);
        }
        setGalleryNextCursor(res.data.next_cursor?.toString() || '');
        setGalleryHasMore(res.data.has_more);
      }
    } catch (error) {
      console.error('加载图鉴失败:', error);
    } finally {
      setGalleryLoading(false);
    }
  };
  const closeDetailModal = () => {
    navigate('/home');
  };

  useEffect(() => {
    loadPosts();
    loadGallery();
  }, []);

  // 无限滚动逻辑...
  useEffect(() => {
    if (activePage !== 'life') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !postsLoading && postsHasMore) {
          loadPosts(postsNextCursor);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    if (postsLoaderRef.current) observer.observe(postsLoaderRef.current);
    return () => observer.disconnect();
  }, [activePage, postsLoading, postsHasMore, postsNextCursor]);

  useEffect(() => {
    if (activePage !== 'guide') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !galleryLoading && galleryHasMore) {
          loadGallery(galleryNextCursor);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    if (galleryLoaderRef.current) observer.observe(galleryLoaderRef.current);
    return () => observer.disconnect();
  }, [activePage, galleryLoading, galleryHasMore, galleryNextCursor]);

  const switchToLife = () => {
    clearSearch();
    setActivePage('life');
  }
  const switchToGuide = () => {
    clearSearch();
    setActivePage('guide');
  }
  const switchToAdopt = () => {
    clearSearch();
    setActivePage('adopt');
  }

  // 返回按钮组件
  const BackButton = () => (
    <div className={style.backButtonContainer}>
      <button className={style.backButton} onClick={() => {
        clearSearch();
        loadPosts;
      }}>
        返回全部
      </button>
    </div>
  );

  return (
    <div>
      <NavCat />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <SearchBar
          searchKeyword={searchKeyword}
          showSuggestions={showSuggestions}
          suggestions={suggestions}
          searchInputRef={searchInputRef}
          onInputChange={handleSearchInput}
          onSearch={handleSearch}
          onSelectSuggestion={(sug) => {
            setSearchKeyword(sug.name);
            handleSearch(sug.name);
          }}
        />
        <UserAvatar onLoginCheck={handleLoginCheck} />
      </div>

      {/* Chip 标签 */}
      <div className={style.chipbox}>
        <div className={style.chiprow}>
          <div className={`${style.chip} ${activePage === 'life' ? pageStyle.activeChip : ''}`} onClick={switchToLife}>
            <i className="iconfont icon-buoumao"></i>萌宠生活
          </div>
          <div className={`${style.chip} ${activePage === 'guide' ? pageStyle.activeChip : ''}`} onClick={switchToGuide}>
            <i className="iconfont icon-jumao"></i>萌宠图鉴
          </div>
          <div className={`${style.chip} ${activePage === 'adopt' ? pageStyle.activeChip : ''}`} onClick={switchToAdopt}>
            <i className="iconfont icon-lanmao"></i>萌宠领养
          </div>
        </div>
      </div>

      {/* 萌宠生活 */}
      {activePage === 'life' && (
        <div>
          {hasSearched && <BackButton />}
          <div className={style.gridContainer}>
            {hasSearched ? (
              <>
                {isSearching ? <div className={style.emptyState}>搜索中...</div>
                  : searchResults.length === 0 ? <div className={style.emptyState}>未找到相关动态</div>
                    : searchResults.map((post) => <PostCard key={post.post_id} post={post} onLike={handleLike} />)}
              </>
            ) : (
              <>
                {posts.length === 0 && !postsLoading ? <div className={style.emptyState}>暂无动态</div>
                  : posts.map((post) => <PostCard key={post.post_id} post={post} onLike={handleLike} />)}
              </>
            )}
          </div>
          {!hasSearched && (
            <div ref={postsLoaderRef} className={style.loadMoreContainer}>
              {postsLoading && <div>加载中...</div>}
              {!postsHasMore && posts.length > 0 && <div className={style.noMoreText}>没有更多了</div>}
            </div>
          )}
        </div>
      )}

      {/* 萌宠图鉴 */}
      {activePage === 'guide' && (
        <div>
          {hasSearched && <BackButton />}
          <div className={style.gridContainer}>
            {hasSearched ? (
              <>
                {isSearching ? <div className={style.emptyState}>搜索中...</div>
                  : searchResults.length === 0 ? <div className={style.emptyState}>未找到相关猫咪</div>
                    : searchResults.map((cat) => <CatCard key={cat.cat_id} cat={cat} />)}
              </>
            ) : (
              <>
                {galleryCats.length === 0 && !galleryLoading ? <div className={style.emptyState}>暂无图鉴数据</div>
                  : galleryCats.map((cat) => <CatCard key={cat.cat_id} cat={cat} />)}
              </>
            )}
          </div>
          {!hasSearched && (
            <div ref={galleryLoaderRef} className={style.loadMoreContainer}>
              {galleryLoading && <div>加载中...</div>}
              {!galleryHasMore && galleryCats.length > 0 && <div className={style.noMoreText}>没有更多了</div>}
            </div>
          )}
        </div>
      )}

      {/* 萌宠领养 */}
      {activePage === 'adopt' && (
        <div>
          {hasSearched && <BackButton />}
          <div className={style.gridContainer}>
            {hasSearched ? (
              <>
                {isSearching ? <div className={style.emptyState}>搜索中...</div>
                  : searchResults.length === 0 ? <div className={style.emptyState}>未找到待领养猫咪</div>
                    : searchResults.map((cat) => <CatCard key={cat.cat_id} cat={cat} showAdoptBtn />)}
              </>
            ) : (
              <>
                {adoptCats.length === 0 && !galleryLoading ? <div className={style.emptyState}>暂无待领养猫咪</div>
                  : adoptCats.map((cat) => <CatCard key={cat.cat_id} cat={cat} showAdoptBtn />)}
              </>
            )}
          </div>
          {!hasSearched && (
            <div ref={galleryLoaderRef} className={style.loadMoreContainer}>
              {galleryLoading && <div>加载中...</div>}
              {!galleryHasMore && adoptCats.length > 0 && <div className={style.noMoreText}>没有更多了</div>}
            </div>
          )}
        </div>
      )}

      <Outlet />
      {/* 详情弹窗 */}
      {showDetailModal && (
        <PostDetailModal onClose={closeDetailModal} />
      )}
    </div>
  );
}

export default Home;