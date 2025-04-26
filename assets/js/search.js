// Configuration
const DEFAULT_CONFIG = {
  search: {
    minChars: 2,              // Minimum characters before searching
    maxResults: 5,            // Maximum number of results to show
    fields: {                 // Fields to search through
      title: true,            // Allow searching in title
      description: true,      // Allow searching in description
      section: true           // Allow searching in section
    }
  }
};

class FastSearch {
  constructor({
    searchInput, resultsContainer, json,
    searchResultTemplate = null,
    noResultsText = null,
  }) {
    this.searchInput = searchInput;
    this.resultsContainer = resultsContainer;
    this.json = json;
    this.searchResultTemplate = searchResultTemplate;
    this.noResultsText = noResultsText;
    
    this.init();
  }

  init() {
    this.loadSearchIndex();
    // this.initShortcutListener();
    this.searchInput.addEventListener('input', (event) => {
      if (!this.searchIndex) {
        this.resultsContainer.innerHTML = '<li class="search-message">Loading search index...</li>';
        return;
      }
      this.performSearch(this.searchInput.value);
    });
  }

  // Load the search index
  async loadSearchIndex() {
    try {
      const response = await fetch(this.json);
      if (!response.ok) throw new Error('Failed to load search index');
      const data = await response.json();
      
      this.searchIndex = data.map(item => ({
        ...item,
        searchableTitle: item.title?.toLowerCase() || '',
        searchableDesc: item.desc?.toLowerCase() || '',
        searchableSection: item.section?.toLowerCase() || ''
      }));
      } catch (error) {
        console.error('Error loading search index:', error);
      this.resultsContainer.innerHTML = '<li class="search-message">Error loading search index...</li>';
    }
  }

  escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  

  // Simple fuzzy match for single words
  simpleFuzzyMatch(text, term) {
    if (text.includes(term)) return true;
    if (term.length < 3) return false;

    let matches = 0;
    let lastMatchIndex = -1;

    for (let i = 0; i < term.length; i++) {
      const found = text.indexOf(term[i], lastMatchIndex + 1);
      if (found > -1) {
        matches++;
        lastMatchIndex = found;
      }
    }

    return matches === term.length;
  }

  // Check if keyboard event matches shortcut config
  matchesShortcut(event, shortcutConfig) {
    return event.key === shortcutConfig.key &&
           event.metaKey === shortcutConfig.metaKey &&
           event.altKey === shortcutConfig.altKey &&
           event.ctrlKey === shortcutConfig.ctrlKey &&
           event.shiftKey === shortcutConfig.shiftKey;
  }

  initShortcutListener() {
    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      // ESC to close search
      if (event.key === 'Escape' && this.searchInput.focus) {
        this.searchInput.blur();
        this.searchInput.value = '';
        this.resultsContainer.innerHTML = '';
      }
    });
  }
  

  performSearch(term) {
    term = term.toLowerCase().trim();
    
    if (!term || !this.searchIndex) {
      this.resultsContainer.innerHTML = '';
      let resultsAvailable = false;
      return;
    }

    // Split search into terms
    const searchTerms = term.split(/\s+/).filter(t => t.length > 0);
    
    // Search with scoring
    const results = this.searchIndex
      .map(item => {
        let score = 0;
        const matchesAllTerms = searchTerms.every(term => {
          let matched = false;
          
          // Title matches (weighted higher)
          if (DEFAULT_CONFIG.search.fields.title) {
            if (item.searchableTitle.startsWith(term)) {
              score += 3;  // Highest score for prefix matches in title
              matched = true;
            } else if (this.simpleFuzzyMatch(item.searchableTitle, term)) {
              score += 2;  // Good score for fuzzy matches in title
              matched = true;
            }
          }
          
          // Other field matches
          if (!matched) {
            if (DEFAULT_CONFIG.search.fields.description && item.searchableDesc.includes(term)) {
              score += 0.5;  // Lower score for description matches
              matched = true;
            }
            if (DEFAULT_CONFIG.search.fields.section && item.searchableSection.includes(term)) {
              score += 0.5;  // Lower score for section matches
              matched = true;
            }
          }
          
          return matched;
        });

        return {
          item,
          score: matchesAllTerms ? score : 0
        };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, DEFAULT_CONFIG.search.maxResults)
      .map(result => result.item);

    let resultsAvailable = results.length > 0;
    
    if (!resultsAvailable) {
      this.resultsContainer.innerHTML = '<p class="mt-5">Oops! No results found.</p>';
      return;
    }

    const searchItems = results.map( (item) => {
      let categories = '';
      let tags = '';
      if (item.categories) {
        categories = item.categories.join(', ');
        categories = `<div class="me-sm-4"><i class="far fa-folder fa-fw"></i>${categories}</div>`;
      }
      if (item.tags) {
        tags = item.tags.join(', ');
        tags = `<div><i class="fa fa-tag fa-fw"></i>${tags}</div>`
      }
      return `
      <article class="px-1 px-sm-2 px-lg-4 px-xl-0">
        <header>
          <h2><a href="${this.escapeHtml(item.permalink)}">${this.escapeHtml(item.title)}</a></h2>
          <div class="post-meta d-flex flex-column flex-sm-row text-muted mt-1 mb-1">
            ${categories}
            ${tags}
          </div>
        </header>
        <p>${this.escapeHtml(item.contents)}</p>
      </article>
    `;
    }).join('');
    
    this.resultsContainer.innerHTML = searchItems;
  }
}

const search = new FastSearch({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('search-results'),
  json: '/index.json'
});