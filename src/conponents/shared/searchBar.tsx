import searchDog from '../../assets/img/search.png';
import { SearchSuggestions } from '../web/Home/webSearch';
import style from '../web/webHome.module.css';

interface SearchBarProps {
    searchKeyword: string;
    showSuggestions: boolean;
    suggestions: any[];
    searchInputRef: React.RefObject<HTMLInputElement | null>;
    onInputChange: (value: string) => void;
    onSearch: (keyword: string) => void;
    onSelectSuggestion: (suggestion: any) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    searchKeyword,
    showSuggestions,
    suggestions,
    searchInputRef,
    onInputChange,
    onSearch,
    onSelectSuggestion,
}) => {
    return (
        <div className={`${style.searchwrapper} search-wrapper`} style={{ position: 'relative' }}>
            <input
                ref={searchInputRef}
                className={style.searchinput}
                value={searchKeyword}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSearch(searchKeyword);
                    }
                }}
                placeholder="搜索..."
            />
            <img
                src={searchDog}
                alt="logo"
                className={style.searchDog}
                style={{ cursor: 'pointer' }}
                onClick={() => onSearch(searchKeyword)}
            />
            <SearchSuggestions
                suggestions={suggestions}
                visible={showSuggestions}
                onSelect={onSelectSuggestion}
                searchKeyword={searchKeyword}
            />
        </div>
    );
};