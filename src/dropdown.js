(function() {

    let selectedApprovalLine = null;

    function initDropdown() {
        const container = document.qs('.container');
        const dropdown = createDropdown();
        container.appendChild(dropdown);

        const dropdownHeader = dropdown.qs('#dropdownHeader');
        const dropdownArrow = dropdown.qs('#dropdownArrow');
        const dropdownContent = dropdown.qs('#dropdownContent');
        const dropdownList = dropdown.qs('#dropdownList');
        const searchInput = dropdown.qs('#searchInput');
        const selectedLabel = dropdown.qs('#selectedLabel');
        const selectedPreview = dropdown.qs('#selectedPreview');
        const previewApprovers = dropdown.qs('#previewApprovers');
        const addButton = dropdown.qs('#addButton');

        renderApprovalLines();

        dropdownHeader.addEventListener('click', toggleDropdown);
        searchInput.addEventListener('input', handleSearch);
        addButton.addEventListener('click', handleAddNewLine);

        document.addEventListener('click', (event) => {
            if (!dropdown.contains(event.target)) {
                closeDropdown();
            }
        });
    }

    function createDropdown() {
        const dropdownHTML = `
            <div class="dropdown" id="approvalDropdown">
                <div class="dropdown-header" id="dropdownHeader">
                    <div class="dropdown-header-text">
                        <svg class="dropdown-header-icon" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm9-4h-3v-3h-2v3h-3v2h3v3h2v-3h3v-2z"/>
                        </svg>
                        <span id="selectedLabel">결재선 선택</span>
                    </div>
                    <svg class="dropdown-arrow" id="dropdownArrow" viewBox="0 0 24 24">
                        <path d="M7 10l5 5 5-5z"/>
                    </svg>
                </div>
                <div class="selected-preview" id="selectedPreview">
                    <div class="preview-title">현재 결재선:</div>
                    <div class="preview-approvers" id="previewApprovers"></div>
                </div>
                <div class="dropdown-content" id="dropdownContent">
                    <div class="dropdown-search">
                        <input type="text" placeholder="결재선 검색..." id="searchInput">
                    </div>
                    <div class="dropdown-list" id="dropdownList"></div>
                    <div class="dropdown-footer">
                        <button class="add-button" id="addButton">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                            새 결재선 추가
                        </button>
                    </div>
                </div>
            </div>
        `;
        return $N.createHTMLElement(dropdownHTML);
    }

    function toggleDropdown() {
        const isOpen = dropdownContent.classList.contains('open');
        isOpen ? closeDropdown() : openDropdown();
    }

    function openDropdown() {
        dropdownContent.classList.add('open');
        dropdownArrow.classList.add('open');
        searchInput.focus();
    }

    function closeDropdown() {
        dropdownContent.classList.remove('open');
        dropdownArrow.classList.remove('open');
        searchInput.value = '';
        renderApprovalLines();
    }

    function renderApprovalLines(searchTerm = '') {
        dropdownList.empty();
        const filteredFavorites = approvalLines.favorites.filter(line => line.name.toLowerCase().includes(searchTerm.toLowerCase()));
        const filteredRecent = approvalLines.recent.filter(line => line.name.toLowerCase().includes(searchTerm.toLowerCase()));

        if (filteredFavorites.length > 0) {
            const favoritesSection = $N.el('div', { class: 'dropdown-section' });
            favoritesSection.appendChild($N.el('div', { class: 'dropdown-section-header', text: '자주 사용하는 결재선' }));
            filteredFavorites.forEach(line => favoritesSection.appendChild(createApprovalLineItem(line)));
            dropdownList.appendChild(favoritesSection);
        }

        if (filteredRecent.length > 0) {
            const recentSection = $N.el('div', { class: 'dropdown-section' });
            recentSection.appendChild($N.el('div', { class: 'dropdown-section-header', text: '최근 사용한 결재선' }));
            filteredRecent.forEach(line => recentSection.appendChild(createApprovalLineItem(line)));
            dropdownList.appendChild(recentSection);
        }

        if (filteredFavorites.length === 0 && filteredRecent.length === 0) {
            dropdownList.appendChild($N.el('div', { class: 'no-results', text: searchTerm ? '검색 결과가 없습니다.' : '저장된 결재선이 없습니다.' }));
        }
    }

    function createApprovalLineItem(line) {
        const item = $N.el('div', { class: 'dropdown-item', 'data-id': line.id });
        const itemHeader = $N.el('div', { class: 'dropdown-item-header' });
        itemHeader.appendChild($N.el('div', { class: 'dropdown-item-title', text: line.name }));

        const itemActions = $N.el('div', { class: 'dropdown-item-actions' });
        const favoriteButton = $N.el('button', { class: `dropdown-item-action ${line.isFavorite ? 'favorite' : ''}`, html: line.isFavorite ? '<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>' });
        favoriteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(line.id);
        });
        itemActions.appendChild(favoriteButton);

        const editButton = $N.el('button', { class: 'dropdown-item-action', html: '<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>' });
        editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            handleEditLine(line.id);
        });
        itemActions.appendChild(editButton);

        itemHeader.appendChild(itemActions);
        item.appendChild(itemHeader);

        const approvers = $N.el('div', { class: 'dropdown-item-approvers' });
        line.approvers.forEach((approver, index) => {
            if (index > 0) {
                approvers.appendChild($N.el('span', { class: 'approver-arrow', text: '→' }));
            }
            approvers.appendChild($N.el('span', { text: `${approver.name} (${approver.position})` }));
        });

        item.appendChild(approvers);
        item.addEventListener('click', () => selectApprovalLine(line));

        return item;
    }

    function selectApprovalLine(line) {
        selectedApprovalLine = line;
        selectedLabel.textContent = line.name;
        updatePreview(line);
        closeDropdown();
    }

    function updatePreview(line) {
        previewApprovers.empty();
        line.approvers.forEach((approver, index) => {
            const approverEl = $N.el('div', { class: 'preview-approver' });
            approverEl.appendChild($N.el('div', { class: 'preview-approver-avatar', html: '<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>' }));
            approverEl.appendChild($N.el('div', { class: 'preview-approver-name', text: approver.name }));
            previewApprovers.appendChild(approverEl);

            if (index < line.approvers.length - 1) {
                previewApprovers.appendChild($N.el('div', { class: 'preview-connector' }));
            }
        });
        selectedPreview.classList.add('active');
    }

    function toggleFavorite(id) {
        const favoriteIndex = approvalLines.favorites.findIndex(line => line.id === id);
        if (favoriteIndex > -1) {
            const line = approvalLines.favorites[favoriteIndex];
            line.isFavorite = false;
            approvalLines.favorites.splice(favoriteIndex, 1);
            approvalLines.recent.push(line);
        } else {
            const recentIndex = approvalLines.recent.findIndex(line => line.id === id);
            if (recentIndex > -1) {
                const line = approvalLines.recent[recentIndex];
                line.isFavorite = true;
                approvalLines.recent.splice(recentIndex, 1);
                approvalLines.favorites.push(line);
            }
        }
        renderApprovalLines(searchInput.value);
        if (selectedApprovalLine && selectedApprovalLine.id === id) {
            const updatedLine = findApprovalLineById(id);
            if (updatedLine) {
                selectedApprovalLine = updatedLine;
            }
        }
    }

    function findApprovalLineById(id) {
        return approvalLines.favorites.find(line => line.id === id) || approvalLines.recent.find(line => line.id === id);
    }

    function handleSearch() {
        renderApprovalLines(searchInput.value.trim());
    }

    function handleAddNewLine() {
        alert('새 결재선 추가 기능은 아직 구현되지 않았습니다.');
    }

    function handleEditLine(id) {
        alert(`결재선 ID: ${id} 편집 기능은 아직 구현되지 않았습니다.`);
    }

    document.addEventListener('DOMContentLoaded', initDropdown);
})(); 