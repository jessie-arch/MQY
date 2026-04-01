import { useState, useEffect, useRef, useCallback } from 'react';
import style from './webHome.module.css';
// 搜索建议词条类型
interface SearchSuggestion {
    id: string | number;
    name: string;
    type?: string;
}

// 搜索建议组件
interface SearchSuggestionsProps {
    suggestions: SearchSuggestion[];
    visible: boolean;
    onSelect: (suggestion: SearchSuggestion) => void;
    searchKeyword: string;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
    suggestions,
    visible,
    onSelect,
    searchKeyword,
}) => {
    if (!visible || suggestions.length === 0) return null;

    const highlightText = (text: string, keyword: string) => {
        if (!keyword) return text;
        const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index) =>
            regex.test(part) ? (
                <span key={index} style={{ color: 'var(--theme-color)', fontWeight: 'bold' }}>
                    {part}
                </span>
            ) : (
                <span key={index}>{part}</span>
            )
        );
    };

    return (
        <div className={style.suggestionsPanel}>
            {suggestions.map((item) => (
                <div
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className={style.suggestionItem}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.backgroundColor = '#f5f5f5';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.backgroundColor = '#fff';
                    }}
                >
                    {highlightText(item.name, searchKeyword)}
                    {item.type && (
                        <span className={style.suggestionType}>
                            {item.type}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

// 搜索 Hook
interface UseSearchProps {
    activePage: 'life' | 'guide' | 'adopt';
    currentPosts: any[];
    currentGallery: any[];
    currentAdopt: any[];
}

export const useSearch = ({
    activePage,
    currentPosts,
    currentGallery,
    currentAdopt,
}: UseSearchProps) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // 获取搜索建议
    const fetchSuggestions = useCallback((keyword: string) => {
        if (!keyword.trim()) {
            setSuggestions([]);
            return;
        }

        let suggestionsList: SearchSuggestion[] = [];

        if (activePage === 'life') {
            const matchedPosts = currentPosts.filter(
                (post) =>
                    post.title?.toLowerCase().includes(keyword.toLowerCase()) ||
                    post.content?.toLowerCase().includes(keyword.toLowerCase()) ||
                    post.publisher?.username?.toLowerCase().includes(keyword.toLowerCase())
            );
            suggestionsList = matchedPosts.slice(0, 5).map((post) => ({
                id: post.post_id,
                name: post.title,
                type: '动态',
            }));
        } else if (activePage === 'guide') {
            const matchedCats = currentGallery.filter((cat) =>
                cat.name?.toLowerCase().includes(keyword.toLowerCase())
            );
            suggestionsList = matchedCats.slice(0, 5).map((cat) => ({
                id: cat.cat_id,
                name: cat.name,
                type: '猫咪',
            }));
        } else if (activePage === 'adopt') {
            const matchedCats = currentAdopt.filter((cat) =>
                cat.name?.toLowerCase().includes(keyword.toLowerCase())
            );
            suggestionsList = matchedCats.slice(0, 5).map((cat) => ({
                id: cat.cat_id,
                name: cat.name,
                type: '待领养猫咪',
            }));
        }

        setSuggestions(suggestionsList);
    }, [activePage, currentPosts, currentGallery, currentAdopt]);

    // 防抖处理搜索输入
    const handleSearchInput = useCallback(
        (value: string) => {
            setSearchKeyword(value);
            setShowSuggestions(true);

            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            searchTimeoutRef.current = setTimeout(() => {
                fetchSuggestions(value);
            }, 300);
        },
        [fetchSuggestions]
    );

    // 执行搜索
    const performSearch = useCallback(
        (keyword: string) => {
            if (!keyword.trim()) {
                clearSearch();
                return;
            }

            setIsSearching(true);
            setHasSearched(true);
            setShowSuggestions(false);

            let results: any[] = [];

            if (activePage === 'life') {
                results = currentPosts.filter(
                    (post) =>
                        post.title?.toLowerCase().includes(keyword.toLowerCase()) ||
                        post.content?.toLowerCase().includes(keyword.toLowerCase()) ||
                        post.publisher?.username?.toLowerCase().includes(keyword.toLowerCase())
                );
            } else if (activePage === 'guide') {
                results = currentGallery.filter(
                    (cat) =>
                        cat.name?.toLowerCase().includes(keyword.toLowerCase())
                );
            } else if (activePage === 'adopt') {
                results = currentAdopt.filter(
                    (cat) =>
                        cat.name?.toLowerCase().includes(keyword.toLowerCase())
                );
            }

            setSearchResults(results);
            setIsSearching(false);
        },
        [activePage, currentPosts, currentGallery, currentAdopt]
    );

    // 清除搜索
    const clearSearch = useCallback(() => {
        setSearchKeyword('');
        setSearchResults([]);
        setHasSearched(false);
        setShowSuggestions(false);
        setSuggestions([]);
        if (searchInputRef.current) {
            searchInputRef.current.value = '';
        }
    }, []);

    // 选择建议词条
    const selectSuggestion = useCallback(
        (suggestion: SearchSuggestion) => {
            setSearchKeyword(suggestion.name);
            performSearch(suggestion.name);
        },
        [performSearch]
    );

    // 清理定时器
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // 点击外部关闭建议面板
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.search-wrapper')) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return {
        searchKeyword,
        searchResults,
        isSearching,
        showSuggestions,
        suggestions,
        hasSearched,
        searchInputRef,
        setIsSearching,
        setHasSearched,
        setSearchKeyword,
        setSearchResults,
        handleSearchInput,
        performSearch,
        clearSearch,
        selectSuggestion,
        setShowSuggestions,
    };
};