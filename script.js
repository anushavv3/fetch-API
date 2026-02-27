class UserApp {
    constructor() {
        this.allUsers = [];
        this.currentUsers = [];
        this.page = 1;
        this.perPage = 6;
        this.isDark = false;

        this.userGrid = document.getElementById('usersList');
        this.spinner = document.getElementById('loadingSpinner');
        this.errorDiv = document.getElementById('errorBox');
        this.errorMsg = document.getElementById('errorMsg');
        this.fetchButton = document.getElementById('fetchBtn');
        this.exportButton = document.getElementById('exportBtn');
        this.retryButton = document.getElementById('retryBtn');
        this.themeButton = document.getElementById('themeBtn');
        this.searchField = document.getElementById('searchField');
        this.companySelect = document.getElementById('companySelect');
        this.citySelect = document.getElementById('citySelect');
        this.sortSelect = document.getElementById('sortSelect');
        this.userCount = document.getElementById('userCount');
        this.cityCount = document.getElementById('cityCount');
        this.companyCount = document.getElementById('companyCount');
        this.websiteCount = document.getElementById('websiteCount');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.pageNumbers = document.getElementById('pageNumbers');

        this.setupListeners();
        this.loadUsers();
    }

    setupListeners() {
        this.fetchButton.addEventListener('click', () => this.loadUsers());
        this.retryButton.addEventListener('click', () => this.loadUsers());
        this.exportButton.addEventListener('click', () => this.exportData());
        this.themeButton.addEventListener('click', () => this.toggleTheme());
        this.searchField.addEventListener('input', () => this.filterData());
        this.companySelect.addEventListener('change', () => this.filterData());
        this.citySelect.addEventListener('change', () => this.filterData());
        this.sortSelect.addEventListener('change', () => this.filterData());
        this.prevBtn.addEventListener('click', () => this.goToPage(this.page - 1));
        this.nextBtn.addEventListener('click', () => this.goToPage(this.page + 1));
    }

    async loadUsers() {
        try {
            this.showSpinner();
            this.hideError();

            const response = await fetch('https://jsonplaceholder.typicode.com/users');

            if (!response.ok) {
                throw new Error(`Status: ${response.status}`);
            }

            const data = await response.json();
            this.allUsers = data;
            this.currentUsers = [...data];

            this.updateStats();
            this.populateFilters();
            this.filterData();

        } catch (err) {
            console.log('Fetch error:', err);
            this.showError('Failed to load users. Check your connection.');
        } finally {
            this.hideSpinner();
        }
    }

    renderUsers() {
        const start = (this.page - 1) * this.perPage;
        const end = start + this.perPage;
        const users = this.currentUsers.slice(start, end);

        this.userGrid.innerHTML = '';

        if (users.length === 0) {
            this.userGrid.innerHTML = '<p style="text-align: center; padding: 40px;">No users match your criteria</p>';
            return;
        }

        users.forEach(user => {
            const card = this.createCard(user);
            this.userGrid.appendChild(card);
        });

        this.updatePagination();
    }

    createCard(user) {
        const div = document.createElement('div');
        div.className = 'user-card';

        const address = `${user.address.suite}, ${user.address.street}`;
        const city = `${user.address.city}, ${user.address.zipcode}`;

        div.innerHTML = `
            <div class="card-header">
                <h3>${user.name}</h3>
                <span>#${user.id}</span>
            </div>
            <div class="card-body">
                <p><i class="fas fa-user"></i> @${user.username}</p>
                <p><i class="fas fa-envelope"></i> <a href="mailto:${user.email}">${user.email}</a></p>
                <p><i class="fas fa-phone"></i> ${user.phone}</p>
                <p><i class="fas fa-globe"></i> <a href="http://${user.website}" target="_blank">${user.website}</a></p>
                <div class="address-box">
                    <p><i class="fas fa-map-marker-alt"></i> ${address}</p>
                    <p><i class="fas fa-city"></i> ${city}</p>
                    <p><i class="fas fa-building"></i> ${user.company.name}</p>
                </div>
            </div>
        `;

        return div;
    }

    filterData() {
        const searchTerm = this.searchField.value.toLowerCase();
        const company = this.companySelect.value;
        const city = this.citySelect.value;
        const sort = this.sortSelect.value;

        this.currentUsers = this.allUsers.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
                                 user.email.toLowerCase().includes(searchTerm) ||
                                 user.address.city.toLowerCase().includes(searchTerm);
            
            const matchesCompany = company === 'all' || user.company.name === company;
            const matchesCity = city === 'all' || user.address.city === city;
            
            return matchesSearch && matchesCompany && matchesCity;
        });

        this.currentUsers.sort((a, b) => {
            if (sort === 'name') return a.name.localeCompare(b.name);
            if (sort === 'email') return a.email.localeCompare(b.email);
            return 0;
        });

        this.page = 1;
        this.renderUsers();
        this.updateStats();
    }

    populateFilters() {
        const companies = [...new Set(this.allUsers.map(u => u.company.name))];
        let companyHtml = '<option value="all">All companies</option>';
        companies.forEach(c => {
            companyHtml += `<option value="${c}">${c}</option>`;
        });
        this.companySelect.innerHTML = companyHtml;

        const cities = [...new Set(this.allUsers.map(u => u.address.city))];
        let cityHtml = '<option value="all">All cities</option>';
        cities.forEach(c => {
            cityHtml += `<option value="${c}">${c}</option>`;
        });
        this.citySelect.innerHTML = cityHtml;
    }

    updateStats() {
        this.userCount.textContent = this.currentUsers.length;
        
        const uniqueCities = new Set(this.currentUsers.map(u => u.address.city));
        this.cityCount.textContent = uniqueCities.size;
        
        const uniqueCompanies = new Set(this.currentUsers.map(u => u.company.name));
        this.companyCount.textContent = uniqueCompanies.size;
        
        const websites = this.currentUsers.filter(u => u.website).length;
        this.websiteCount.textContent = websites;
    }

    updatePagination() {
        const total = Math.ceil(this.currentUsers.length / this.perPage);
        
        this.prevBtn.disabled = this.page === 1;
        this.nextBtn.disabled = this.page === total;
        
        this.pageNumbers.innerHTML = '';
        for (let i = 1; i <= total; i++) {
            const btn = document.createElement('button');
            btn.className = `page-num ${i === this.page ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => this.goToPage(i);
            this.pageNumbers.appendChild(btn);
        }
    }

    goToPage(pageNum) {
        this.page = pageNum;
        this.renderUsers();
    }

    exportData() {
        const headers = ['Name', 'Username', 'Email', 'Phone', 'Website', 'City', 'Company'];
        const rows = this.currentUsers.map(u => [
            u.name,
            u.username,
            u.email,
            u.phone,
            u.website,
            u.address.city,
            u.company.name
        ]);
        
        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.join(',') + '\n';
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'users.csv';
        link.click();
        URL.revokeObjectURL(url);
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        document.body.classList.toggle('dark', this.isDark);
        this.themeButton.innerHTML = this.isDark ? 
            '<i class="fas fa-sun"></i> Light' : 
            '<i class="fas fa-moon"></i> Dark';
    }

    showSpinner() {
        this.spinner.classList.remove('hidden');
        this.userGrid.classList.add('hidden');
    }

    hideSpinner() {
        this.spinner.classList.add('hidden');
        this.userGrid.classList.remove('hidden');
    }

    showError(msg) {
        this.errorMsg.textContent = msg;
        this.errorDiv.classList.remove('hidden');
        this.userGrid.classList.add('hidden');
    }

    hideError() {
        this.errorDiv.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UserApp();
});