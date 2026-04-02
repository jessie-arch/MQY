import { Outlet } from "react-router-dom"
import { NavCat } from "../shared/navCat"
import { PostCard } from "../shared/postCard"
import { CatCard } from "../shared/catCard"
import { SearchBar } from "../shared/searchBar"
import { useSearch } from "../web/Home/webSearch"
import { useEffect, useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { postService, catService, userService } from '../../service'
import type { PostItem, GalleryCat } from '../../service'
import {MbabyInterest} from './babyInterest/mBabyInterestThing'
import { AddCat } from './addCat/addCat'
import style from "../web/webHome.module.css"
import pageStyle from "../web/webHomePage.module.css"

function MobileHome() {

    const navigate = useNavigate();
    const location = useLocation();
    const isHomeRoot = location.pathname === '/home';
    const restorePage = (location.state as { restorePage?: 'life' | 'guide' | 'adopt'; restoreScrollY?: number } | null)?.restorePage;
    const restoreScrollY = (location.state as { restorePage?: 'life' | 'guide' | 'adopt'; restoreScrollY?: number } | null)?.restoreScrollY;
    const [avatarUrl, setAvatarUrl] = useState<string>('');

    const [activePage, setActivePage] = useState('life');
    const [userRole, setUserRole] = useState('');
    const [showAddCat, setShowAddCat] = useState(false);
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [postsNextCursor, setPostsNextCursor] = useState('');
    const [postsHasMore, setPostsHasMore] = useState(true);

    const [galleryCats, setGalleryCats] = useState<GalleryCat[]>([]);
    const [galleryLoading, setGalleryLoading] = useState(false);
    const [galleryNextCursor, setGalleryNextCursor] = useState('');
    const [galleryHasMore, setGalleryHasMore] = useState(true);

    const postsLoaderRef = useRef<HTMLDivElement>(null);
    const galleryLoaderRef = useRef<HTMLDivElement>(null);

    const adoptCats = galleryCats.filter(cat => cat.state === 1);
    const isAdmin = userRole.toUpperCase() === 'ADMIN';

    //显示发表动态
    const [showAddpost,setShowAddpost] = useState<boolean>(false) 
    const {
        searchKeyword,
        searchResults,
        isSearching,
        showSuggestions,
        suggestions,
        hasSearched,
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
 
    const handleAvatarClick = () => {
        navigate('/user');
    };
    useEffect(() => {
        loadPosts();
        loadGallery();

        const loadUserRole = async () => {
            try {
                const res = await userService.getUserInfo();
                if (res.code === 200 && res.data) {
                    setUserRole(res.data.role);
                    setAvatarUrl(res.data.avatar_url);
                }
            } catch (error) {
                console.error('获取用户信息失败:', error);
            }
        };

        void loadUserRole();
    }, []);

    useEffect(() => {
        if (!isHomeRoot || !restorePage) return;

        setActivePage(restorePage);
        if (typeof restoreScrollY === 'number') {
            window.requestAnimationFrame(() => {
                window.scrollTo({ top: restoreScrollY, behavior: 'auto' });
            });
        }
        navigate('/home', { replace: true, state: null });
    }, [isHomeRoot, restorePage, restoreScrollY, navigate]);

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
    };
    const switchToGuide = () => {
        clearSearch();
        setActivePage('guide');
    };
    const switchToAdopt = () => {
        clearSearch();
        setActivePage('adopt');
    };

    const BackButton = () => (
        <div className={style.backButtonContainer}>
            <button className={style.backButton} onClick={clearSearch}>
                返回全部
            </button>
        </div>
    );

    return (
        <div className={style.all}>
            {isAdmin && showAddCat && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(0,0,0,0.45)' }}>
                    <AddCat onSubmitted={() => setShowAddCat(false)} onCancel={() => setShowAddCat(false)} />
                </div>
            )}
              {/*发表动态 */}
        {showAddpost ? (
            <MbabyInterest      showAddpost={showAddpost}setShowAddpost={setShowAddpost} />
        ) : (
            <div className={`iconfont icon-jiahao1 ${style.maddPost}`} onClick={() => { setShowAddpost(true); }}></div>
        )}
            {isAdmin && !showAddCat && (
                <button
                    type="button"
                    onClick={() => setShowAddCat(true)}
                    style={{ position: 'fixed', right: '5vw', top: '73vh', zIndex: 1100, padding: '8px 12px', borderRadius: 20, background: 'var(--theme-color)', color: '#fff', fontSize: 13, fontWeight: 600 }}
                >
                    添加猫咪
                </button>
            )}
            <NavCat
                showAvatar={true}
                avatarUrl={avatarUrl}
                onAvatarClick={handleAvatarClick}
            />
      
            {/* 搜索栏 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
                <div style={{ flex: 1 }}>
                    <SearchBar
                        searchKeyword={searchKeyword}
                        showSuggestions={showSuggestions}
                        suggestions={suggestions}
                        searchInputRef={searchInputRef}
                        onInputChange={handleSearchInput}
                        onSearch={performSearch}
                        onSelectSuggestion={selectSuggestion}
                    />
                </div>
            </div>

            {/* Chip 标签（移动端也保留，可后续优化） */}
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

            {/* 内容区域 */}
            <div style={{ padding: '0 16px 80px 16px' }}>
                {/* 萌宠生活 */}
                {activePage === 'life' && (
                    <div>
                        {hasSearched && <BackButton />}
                        <div className={style.gridContainer}>
                            {hasSearched ? (
                                <>
                                    {isSearching ? <div className={style.emptyState}>搜索中...</div>
                                        : searchResults.length === 0 ? <div className={style.emptyState}>未找到相关动态</div>
                                            : searchResults.map((post) => <PostCard key={post.post_id} post={post} />)}
                                </>
                            ) : (
                                <>
                                    {posts.length === 0 && !postsLoading ? <div className={style.emptyState}>暂无动态</div>
                                        : posts.map((post) => <PostCard key={post.post_id} post={post} />)}
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
                                            : searchResults.map((cat) => <CatCard key={cat.cat_id} cat={cat} sourcePage='guide' />)}
                                </>
                            ) : (
                                <>
                                    {galleryCats.length === 0 && !galleryLoading ? <div className={style.emptyState}>暂无图鉴数据</div>
                                        : galleryCats.map((cat) => <CatCard key={cat.cat_id} cat={cat} sourcePage='guide' />)}
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
                                            : searchResults.map((cat) => <CatCard key={cat.cat_id} cat={cat} showAdoptBtn sourcePage='adopt' />)}
                                </>
                            ) : (
                                <>
                                    {adoptCats.length === 0 && !galleryLoading ? <div className={style.emptyState}>暂无待领养猫咪</div>
                                        : adoptCats.map((cat) => <CatCard key={cat.cat_id} cat={cat} showAdoptBtn sourcePage='adopt' />)}
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
            </div>

            <Outlet />
        </div>
    );
}

export default MobileHome;